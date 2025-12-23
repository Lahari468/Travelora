import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelById, getPlaceById } from '../services/api';
import BookingForm from '../components/BookingForm';
import { Star, MapPin, Check } from 'lucide-react';

const HotelDetail = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const hotelData = await getHotelById(id);
                setHotel(hotelData);
                const placeData = await getPlaceById(hotelData.placeId);
                setPlace(placeData);
            } catch (error) {
                console.error('Error fetching hotel details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (!hotel) return <div className="text-center py-12">Hotel not found</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                    <div className="h-96 relative">
                        <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                                <div className="flex items-center mt-2 text-gray-500">
                                    <MapPin className="h-5 w-5 mr-1" />
                                    {hotel.address}
                                </div>
                            </div>
                            <div className="flex items-center bg-green-100 px-3 py-1 rounded-lg">
                                <Star className="h-5 w-5 text-green-600 fill-current" />
                                <span className="ml-1 text-xl font-bold text-green-700">{hotel.rating}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {hotel.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center text-gray-600">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-600">
                                Experience luxury and comfort at {hotel.name}. Located near {place?.name},
                                this hotel offers premium amenities and world-class service. Perfect for
                                travelers seeking a memorable stay in {place?.city}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <BookingForm hotel={hotel} place={place} />
                </div>
            </div>
        </div>
    );
};

export default HotelDetail;