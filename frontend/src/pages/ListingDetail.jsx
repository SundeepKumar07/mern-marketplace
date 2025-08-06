import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact.jsx';

export default function ListingDetail() {
  const {currentUser} = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);
  const {listingId} = useParams();
    const [listing, setListing] = useState({
      userRef: '',
      name: '',
      description: '',
      address: '',
      regularPrice: 0,
      discountPrice: 0,
      bathroom: 0,
      bedroom: 0,
      furnished: false,
      parking: false,
      type: '',
      offer: false,
      imageUrls: [],
  });
  useEffect(()=>{
    const fetchListing = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/api/list/get-listing/${listingId}`);
            const data = await res.json();
            if(!data.success){
                console.log(data.message);
            }
            setListing(data.listing);
        } catch (error) {
            toast.error(error);
        }
    };
    if(listingId)
        fetchListing();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!listing) return <p className="text-center text-red-500 mt-10">No listing data provided</p>;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % listing.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + listing.imageUrls.length) % listing.imageUrls.length);
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-PK').format(amount); // removes "Rs"
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" mx-auto bg-white overflow-hidden">
        {/* Image Section */}
        <div className="relative h-70 sm:h-[28rem] w-full overflow-hidden group">
          <img
            src={listing.imageUrls[currentIndex]}
            alt={`listing-${currentIndex}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white group-hover:opacity-100 opacity-0 transition"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white group-hover:opacity-100 opacity-0 transition"
          >
            <ChevronRight size={26} />
          </button>
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {listing.imageUrls.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 px-6 pt-4 overflow-x-auto scrollbar-hide">
          {listing.imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`thumb-${i}`}
              onClick={() => setCurrentIndex(i)}
              className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${
                i === currentIndex ? 'border-blue-600' : 'border-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Details Section */}
        <div className="px-6 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-800">{listing.name}</h1>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                listing.type === 'sell' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {listing.type === 'sell' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 text-base px-10">
            <div className='m-15px'>
              <span className="font-medium">📍 Address:</span> <br />
              {listing.address}
            </div>
            <div>
              <span className="font-medium">🛏️ Bedrooms:</span> {listing.bedroom}
            </div>
            <div>
              <span className="font-medium">🛁 Bathrooms:</span> {listing.bathroom}
            </div>
            <div>
              <span className="font-medium">💰 Regular Price:</span> Rs: {formatPrice(listing.regularPrice)}
            </div>
            <div>
              <span className="font-medium">🔖 Discount Price:</span> Rs: {formatPrice(listing.discountPrice)}
            </div>
            <div>
              <span className="font-medium">🪑 Furnished:</span>{' '}
              {listing.furnished ? 'Fully Furnished' : 'Not Furnished'}
            </div>
            <div>
              <span className="font-medium">🚗 Parking:</span>{' '}
              {listing.parking ? 'Available' : 'Not Available'}
            </div>
            <div>
              <span className="font-medium">🎁 Offer:</span>{' '}
              <span
                className={`font-semibold ${
                  listing.offer ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {listing.offer ? 'Offer Available' : 'No Offers'}
              </span>
            </div>
          </div>
          <h1 className='text-2xl font-bold'>Description</h1>
          <p className="text-gray-700 text-lg leading-relaxed">{listing.description}</p>
          
          {!currentUser && currentUser !== listing?.userRef && !contact && (
            <div className='flex flex-col'>
              <button className='hover:bg-black cursor-pointer bg-[#433f3f] text-white transition' onClick={() => {setContact(true)}}>Contact Landlord</button>
            </div>
          )}

          {/* contact Component  */}
          {contact && <Contact Listing={listing}/>}
        </div>
      </div>
    </div>
  );
}