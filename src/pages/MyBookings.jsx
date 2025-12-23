import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserBookings,
  cancelBooking,
  getHotelById,
  getPlaceById,
} from "../services/api";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings(user.id);

        const enriched = await Promise.all(
          data.map(async (b) => {
            let hotel = null;
            let place = null;

            if (b.hotelId) {
              try {
                hotel = await getHotelById(b.hotelId);
              } catch {}
            }

            if (b.placeId) {
              try {
                place = await getPlaceById(b.placeId);
              } catch {}
            }

            return { ...b, hotel, place };
          })
        );

        setBookings(enriched);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  // ✅ ONLY CONFIRMED BOOKINGS
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed"
  );

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await cancelBooking(bookingId);

      // remove cancelled booking from UI
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch {
      alert("Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {confirmedBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold">No active bookings</h3>
          <p className="text-gray-500">
            You don’t have any confirmed bookings yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {confirmedBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">
                    {b.hotel?.name || b.packageName}
                  </h3>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {b.place?.name || b.hotel?.location}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  Confirmed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Dates</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(b.checkIn), "MMM d, yyyy")} –{" "}
                      {format(new Date(b.checkOut), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Details</p>
                    <p className="text-sm text-gray-500">
                      {b.rooms} Room(s), {b.guests} Guest(s)
                    </p>
                  </div>
                </div>

                <div className="text-lg font-bold text-right">
                  ₹{b.totalPrice}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleCancel(b.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
