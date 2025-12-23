import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PlaceCard from "../components/PlaceCard";
import { getPlaces } from "../services/api";
import {
  Compass,
  Hotel,
  Bookmark,
  Calendar
} from "lucide-react";

const Home = () => {
  const [places, setPlaces] = useState([]);
  const featuresRef = useRef(null);

  const heroImage =
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=2200&q=85";

  const reviews = [
    {
      name: "Ananya Sharma",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      review: "Travelora made planning my vacation simple and stress-free.",
      rating: "★★★★★"
    },
    {
      name: "Rahul Verma",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      review: "Booking hotels and discovering attractions was seamless.",
      rating: "★★★★★"
    },
    {
      name: "Sneha Patel",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      review: "Loved the interactive maps and nearby places feature.",
      rating: "★★★★☆"
    }
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getPlaces();
        setPlaces(data.slice(0, 6));
      } catch (err) {
        console.error("Error loading places", err);
      }
    };
    fetchPlaces();
  }, []);

  return (
    <div className="bg-white text-gray-900">

      {/* ================= HERO ================= */}
      <section
        className="relative min-h-[65vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)),
            url(${heroImage})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="max-w-4xl px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Explore the World with
            <span className="block text-indigo-300 mt-2">Travelora</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-6">
            Discover destinations, book hotels, and plan unforgettable journeys —
            all in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/trips"
              className="bg-indigo-600 hover:bg-indigo-700 px-7 py-3 rounded-full font-semibold transition"
            >
              Explore Destinations
            </Link>

            <Link
              to="/hotels"
              className="border border-white px-7 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition"
            >
              Browse Hotels
            </Link>
          </div>

          <p className="mt-5 text-sm text-gray-300">
            Trusted by 10,000+ travelers across India
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section ref={featuresRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <span className="inline-block mb-3 px-4 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
              Why Travelora?
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              Everything you need for
              <span className="block text-indigo-600">
                modern travel planning
              </span>
            </h2>

            <p className="text-gray-600 text-base mb-8 max-w-xl">
              From discovering destinations to managing bookings,
              Travelora makes your journey smooth, smart, and stress-free.
            </p>

            <Link
              to="/trips"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
            >
              Start Exploring →
            </Link>
          </div>

          {/* RIGHT CARDS */}
          <div className="grid sm:grid-cols-2 gap-6">
            <FeatureCard
              icon={Compass}
              title="Smart Discovery"
              text="Explore curated destinations and hidden gems across the globe."
            />
            <FeatureCard
              icon={Hotel}
              title="Easy Hotel Booking"
              text="Compare prices, check reviews, and book hotels in seconds."
            />
            <FeatureCard
              icon={Bookmark}
              title="Save & Revisit"
              text="Bookmark places and plan your trips your way."
            />
            <FeatureCard
              icon={Calendar}
              title="Booking Management"
              text="Track, update, and manage bookings in one dashboard."
            />
          </div>
        </div>
      </section>

      {/* ================= POPULAR DESTINATIONS ================= */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Popular Destinations
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {places.map((place) => (
              <div key={place.id} className="h-full">
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            What Our Travelers Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 p-6 rounded-xl hover:shadow-md transition"
              >
                <div className="flex items-center mb-3">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-11 h-11 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{r.name}</h4>
                    <span className="text-green-600 text-sm">{r.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">“{r.review}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

/* ================= FEATURE CARD ================= */
const FeatureCard = ({ icon: Icon, title, text }) => (
  <div className="p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition">
    <Icon className="w-9 h-9 text-indigo-600 mb-4" />
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{text}</p>
  </div>
);

export default Home;
