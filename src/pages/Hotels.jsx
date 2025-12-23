import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Wifi, Coffee, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllHotels } from '../services/api';

const Hotels = () => {
    const [query, setQuery] = useState('');
    const [allHotels, setAllHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const data = await getAllHotels();
            setAllHotels(data);
            setFilteredHotels(data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    // Levenshtein distance algorithm
    const levenshteinDistance = (a, b) => {
        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(
                            matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1 // deletion
                        )
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setFilteredHotels(allHotels);
            return;
        }

        const searchTerm = query.toLowerCase().trim();

        // Filter hotels based on Levenshtein distance
        // We check against the address (which usually contains the city)
        const filtered = allHotels.filter(hotel => {
            const address = hotel.address.toLowerCase();
            const name = hotel.name.toLowerCase();

            // Direct inclusion check first for performance
            if (address.includes(searchTerm) || name.includes(searchTerm)) return true;

            // Fuzzy match on address words
            const addressWords = address.split(/[\s,]+/);
            const minDistance = Math.min(...addressWords.map(word =>
                levenshteinDistance(word, searchTerm)
            ));

            // Allow a small distance (e.g., 2 edits) relative to string length
            return minDistance <= 2;
        });

        setFilteredHotels(filtered);
    };

    const getAmenityIcon = (amenity) => {
        switch (amenity.toLowerCase()) {
            case 'wifi': return <Wifi className="h-4 w-4" />;
            case 'breakfast': return <Coffee className="h-4 w-4" />;
            case 'pool': return <Droplets className="h-4 w-4" />;
            default: return <Star className="h-4 w-4" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find Your Perfect Stay</h1>
                <p className="mt-4 text-lg text-gray-500">Search hotels by destination</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <Search className="absolute left-4 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Where are you going? (e.g., Paris, Agra)"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value === '') setFilteredHotels(allHotels);
                        }}
                        className="w-full pl-12 pr-32 py-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-medium transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    {filteredHotels.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No hotels found for "{query}". Try another destination.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredHotels.map((hotel) => (
                                <div key={hotel.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative h-48">
                                        <img
                                            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop'}
                                            alt={hotel.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg text-sm font-bold text-indigo-600 shadow-sm flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                                            {hotel.rating}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                                        <div className="flex items-center text-gray-500 text-sm mb-4">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {hotel.address}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                                    {getAmenityIcon(amenity)}
                                                    <span className="ml-1">{amenity}</span>
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">₹{hotel.pricePerNight}</span>
                                                <span className="text-gray-500 text-sm">/night</span>
                                            </div>
                                            <Link
                                                to={`/hotels/${hotel.id}`}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                            >
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Hotels;
