import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <nav className="bg-white shadow-md py-3 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
      {/* Logo */}
      <div className="w-full flex justify-between items-center sm:w-auto">
        <Link to="/">
          <div className="text-2xl font-bold text-blue-600">DeepEstate</div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden text-gray-700 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md flex-shrink"
      >
        <input
          type="text"
          placeholder="Search..."
          name="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-1 w-full border rounded-2xl shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <FaSearch className="text-gray-400" />
        </button>
      </form>

      {/* Menu Items */}
      <div
        className={`w-full sm:w-auto flex-col sm:flex-row flex items-center gap-4 sm:gap-6 font-medium text-gray-600 transition-all duration-300 ease-in-out 
        ${menuOpen ? 'flex' : 'hidden'} sm:flex`}
      >
        <li className="list-none relative group hover:scale-105 transition-transform duration-300">
          <Link to="/" className="hover:text-blue-500 transition-colors duration-300">
            Home
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full"></span>
        </li>

        <li className="list-none relative group hover:scale-105 transition-transform duration-300">
          <Link to="/about" className="hover:text-blue-500 transition-colors duration-300">
            About
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full"></span>
        </li>

        {currentUser ? (
          <Link to="/profile">
            <img src={currentUser.avatar} alt="profile" className="w-6 h-6 rounded-full" />
          </Link>
        ) : (
          <li className="list-none relative group hover:scale-105 transition-transform duration-300">
            <Link to="/sign-in" className="hover:text-blue-500 transition-colors duration-300">
              Sign in
            </Link>
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full"></span>
          </li>
        )}
      </div>
    </nav>
  );
}