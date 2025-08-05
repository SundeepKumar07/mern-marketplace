import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({Listing}) {
  const [landlord, setLandlord] = useState({});
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = `/api/user/get/${Listing.userRef}`;
        const res = await fetch(url);
        const data = await res.json();
        await setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [Listing.userRef])

  console.log(message);
  return (
    <div className='border-sky-200 border-2'>
      <p><span className='font-bold'>Name</span> {landlord.username}</p>
      <p><span className='font-bold'>to</span> {landlord.email}</p>
      <div className='flex flex-col bg-[#d3d3d3]'>
        <textarea name="contact" className='bg-blend-color-dodge outline-none p-2 align-text-top' placeholder='Type you Query' value={message} onChange={(e)=> setMessage(e.target.value)}></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${Listing.name}&body=${message}`} className='font-bold block bg-black text-white text-center rounded-lg hover:bg-[#757171] transition hover:cursor-pointer p-2'>
              Send Message
          </Link>
      </div>
    </div>
  )
}