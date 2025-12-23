// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top Section */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand / About */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Travelora
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Travelora is a smart travel planning and booking platform designed
              to help users explore destinations, book hotels, manage trips, and
              create memorable travel experiences with ease.
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="h-4 w-4 mr-2 text-indigo-600" />
              Explore the world with confidence
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/trips" className="hover:text-indigo-600 transition">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-indigo-600 transition">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-indigo-600 transition">
                  Travel Packages
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-indigo-600 transition">
                  Bookmarked Places
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-indigo-600 transition cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-indigo-600 transition cursor-pointer">
                FAQs
              </li>
              <li className="hover:text-indigo-600 transition cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-indigo-600 transition cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                support@travelora.com
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                +91 98765 43210
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-indigo-600" />
                Bengaluru, Karnataka, India
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2025 <span className="font-medium text-gray-700">Travelora</span>. 
            All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
