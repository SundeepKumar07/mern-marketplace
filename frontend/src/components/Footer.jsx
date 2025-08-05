import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 mt-10 border-t-2">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Deep State</h3>
          <p className="text-sm">
            Find your next perfect place with ease. We offer the best platform for sellers, buyers, and renters.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-500">About</Link></li>
            <li><Link to="/profile" className="hover:text-blue-500">Profile</Link></li>
            <li><Link to="/search" className="hover:text-blue-500">Search</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <p className="text-sm">Email: support@deepstate.com</p>
          <p className="text-sm">Phone: +92 300 6770416</p>
          <p className="text-sm">Location: Rahim Yar Khan, Pakistan</p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook className="hover:text-blue-600 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="hover:text-pink-500 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="hover:text-sky-400 transition" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin className="hover:text-blue-700 transition" />
            </a>
          </div>
          <p className="font-medium pt-4 text-sm">
            Contact us for any issues related to fake buyers, sellers, or website problems.
          </p>
        </div>
      </div>

      {/* Credit */}

      {/* Copyright */}
      <div className="text-center text-sm border-t border-gray-200 py-4">
        &copy; {new Date().getFullYear()} Deep State. All rights reserved.
          Creator:&nbsp;
          <a
            href="https://www.linkedin.com/in/sundeep-kumar-3ab765321"
            className="text-blue-500 font-semibold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Sundeep Kumar
          </a>
      </div>
    </footer>
  );
}