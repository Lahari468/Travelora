import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getPlaceById, getHotelsByPlaceId } from '../services/api';
import HotelCard from '../components/HotelCard';
import { MapPin, Globe } from 'lucide-react';
import MapViewer from '../components/MapViewer';

const PlaceDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [place, setPlace] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const isExternal = id.startsWith('ext-');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isExternal) {
          // ---------- EXTERNAL PLACE ----------
          const name = searchParams.get('name');
          const lat = parseFloat(searchParams.get('lat'));
          const lng = parseFloat(searchParams.get('lon'));

          setPlace({
            id,
            name,
            city: name,
            country: 'Global',
            description: `Explore the beautiful destination of ${name}. Known for its culture, landmarks, and unique experiences, this place attracts travelers from around the world.`,
            lat,
            lng,
            images: [
              "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80"
            ]
          });

          setHotels([]);
        } else {
          // ---------- LOCAL PLACE ----------
          const [placeData, hotelsData] = await Promise.all([
            getPlaceById(id),
            getHotelsByPlaceId(id)
          ]);

          setPlace(placeData);
          setHotels(hotelsData);
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isExternal, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!place) {
    return <div className="text-center py-16">Place not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ================= HERO ================= */}
      <div className="relative h-[320px] rounded-2xl overflow-hidden shadow-md mb-10">
        <img
          src={place.images?.[0]}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
          <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
            <div className="flex items-center text-lg opacity-90">
              {isExternal ? (
                <Globe className="h-5 w-5 mr-2" />
              ) : (
                <MapPin className="h-5 w-5 mr-2" />
              )}
              {place.city}, {place.country}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10">

          {/* ABOUT */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">
              {place.description}
            </p>
          </section>

          {/* HOTELS */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Hotels Nearby</h2>

            {isExternal ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <p className="text-sm text-yellow-700">
                  Hotel booking is currently not available for global destinations.
                  Please explore our featured destinations.
                </p>
              </div>
            ) : hotels.length > 0 ? (
              <div className="space-y-6">
                {hotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hotels found near this place.</p>
            )}
          </section>
        </div>

        {/* RIGHT MAP */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 h-[320px] rounded-xl overflow-hidden border border-gray-200">
            <MapViewer
              lat={place.lat}
              lng={place.lng}
              name={place.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
