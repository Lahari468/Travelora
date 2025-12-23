import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackages, createBooking } from '../services/api';
import { Clock, Check, X, Calendar, MapPin } from 'lucide-react';

const PackageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleBook = async (idParam) => {
  // prefer the idParam passed from the UI, fallback to current pkg
  const packageId = idParam ?? pkg?.id;

  if (!packageId) {
    alert("No package selected to book.");
    return;
  }

  setBookingLoading(true);
  try {
    // try to use the already-loaded `pkg` if it matches the id to avoid an extra fetch
    let selectedPackage = pkg && (pkg.id === packageId || String(pkg.id) === String(packageId))
      ? pkg
      : null;

    // if not available in state, fetch all packages and find it
    if (!selectedPackage) {
      const packages = await getPackages();
      selectedPackage = packages.find(p => p.id === packageId || String(p.id) === String(packageId));
    }

    if (!selectedPackage) {
      alert("Package not found.");
      setBookingLoading(false);
      return;
    }

    // Build a booking payload. Keep it minimal — add fields you need on server.
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    const bookingPayload = {
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      price: selectedPackage.price,
      startDate: selectedPackage.startDate || null, // optional
      userEmail: savedUser?.email || null,
      status: "pending",
      createdAt: new Date().toISOString()
      // add any other fields your booking API requires
    };

    // call your service (createBooking should POST to booking endpoint)
    const created = await createBooking(bookingPayload);

    // success feedback
    alert("Booking created successfully!");
    // optionally navigate to bookings page or booking detail
    navigate("/bookings");
  } catch (error) {
    console.error("Booking error:", error);
    alert("Failed to create booking. Please try again.");
  } finally {
    setBookingLoading(false);
  }
};


    useEffect(() => {
        const fetchPackage = async () => {
            setLoading(true);
            try {
                const packages = await getPackages();
                const found = packages.find(p => p.id === id || p.id === parseInt(id));
                setPkg(found);
            } catch (error) {
                console.error('Error fetching package:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id]);

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (!pkg) return <div className="text-center py-12">Package not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96">
                    <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-8 text-white">
                            <h1 className="text-4xl font-bold">{pkg.name}</h1>
                            <div className="flex items-center mt-2 text-lg">
                                <Clock className="h-5 w-5 mr-2" />
                                {pkg.duration}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
                            <div className="flex flex-wrap gap-2">
                                {pkg.highlights.map((highlight, index) => (
                                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                                        {highlight}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {pkg.itinerary && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary</h2>
                                <div className="space-y-6 border-l-2 border-indigo-200 ml-3 pl-6">
                                    {pkg.itinerary.map((item, index) => (
                                        <div key={index} className="relative">
                                            <div className="absolute -left-[31px] top-0 bg-indigo-600 h-4 w-4 rounded-full border-2 border-white"></div>
                                            <h3 className="text-lg font-bold text-gray-900">Day {item.day}: {item.title}</h3>
                                            <p className="text-gray-600 mt-1">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {pkg.inclusions && (
                                <div>
                                    <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                                        <Check className="h-5 w-5 mr-2" /> Inclusions
                                    </h3>
                                    <ul className="space-y-2">
                                        {pkg.inclusions.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-600 text-sm">
                                                <span className="mr-2">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {pkg.exclusions && (
                                <div>
                                    <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center">
                                        <X className="h-5 w-5 mr-2" /> Exclusions
                                    </h3>
                                    <ul className="space-y-2">
                                        {pkg.exclusions.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-600 text-sm">
                                                <span className="mr-2">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg sticky top-24 border border-gray-200">
                            <div className="text-center mb-6">
                                <span className="text-gray-500 text-lg">Starting from</span>
                                <div className="text-4xl font-bold text-indigo-600 mt-1">₹{pkg.price}</div>
                                <span className="text-sm text-gray-500">per person</span>
                            </div>

                            <button
                                onClick={handleBook}
                                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                Book Now
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-4">
                                *Prices may vary based on dates and availability.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;