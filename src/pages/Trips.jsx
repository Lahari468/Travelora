import React, { useState, useEffect } from "react";
import { Search, MapPin, Heart, Ruler, Globe } from "lucide-react";
import { getPlaces, updateUserBookmarks } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = "bf40fa58f8af4c5fa2c93d73a34f48f1";

const Trips = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [externalPlaces, setExternalPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [distance, setDistance] = useState(50);

  /* ================= FETCH PLACES ================= */
  const fetchPlaces = async (searchQuery = "") => {
    setLoading(true);
    try {
      // Local places
      const localData = await getPlaces(searchQuery);
      setPlaces(localData);

      // External places (Geoapify)
      if (searchQuery.length > 2) {
        const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchQuery
        )}&limit=1&apiKey=${API_KEY}`;

        const geoResp = await axios.get(geoUrl);
        const feature = geoResp.data.features?.[0];

        if (feature) {
          const { lat, lon } = feature.properties;
          const placesUrl = `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${lon},${lat},${
            distance * 1000
          }&limit=12&with_photos=true&apiKey=${API_KEY}`;

          const placesResp = await axios.get(placesUrl);

          const mapped = placesResp.data.features.map((p) => {
            const props = p.properties;
            return {
              id: props.place_id,
              place_id: props.place_id,
              name: props.name || props.formatted,
              city: props.city || "",
              country: props.country || "",
              description: props.formatted,
              images: [
                props.photo?.url ||
                  `https://picsum.photos/seed/${props.place_id}/400/300`,
              ],
              lat: props.lat,
              lon: props.lon,
              isExternal: true,
            };
          });

          setExternalPlaces(mapped);
        } else {
          setExternalPlaces([]);
        }
      } else {
        setExternalPlaces([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlaces(query);
  };

  /* ================= BOOKMARK ================= */
  const toggleBookmark = async (place) => {
    if (!user) return alert("Please login to bookmark");

    const isSaved = user.bookmarks?.some(
      (b) => b.id === place.id || b.place_id === place.place_id
    );

    const updatedBookmarks = isSaved
      ? user.bookmarks.filter(
          (b) => b.id !== place.id && b.place_id !== place.place_id
        )
      : [...(user.bookmarks || []), place];

    try {
      await updateUserBookmarks(user.id, updatedBookmarks);
      login({ ...user, bookmarks: updatedBookmarks });
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  /* ================= CARD CLICK ================= */
  const openPlace = (place) => {
    if (place.isExternal) {
      navigate(
        `/places/ext-${place.place_id}?lat=${place.lat}&lon=${place.lon}&name=${encodeURIComponent(
          place.name
        )}`
      );
    } else {
      navigate(`/places/${place.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ================= HEADER ================= */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Explore Attractions
      </h1>

      {/* ================= SEARCH BAR ================= */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Where are you going? (e.g., Paris, Agra)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full h-14 pl-14 pr-6
              rounded-full
              border border-gray-200
              shadow-sm
              focus:outline-none
              focus:ring-0
              focus:border-indigo-400
              transition
            "
          />
        </div>
        <button
          type="submit"
          className="h-14 px-10 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>

      {/* ================= RADIUS ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-10">
        <div className="flex justify-between mb-2">
          <span className="flex items-center gap-2 text-gray-700">
            <Ruler className="text-indigo-600" size={18} />
            Search Radius
          </span>
          <span className="font-semibold text-indigo-600">{distance} km</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full" />
        </div>
      ) : (
        <div className="space-y-12">

          {/* ========== EXTERNAL PLACES ========== */}
          {externalPlaces.length > 0 && (
            <Section title="Global Results" icon={Globe}>
              {externalPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onOpen={openPlace}
                  onBookmark={toggleBookmark}
                  bookmarked={user?.bookmarks?.some(
                    (b) => b.place_id === place.place_id
                  )}
                  external
                />
              ))}
            </Section>
          )}

          {/* ========== LOCAL PLACES ========== */}
          {places.length > 0 && (
            <Section title="Local Results">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onOpen={openPlace}
                  onBookmark={toggleBookmark}
                  bookmarked={user?.bookmarks?.some((b) => b.id === place.id)}
                />
              ))}
            </Section>
          )}

          {!places.length && !externalPlaces.length && (
            <div className="text-center py-16 bg-white rounded-xl border">
              <Search className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No places found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ================= SECTION ================= */
const Section = ({ title, icon: Icon, children }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      {Icon && <Icon className="text-indigo-600" size={20} />}
      {title}
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
  </div>
);

/* ================= PLACE CARD ================= */
const PlaceCard = ({ place, onOpen, onBookmark, bookmarked, external }) => (
  <div
    onClick={() => onOpen(place)}
    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
  >
    <div className="relative h-48">
      <img
        src={place.images?.[0]}
        alt={place.name}
        className="w-full h-full object-cover"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBookmark(place);
        }}
        className={`absolute top-4 right-4 p-2 rounded-full ${
          bookmarked ? "bg-red-500 text-white" : "bg-white text-gray-500"
        }`}
      >
        <Heart className={bookmarked ? "fill-current" : ""} size={18} />
      </button>
      {external && (
        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
          External
        </span>
      )}
    </div>
    <div className="p-5">
      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
        {place.name}
      </h3>
      <p className="flex items-center gap-1 text-sm text-gray-500 mb-2">
        <MapPin size={14} />
        {place.city}, {place.country}
      </p>
      <p className="text-sm text-gray-600 line-clamp-2">
        {place.description}
      </p>
    </div>
  </div>
);

export default Trips;
