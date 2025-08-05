import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-12 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">About Deep State</h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-10">
          Deep State is a modern real estate platform that helps you find your perfect place — whether it's your dream home, a cozy apartment for rent, or a great deal to invest in. We're committed to making your property search faster, easier, and more transparent.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md text-left space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-green-600">🌐 Our Mission</h2>
            <p className="text-gray-700">
              To provide a seamless and intuitive experience for buyers, renters, and sellers. We combine modern technology with simple tools so anyone can explore properties, connect with owners, and make informed decisions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-600">🏡 What We Offer</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Advanced search filters (offer, furnished, parking, rent/sell)</li>
              <li>Clean and mobile-friendly UI</li>
              <li>Secure user authentication</li>
              <li>Real-time property listings</li>
              <li>Simple listing creation for property owners</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-purple-600">📍 Built With</h2>
            <p className="text-gray-700">
              This platform is built using the MERN stack: MongoDB, Express.js, React.js, and Node.js, with Tailwind CSS for styling and Cloudinary for image hosting.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-block text-blue-600 px-6 py-2 rounded-full hover:text-blue-700 transition w-full sm:w-40"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}