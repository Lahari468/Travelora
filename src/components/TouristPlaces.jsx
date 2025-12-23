import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// NOTE: This file is a styled, minimalistic version of your TouristPlaces component.
// It includes a small reusable CodeBlock component which always shows a random nature image
// next to the code snippet (so "every code block" has a random nature image).

const API_KEY = "bf40fa58f8af4c5fa2c93d73a34f48f1"; // <-- Replace with your Geoapify key
const API = "http://localhost:3000/users";

// Helper: random nature image (Unsplash source)
const getRandomImage = () => {
  return `https://picsum.photos/seed/${Math.random()}/300/200`;
};


// Small CodeBlock component: shows code text on the left and a random nature image on the right.
const CodeBlock = ({ title, children }) => {
  const img = getRandomImage();
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-4 my-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">{title}</div>
          <pre className="bg-black text-white text-sm rounded-md p-3 overflow-auto" style={{maxHeight: 160}}>
            <code>{children}</code>
          </pre>
        </div>
        <div className="w-full sm:w-44 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-white">
          <img src={img} alt="nature" className="w-full h-36 object-cover" />
        </div>
      </div>
    </div>
  );
};

const TouristPlaces = () => {
  // auth
  const saved = JSON.parse(localStorage.getItem("user") || "null");
  const loggedEmail = saved?.email || null;

  // search / suggestion states
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncer = useRef(null);

  // selected place (string shown in header) and coordinates
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });

  // places & loading / error
  const [places, setPlaces] = useState([]);
  const [loadingCoordinates, setLoadingCoordinates] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [error, setError] = useState("");

  const radius = 5000; // meters

  // --- Suggestions: call Geoapify autocomplete (debounced) ---
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    // debounce
    if (debouncer.current) clearTimeout(debouncer.current);
    debouncer.current = setTimeout(async () => {
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&limit=6&apiKey=${API_KEY}`;
        const resp = await axios.get(url);
        setSuggestions(resp.data.features || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestion fetch error:", err);
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debouncer.current) clearTimeout(debouncer.current);
    };
  }, [query]);

  // --- When a suggestion is picked (or user presses Enter), set coordinates and selected place ---
  const useSelectedSuggestion = (feature) => {
    if (!feature) return;
    const props = feature.properties || {};
    const name = props.formatted || props.name || props.city || "";
    const lat = props.lat;
    const lon = props.lon;
    setSelectedPlaceName(name);
    setCoordinates({ lat, lon });
    setPlaces([]); // clear previous results
    setShowSuggestions(false);
    setQuery(name);
    setError("");
  };

  // --- Fetch nearby tourist places when coordinates change ---
  useEffect(() => {
    if (!coordinates.lat || !coordinates.lon) return;
    setLoadingPlaces(true);
    setError("");

    const fetchPlaces = async () => {
      try {
        const placesUrl = `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${coordinates.lon},${coordinates.lat},${radius}&limit=20&with_photos=true&apiKey=${API_KEY}`;
        const resp = await axios.get(placesUrl);
        setPlaces(resp.data.features || []);
      } catch (err) {
        console.error("Places fetch error:", err);
        setError("Error fetching tourist places.");
      } finally {
        setLoadingPlaces(false);
      }
    };

    fetchPlaces();
  }, [coordinates]);

  // --- Bookmark handler (same logic as before) ---
  const handleBookmark = async (placeObj) => {
    if (!loggedEmail) {
      alert("Please login to bookmark");
      return;
    }

    try {
      const resp = await axios.get(
        `${API}?email=${encodeURIComponent(loggedEmail)}`
      );
      const user = resp.data?.[0];
      if (!user) {
        alert("User not found");
        return;
      }

      const props = placeObj.properties || {};
      const bookmarkItem = {
        place_id: props.place_id || `${Date.now()}`,
        name: props.name || props.formatted || "Unknown place",
        address:
          props.formatted ||
          props.address_line1 ||
          props.address ||
          props.street ||
          "",
        photo: props.photo?.url || null,
        categories: props.categories || [],
        coords: { lat: props.lat || null, lon: props.lon || null },
      };

      const updated = [...(user.bookmarks || []), bookmarkItem];
      await axios.patch(`${API}/${user.id}`, { bookmarks: updated });
      alert(`Bookmarked "${bookmarkItem.name}"!`);
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("Could not save bookmark — check console.");
    }
  };

  // --- Placeholder rendering when nothing searched ---
  const renderPlacelessPlaceholders = () => {
    const placeholders = Array.from({ length: 6 }).map((_, i) => ({
      id: `placeholder-${i}`,
      name: "Nature image",
      address: "Random nature photo",
      photo: getRandomImage(),
    }));

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 text-black">
        {placeholders.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 p-4 flex flex-col border border-gray-100"
          >
            <img
              src={p.photo}
              alt={p.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold mb-1 text-black">{p.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{p.address}</p>
            <button
              disabled
              title="Search a real place to bookmark"
              className="mt-auto bg-blue-600 px-4 py-2 rounded text-white cursor-not-allowed"
            >
              Bookmark
            </button>
          </div>
        ))}
      </div>
    );
  };

  // --- UI & rendering ---
  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Small code block showing keys (each code block has its own random nature image to the right) */}
        <CodeBlock title="API keys (example)">{`const API_KEY = "${API_KEY}"\nconst API = "${API}"`}</CodeBlock>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search place</label>

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // If there is a first suggestion, use it; otherwise try to geocode the query
                  if (suggestions[0]) {
                    useSelectedSuggestion(suggestions[0]);
                  } else if (query.trim().length > 0) {
                    // geocode the query manually using search endpoint
                    (async () => {
                      try {
                        setLoadingCoordinates(true);
                        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
                          query
                        )}&limit=1&apiKey=${API_KEY}`;
                        const resp = await axios.get(url);
                        const feature = resp.data.features?.[0];
                        if (feature) useSelectedSuggestion(feature);
                        else setError("Place not found");
                      } catch (err) {
                        console.error("Geocode on Enter error:", err);
                        setError("Error finding that place.");
                      } finally {
                        setLoadingCoordinates(false);
                      }
                    })();
                  }
                } else if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
              placeholder="Type a city or place (e.g. Goa, Shimla, Paris)"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400 text-black focus:outline-none"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-lg max-h-64 overflow-auto shadow-lg border border-gray-100">
                {suggestions.map((s, idx) => {
                  const props = s.properties || {};
                  const title = props.formatted || props.name || props.city || "";
                  const subtitle =
                    [props.country, props.state, props.city].filter(Boolean).join(
                      " • "
                    ) || props.formatted_address || "";
                  // small thumb (random if none provided)
                  const thumb = props.photo?.url || getRandomImage();
                  return (
                    <li
                      key={s.properties?.place_id || s.id || idx}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                      onClick={() => useSelectedSuggestion(s)}
                    >
                      <img src={thumb} alt={title} className="w-12 h-10 object-cover rounded-sm" />
                      <div className="flex-1">
                        <div className="text-black font-medium">{title}</div>
                        <div className="text-xs text-gray-500">{subtitle}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold mt-6 text-center text-black">
            {selectedPlaceName
              ? `Top Tourist Places Near "${selectedPlaceName}"`
              : "Top Nature Images"}
          </h1>

          {/* Feedback / loader / error */}
          {loadingCoordinates && (
            <p className="text-center text-gray-500 mt-3">Getting coordinates...</p>
          )}
          {loadingPlaces && (
            <p className="text-center text-gray-500 mt-3">
              Fetching tourist places near the selected location...
            </p>
          )}
          {error && <p className="text-center text-red-500 mt-3">{error}</p>}
        </div>

        {/* If nothing selected - placeholders */}
        {!selectedPlaceName && renderPlacelessPlaceholders()}

        {/* Real results */}
        {selectedPlaceName && !loadingPlaces && places.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {places.map((p) => {
              const props = p.properties || {};
              const photo = props.photo?.url || getRandomImage();
              const name = props.name || props.formatted || "Unknown place";
              const address =
                props.formatted || props.address_line1 || props.address || "";
              const categories = props.categories || [];

              return (
                <div
                  key={props.place_id || p.id}
                  className="bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 p-4 flex flex-col border border-gray-100"
                >
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />

                  <h2 className="text-lg font-semibold mb-1 text-black">{name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{address}</p>
                  <p className="text-gray-500 text-xs mb-4">
                    Category: {categories.length > 0 ? categories.join(", ") : "N/A"}
                  </p>

                  <button
                    onClick={() => handleBookmark(p)}
                    className="mt-auto bg-blue-600 px-4 py-2 rounded text-white hover:opacity-90"
                  >
                    Bookmark
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {selectedPlaceName && !loadingPlaces && places.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-6">
            No tourist places found for this location.
          </p>
        )}
      </div>
    </div>
  );
};

export default TouristPlaces;
