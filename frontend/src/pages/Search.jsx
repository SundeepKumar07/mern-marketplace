import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchListings from '../components/SearchListings.jsx';

export default function Search() {
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
    });

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sell') {
            setSidebarData({ ...sidebarData, type: e.target.id })
        }

        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
            })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('-')[0] || 'createdAt';
            const order = e.target.value.split('-')[1] || 'desc';

            setSidebarData({ ...sidebarData, sort, order });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore = async () => {
        setLoading(true);
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/api/list/get-listings?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings((prev) => [...prev, ...data]);
        setLoading(false);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListing = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/api/list/get-listings?${searchQuery}`);
            const data = await res.json();
            setListings(data);
            setShowMore(data.length === 9);
            setLoading(false);
        }

        fetchListing();
    }, [location.search])

    return (
        <div className='flex flex-col md:flex-row min-h-screen'>
            {/* Sidebar - sticky on desktop, scrollable on mobile */}
            <div className='
                w-full 
                md:w-80 
                p-4 
                md:sticky 
                md:top-0 
                md:h-[calc(100vh-1rem)] 
                overflow-y-auto 
                bg-white 
                z-10
                border-r
            '>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-4'>
                        <label className='font-semibold'>Search Term</label>
                        <input
                            type="text"
                            placeholder='Search....'
                            className='p-4 py-1 border rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-green-400 focus:outline-none'
                            id='searchTerm'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-row gap-4'>
                        <div>
                            <label className='font-semibold'>Type: </label>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <div className='flex flex-row gap-2'>
                                <input type="checkbox" id='all' className='w-5' onChange={handleChange} checked={sidebarData.type === 'all'} />
                                <label>Sell and Rent</label>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <input type="checkbox" id='sell' className='w-5' onChange={handleChange} checked={sidebarData.type === 'sell'} />
                                <label>Sell</label>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={sidebarData.type === 'rent'} />
                                <label>Rent</label>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={sidebarData.offer} />
                                <label>Offer</label>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 flex-wrap'>
                        <label className='font-semibold'>Amenities: </label>
                        <div className='flex flex-row gap-1'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={sidebarData.parking} />
                            <label>Parking</label>
                        </div>
                        <div className='flex flex-row gap-1'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={sidebarData.furnished} />
                            <label>Furnished</label>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 pr-10'>
                        <label className='font-semibold'>Sort: </label>
                        <select
                            value={`${sidebarData.sort}-${sidebarData.order}`}
                            id="sort_order"
                            className='border-2 rounded-lg p-1'
                            onChange={handleChange}
                        >
                            <option value='regularPrice-desc'>Price high to low</option>
                            <option value='regularPrice-asc'>Price low to hig</option>
                            <option value='createdAt-desc'>Latest</option>
                            <option value='createdAt-asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-blue-500 mt-2 p-1 text-white rounded-lg hover:bg-blue-600'>Search</button>
                </form>
            </div>

            {/* Main content area */}
            <div className='flex-1 p-4'>
                <h1 className='text-3xl font-semibold border-b p-3'>Search Results</h1>
                <div>
                    {!loading && listings.length === 0 ? <p>Result Not found</p>
                        : <SearchListings listings={listings} />}
                    {showMore &&
                        <div className='flex justify-center w-full mt-4'>
                            <button onClick={handleShowMore} className='text-green-500 hover:underline font-bold py-4'>Show More</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}