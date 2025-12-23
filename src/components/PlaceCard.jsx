import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateUserBookmarks } from "../services/api";

const PlaceCard = ({ place, isExternal = false }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user?.bookmarks) {
      const marked = user.bookmarks.some((b) =>
        place.id ? b.id === place.id : b.place_id === place.place_id
      );
      setIsBookmarked(marked);
    }
  }, [user, place]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (window.confirm("You need to login to bookmark places. Go to login?")) {
        navigate("/login");
      }
      return;
    }

    const newBookmarks = isBookmarked
      ? user.bookmarks.filter((b) =>
          place.id ? b.id !== place.id : b.place_id !== place.place_id
        )
      : [...(user.bookmarks || []), place];

    try {
      const updatedUser = { ...user, bookmarks: newBookmarks };
      login(updatedUser);
      setIsBookmarked(!isBookmarked);
      await updateUserBookmarks(user.id, newBookmarks);
    } catch (err) {
      console.error("Bookmark update failed", err);
    }
  };

  const linkTo = isExternal
    ? `/places/ext-${place.place_id}?lat=${place.lat}&lon=${place.lon}&name=${encodeURIComponent(
        place.name
      )}`
    : `/places/${place.id}`;

  return (
    <div className="h-full">
      <Link
        to={linkTo}
        className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition h-full flex flex-col overflow-hidden"
      >
        {/* IMAGE */}
        <div className="relative h-48 w-full">
          <img
            src={
              place.images?.[0] ||
              place.image ||
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop"
            }
            alt={place.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* BOOKMARK */}
          <button
            onClick={handleBookmark}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition z-10"
          >
            <Heart
              className={`h-5 w-5 ${
                isBookmarked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">
            {place.name}
          </h3>

          <p className="text-sm text-gray-500">
            {place.city || place.country}
          </p>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-grow">
            {place.description}
          </p>

          <span className="mt-4 text-indigo-600 font-medium text-sm">
            View details →
          </span>
        </div>
      </Link>
    </div>
  );
};

export default PlaceCard;
