import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../services/api';
import { Clock, Check } from 'lucide-react';

const Plans = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true);
            try {
                const data = await getPackages();
                setPackages(data);
            } catch (error) {
                console.error('Error fetching packages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Curated Travel Plans</h1>
                <p className="mt-4 text-lg text-gray-500">Explore our handpicked holiday packages</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
                        <div className="h-48 relative">
                            <img
                                src={pkg.image}
                                alt={pkg.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-indigo-600 shadow-sm flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {pkg.duration}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                            <div className="flex-1">
                                <ul className="space-y-2 mb-4">
                                    {pkg.highlights.slice(0, 3).map((highlight, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                            <span className="truncate">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div>
                                    <span className="text-2xl font-bold text-gray-900">₹{pkg.price}</span>
                                    <span className="text-xs text-gray-500 block">per person</span>
                                </div>
                                <Link to={`/plans/${pkg.id}`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
