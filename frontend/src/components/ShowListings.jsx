import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ShowListings() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/api/user/listings/${currentUser.id}`);
        const result = await res.json();
        if (!result) setError('No results found');
        setListings(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchListing();
    }
  }, [currentUser]);

  const handleClick = (listing) => {
    navigate(`/listing/${listing._id}`, { state: listing });
  };

  const deleteListing = async (listId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/api/list/delete-listing/${listId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setListings((prev) => prev.filter((l) => l._id !== listId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : listings.length > 0 ? (
        listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col sm:flex-row items-center sm:items-start gap-4 cursor-pointer"
            onClick={() => handleClick(listing)}
          >
            <img
              src={listing.imageUrls[0]}
              alt="listing"
              className="w-full sm:w-40 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-700 hover:underline">{listing.name}</h2>
              <p className="text-gray-500 text-sm line-clamp-2">{listing.description}</p>
            </div>
            <div className="flex sm:flex-col gap-2 items-center justify-center">
              <button
                className="text-red-600 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteListing(listing._id);
                }}
              >
                Delete
              </button>
              <Link to={`/edit-listing/${listing._id}`} className="text-green-600 hover:underline" onClick={(e) => {
                  e.stopPropagation();
                }}>
                Edit
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No listings found.</p>
      )}
    </div>
  );
}