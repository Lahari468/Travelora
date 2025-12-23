import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const HotelCard = ({ hotel }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex flex-col sm:flex-row">
            <div className="sm:w-1/3 h-48 sm:h-auto relative">
                <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                        <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                            <Star className="h-4 w-4 text-green-600 fill-current" />
                            <span className="ml-1 text-sm font-bold text-green-700">{hotel.rating}</span>
                        </div>
                    </div>
                    <div className="flex items-center mt-2 text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.address}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <span className="text-2xl font-bold text-gray-900">₹{hotel.pricePerNight}</span>
                        <span className="text-gray-500 text-sm"> / night</span>
                    </div>
                    <Link
                        to={`/hotels/${hotel.id}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        View & Book
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
