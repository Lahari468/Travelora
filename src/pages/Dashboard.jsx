import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Calendar,
  Bookmark,
  Compass,
  MapPin,
  ArrowRight,
  Search,
} from "lucide-react";
import { getUserBookings } from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings(user.id);
        const confirmed = data.filter(
          (b) => b.status === "confirmed"
        );
        setBookingCount(confirmed.length);
      } catch (err) {
        console.error(err);
      } finally {
        setBookingLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  useEffect(() => {
    setLoading(true);

    const data = [
      {
        id: 1,
        title: "My Bookings",
        description: "View, manage, or cancel your reservations",
        link: "/bookings",
        icon: Calendar,
      },
      {
        id: 2,
        title: "Saved Places",
        description: "Your bookmarked destinations and hotels",
        link: "/bookmarks",
        icon: Bookmark,
      },
      {
        id: 3,
        title: "Explore Trips",
        description: "Discover new destinations and plans",
        link: "/trips",
        icon: Compass,
      },
    ];

    setTimeout(() => {
      setItems(data);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="mx-4 mt-6 rounded-3xl overflow-hidden">
        <div
          className="h-[260px] flex items-center"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(30, 27, 75, 0.9), rgba(49, 46, 129, 0.85)),
              url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80)
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="mt-3 text-indigo-100 max-w-2xl text-lg">
              Your travel dashboard to manage bookings, save places, and plan
              your next adventure.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Your Travel Summary
          </h2>
          <p className="text-gray-500 mt-2">
            A snapshot of your activity on Travelora
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <StatCard
              icon={Calendar}
              title="Bookings"
              value={bookingLoading ? "…" : bookingCount}
              subtitle="Confirmed bookings"
            />
            <StatCard
              icon={Bookmark}
              title="Bookmarks"
              value={user?.bookmarks?.length || 0}
              subtitle="Saved places"
            />
            <StatCard
              icon={MapPin}
              title="Trips"
              value="—"
              subtitle="Upcoming trips"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Quick Actions
          </h2>
          <p className="text-gray-500 mt-2">
            Jump back into your travel planning
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 mb-5">
                      <Icon className="text-indigo-600" size={26} />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center text-indigo-600 font-medium">
                      Go to {item.title}
                      <ArrowRight
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                        size={18}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-lg transition">
    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-indigo-50 mb-4">
      <Icon className="text-indigo-600" size={24} />
    </div>
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
  </div>
);

export default Dashboard;
