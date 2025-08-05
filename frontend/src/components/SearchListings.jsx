import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function SearchListings({listings}) {
    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-PK').format(amount); // removes "Rs"
    };
  return (
    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 sm:p-8 md:p-3 lg:p-4'>
        {listings.map((listing)=>(
            <Link to={`/listing/${listing._id}`} key={listing._id}>
                <div className='h-100 flex flex-col gap-2  rounded bg-gray-100 hover:scale-105 transition-scale duration-300 shadow-md hover:shadow-lg overflow-hidden'>
                    <div>
                        <img src={listing.imageUrls[0]} alt="result-image" className='w-full h-60 sm:h-50'/>
                    </div>
                    <div className='flex flex-col gap-1 px-3 py-2'>
                        <h2 className='font-bold truncate'> {listing.name} </h2>
                        <address className='font-medium'>
                            <MdLocationOn className="text-red-500 text-xl inline-flex mr-2" />
                            {listing.address.split(' ',7).join(' ')}
                        </address>
                        <p className='text-sm line-clamp-2'>{listing.description}</p>
                        <p className='font-semibold'>Rs: {formatPrice(listing.regularPrice)} / Month</p>
                        <p className='flex gap-4 font-semibold'><span>{listing.bedroom} Beds</span><span>{listing.bathroom} Bath</span></p>
                    </div>
                </div>
            </Link>
            ))
        }
    </div>
  )
}