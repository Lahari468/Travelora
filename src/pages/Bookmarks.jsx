import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Trash2 } from 'lucide-react';
import { updateUserBookmarks } from '../services/api';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  const { user, login } = useAuth();

  const removeBookmark = async (placeId) => {
    if (!user) return;

    const newBookmarks = user.bookmarks.filter(b => b.id !== placeId);

    try {
      await updateUserBookmarks(user.id, newBookmarks);
      const updatedUser = { ...user, bookmarks: newBookmarks };
      login(updatedUser);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('Failed to remove bookmark');
    }
  };

  if (!user) return <div className="text-center py-12">Please login to view bookmarks</div>;

  // Group bookmarks by city (or place name if city not available)
  const groupedBookmarks = user.bookmarks?.reduce((acc, place) => {
    const key = place.city || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(place);
    return acc;
  }, {}) || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookmarks</h1>

      {(!user.bookmarks || user.bookmarks.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">No bookmarks yet. Go explore and save your favorite places!</p>
          <Link to="/trips" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Explore Trips
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedBookmarks).map(([city, places]) => (
            <div key={city}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
                {city}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place) => (
                  <div key={place.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex">
                    <div className="w-1/3">
                      <img
                        src={place.images?.[0] || place.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop'}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{place.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{place.description}</p>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => removeBookmark(place.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove Bookmark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
