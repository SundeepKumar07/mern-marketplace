import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Navbar() {
  const navigate = useNavigate();
  const {currentUser} = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])

  return (

    <nav className="bg-white shadow-md py-3 px-6 flex items-center justify-between">
      {/* Left - Logo */}
      <Link to="/">
        <div className="text-2xl font-bold text-blue-600 animate-fade-in">
          DeepEstate
        </div>
      </Link>

      {/* Middle - Search Bar */}
      <form onSubmit={handleSubmit} className="relative max-w-md md:block">
        <input
          type="text"
          placeholder="Search..."
          name='searchTerm' 
          value={searchTerm} 
          onChange={(e) => {setSearchTerm(e.target.value)}}
          className=" pl-10 pr-4 py-1 border rounded-2xl shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button className="cursor-pointer absolute left-3 top-1/2">
          <FaSearch className="transform -translate-y-1/2 text-gray-400"/>
        </button>
      </form>

      {/* Right - Menu Items */}
      <ul className="flex gap-6 text-gray-600 font-medium">
        <li className="relative group transition-transform duration-300 transform hover:scale-105 invisible sm:visible">
          <Link to="/" className="hover:text-blue-500 transition-colors duration-300">
            Home
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full"></span>
        </li>
        <li className="relative group transition-transform duration-300 transform hover:scale-105">
          <Link to="/about" className="hover:text-blue-500 transition-colors duration-300">
            About
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full"></span>
        </li>
        {currentUser?
            <Link to={'/profile'}>
              <img src={currentUser.avatar} alt="profile" className="w-6 rounded-full" />
            </Link>
          : <li className="relative group transition-transform duration-300 transform hover:scale-105">
            <Link to="/sign-in" className="hover:text-blue-500 transition-colors duration-300">
              Sign in
            </Link>
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full"></span>
          </li>
        }
      </ul>
    </nav>
  );
}