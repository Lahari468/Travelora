import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, getHotelById, getPlaceById, updateUser, deleteUser } from '../services/api';
import { User, Mail, Calendar, MapPin, Hotel, Edit2, Trash2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: user.password || ''
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const bookingData = await getUserBookings(user.id);
                // Enrich booking data with hotel and place details
                const enrichedBookings = await Promise.all(bookingData.map(async (booking) => {
                    try {
                        const hotel = await getHotelById(booking.hotelId);
                        const place = await getPlaceById(booking.placeId);
                        return { ...booking, hotel, place };
                    } catch (e) {
                        return booking;
                    }
                }));
                setBookings(enrichedBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await updateUser(user.id, formData);
            login(updatedUser); // Update context
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response && error.response.status === 404) {
                alert('Session expired or invalid. Please logout and login again.');
                logout();
                navigate('/login');
            } else {
                alert('Failed to update profile.');
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                await deleteUser(user.id);
                logout();
                navigate('/');
                alert('Account deleted successfully.');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account.');
            }
        }
    };

    if (!user) return <div className="text-center py-12">Please login to view profile</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                        <div className="flex flex-col items-center mb-6">
                            <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                                <User className="h-12 w-12" />
                            </div>
                            {!isEditing ? (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-500">Travel Enthusiast</p>
                                </>
                            ) : (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full text-center text-xl font-bold border-b-2 border-indigo-200 focus:border-indigo-600 focus:outline-none mb-2"
                                        placeholder="Your Name"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex items-center text-gray-600">
                                <Mail className="h-5 w-5 mr-3 text-indigo-500" />
                                <span>{user.email}</span>
                            </div>
                            {isEditing && (
                                <div className="flex items-center text-gray-600">
                                    <span className="mr-3 font-semibold w-5 text-center">PW</span>
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="flex-1 border-b border-gray-300 focus:border-indigo-600 focus:outline-none"
                                        placeholder="New Password"
                                    />
                                </div>
                            )}
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 mr-3 text-indigo-500" />
                                <span>Member since {new Date().getFullYear()}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpdateProfile}
                                        className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleDeleteAccount}
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <Hotel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No bookings found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {booking.hotel?.name || 'Hotel Name Unavailable'}
                                                </h3>
                                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {booking.place?.name}, {booking.place?.country}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <span className="block text-gray-500 text-xs uppercase tracking-wide">Check In</span>
                                                <span className="font-medium text-gray-900">{booking.checkIn}</span>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <span className="block text-gray-500 text-xs uppercase tracking-wide">Check Out</span>
                                                <span className="font-medium text-gray-900">{booking.checkOut}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="text-sm text-gray-500">
                                                {booking.rooms} Room(s), {booking.guests} Guest(s)
                                            </div>
                                            <div className="text-lg font-bold text-indigo-600">
                                                ₹{booking.totalPrice}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
