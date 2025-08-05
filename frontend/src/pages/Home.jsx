import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchListing from '../components/SearchListings.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % offerListing.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + offerListing.length) % offerListing.length);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res1 = await fetch('/api/list/get-listings?offer=true&limit=3');
        const offer = await res1.json();
        setOfferListing(offer);

        const res2 = await fetch('/api/list/get-listings?type=rent&limit=3');
        const rent = await res2.json();
        setRentListing(rent);

        const res3 = await fetch('/api/list/get-listings?type=sell&limit=3');
        const sell = await res3.json();
        setSaleListing(sell);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAll();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className='p-10 sm:pr-20 flex gap-4 flex-col bg-gray-100'>
        <h1 className='text-5xl sm:text-6xl md:text-7xl font-bold'>
          Find your next <span className='text-blue-500'>Perfect</span> Place with Ease
        </h1>
        <p className='text-2xl sm:text-3xl'>
          Deep State is the best platform to find your next perfect place.
          <br />
          We have a wide range of properties for you to explore.
        </p>
        <Link
          to={`/search`}
          className='text-blue-500 font-bold text-[1.2rem] hover:underline'
        >
          Let's Get Started
        </Link>
      </div>

      {/* Offer Listings Slider */}
      {offerListing.length > 0 && (
        <div className="relative group">
          <img
            src={offerListing[currentIndex]?.imageUrls?.[0] || '/fallback.jpg'}
            alt={`listing-${currentIndex}`}
            className="w-full h-[300px] sm:h-[500px] object-cover transition-all duration-500"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight size={26} />
          </button>
        </div>
      )}

      {/* Sections */}
      <div className='flex flex-col gap-8 py-6'>
        {/* Offer Deals */}
        <div className='flex flex-col gap-1'>
          <label className='px-4 text-2xl font-bold'>Latest Deals Offers</label>
          {offerListing.length > 0 && <SearchListing listings={offerListing} />}
          <Link
            to={'/search?offer=true'}
            className='text-green-500 underline pl-5 text-lg hover:text-green-600'
          >
            See More
          </Link>
        </div>

        {/* Rent Deals */}
        <div className='flex flex-col gap-1'>
          <label className='px-4 text-2xl font-bold'>Latest Deals for Rent</label>
          {rentListing.length > 0 && <SearchListing listings={rentListing} />}
          <Link
            to={'/search?type=rent'}
            className='text-green-500 underline pl-5 text-lg hover:text-green-600'
          >
            See More
          </Link>
        </div>

        {/* Sale Deals */}
        <div className='flex flex-col gap-1'>
          <label className='px-4 text-2xl font-bold'>Latest Deals for Sale</label>
          {saleListing.length > 0 && <SearchListing listings={saleListing} />}
          <Link
            to={'/search?type=sell'}
            className='text-green-500 underline pl-5 text-lg hover:text-green-600'
          >
            See More
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
}