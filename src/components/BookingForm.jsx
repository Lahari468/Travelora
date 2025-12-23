import React, { useState, useEffect } from 'react';
import { differenceInCalendarDays, addDays, format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { createBooking, updateHotelRooms } from '../services/api';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ hotel, place }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [rooms, setRooms] = useState(1);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set default dates
    useEffect(() => {
        const today = new Date();
        const tomorrow = addDays(today, 1);
        const dayAfter = addDays(today, 2);
        setCheckIn(format(tomorrow, 'yyyy-MM-dd'));
        setCheckOut(format(dayAfter, 'yyyy-MM-dd'));
    }, []);

    const calculatePrice = () => {
        if (!checkIn || !checkOut) return null;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = differenceInCalendarDays(end, start);

        if (nights <= 0) return null;

        const subtotal = nights * hotel.pricePerNight * rooms;
        const tax = subtotal * 0.12; // 12% tax
        const total = subtotal + tax;

        return { nights, subtotal, tax, total };
    };

    const priceDetails = calculatePrice();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!priceDetails) {
            setError('Invalid dates');
            setIsSubmitting(false);
            return;
        }

        if (rooms > hotel.roomsAvailable) {
            setError(`Only ${hotel.roomsAvailable} rooms available`);
            setIsSubmitting(false);
            return;
        }

        const bookingData = {
            userId: user.id,
            hotelId: hotel.id,
            placeId: place.id,
            checkIn,
            checkOut,
            guests: parseInt(guests),
            rooms: parseInt(rooms),
            totalPrice: priceDetails.total,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        try {
            await createBooking(bookingData);
            await updateHotelRooms(hotel.id, hotel.roomsAvailable - rooms);
            alert('Booking Confirmed!');
            navigate('/bookings');
        } catch (err) {
            console.error(err);
            setError('Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Book your stay</h3>
            <div className="mb-4">
                <span className="text-2xl font-bold text-indigo-600">₹{hotel.pricePerNight}</span>
                <span className="text-gray-500"> / night</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Check-in</label>
                        <input
                            type="date"
                            required
                            min={format(new Date(), 'yyyy-MM-dd')}
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Check-out</label>
                        <input
                            type="date"
                            required
                            min={checkIn ? format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd') : ''}
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Guests</label>
                        <input
                            type="number"
                            min="1"
                            max={rooms * 4} // Assuming max 4 per room
                            required
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rooms</label>
                        <input
                            type="number"
                            min="1"
                            max={hotel.roomsAvailable}
                            required
                            value={rooms}
                            onChange={(e) => setRooms(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>

                {priceDetails && (
                    <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>₹{hotel.pricePerNight} x {priceDetails.nights} nights x {rooms} rooms</span>
                            <span>₹{priceDetails.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Taxes (12%)</span>
                            <span>₹{priceDetails.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>₹{priceDetails.total.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !priceDetails || rooms > hotel.roomsAvailable}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Processing...' : 'Reserve'}
                </button>

                <p className="text-xs text-center text-gray-500 mt-2">
                    You won't be charged yet
                </p>
            </form>
        </div>
    );
};

export default BookingForm;