import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:3002/users";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = data.email.trim().toLowerCase();
      const check = await axios.get(`${API}?email=${encodeURIComponent(email)}`);

      if (check.data.length > 0) {
        alert("Email already exists");
        setLoading(false);
        return;
      }

      const res = await axios.post(API, {
        ...data,
        email,
        trips: [],
        bookings: [],
        bookmarks: [],
      });

      login(res.data);
      navigate("/dashboard");
    } catch {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* REGISTER CARD */}
      <div
        className={`w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8
          transition-all duration-700 ease-out
          ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Create your account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Start planning your trips with Travelora
        </p>

        <form onSubmit={handleRegister} className="space-y-6">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              required
              placeholder="Your name"
              value={data.name}
              onChange={(e) =>
                setData({ ...data, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         transition focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600
                         outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         transition focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600
                         outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="Create a password"
                value={data.password}
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12
                           transition focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600
                           outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                           text-gray-400 hover:text-indigo-600 transition"
              >
                {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg
                       font-semibold transition transform active:scale-95
                       disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;
