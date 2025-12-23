import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:3002/users";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [data, setData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = data.email.trim().toLowerCase();
      const resp = await axios.get(`${API}?email=${encodeURIComponent(email)}`);
      const user = resp.data?.find(
        (u) => u.email?.toLowerCase() === email && u.password === data.password
      );

      if (user) {
        login(user);
        navigate("/dashboard");
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* LOGIN CARD */}
      <div
        className={`w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8
          transition-all duration-700 ease-out
          ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Login to access your Travelora dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
              placeholder="you@example.com"
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
                value={data.password}
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
                placeholder="Enter your password"
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

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg
                       font-semibold transition transform active:scale-95
                       disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
