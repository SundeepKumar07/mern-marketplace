import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSuccess, updateFailure, updateStart } from '../redux/user/userSlice.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ShowListings from '../components/ShowListings.jsx';

export default function Profile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [showListing, setShowListing] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(updateStart())
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'profile-pic'); // replace with your Cloudinary preset

      const res = await fetch('https://api.cloudinary.com/v1_1/dwro2yaev/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      // Send to backend to update user
      const url = import.meta.env.VITE_API_BACKEND;
      const updateRes = await fetch(`${url}/api/user/update-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ avatar: data.secure_url }),
      });

      const updatedUser = await updateRes.json();
      dispatch(updateSuccess(updatedUser.user));
    } catch (err) {
      console.error('Upload error:', err);
    }
  };


  const signOut = async() => {
    try {
      const url = `${import.meta.env.VITE_API_BACKEND}/api/auth/sign-out`;
      const res = await fetch(url, {
        method: 'POST',
        credentials: "include",
      });

      const data = await res.json();
      if(data.success){
        dispatch(updateSuccess(null));
        toast.success(data.message);
        navigate('/');
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  const deleteAccount = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete your account?");
      if (!confirmDelete) return;

      const url = `${import.meta.env.VITE_API_BACKEND}/api/auth/delete`;
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();

      if(data.success){
        dispatch(updateSuccess(null));
        toast.success(data.message);
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  //handling userverification
  const [showVerify, setShowVerify] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState('');
  const handleVerifySubmit = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/api/user/verify-password`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: verifyPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error('Invalid password');
      } else {
        setShowVerify(false);
        changePass? changePassword() :handleUpdateUser();
        setChangePass(false);
      }
    } catch (err) {
      console.log(error);
    }
  };

  
  //handiing update data and password
  const [form, setForm] = useState({username: currentUser?.username || '', email: currentUser?.email || '', password: ''})
  const [changePass, setChangePass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const changePassword = async () => {
    dispatch(updateStart());
    try {
      const url = `${import.meta.env.VITE_API_BACKEND}/api/user/update-password`;
      const res = await fetch(url, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: form.password}),
      })
      const data = await res.json();

      if(!data.success){
        dispatch(updateFailure(data.message));
        toast.error(data.message);
      }
      toast.success(data.message);
      dispatch(updateSuccess(data.user));
    } catch (error) {
      dispatch(updateFailure(error.message));
      console.log(error.message);
    }
  }


  const handleUpdateUser = async () => {
    dispatch(updateStart());
    try {
      const url = `${import.meta.env.VITE_API_BACKEND}/api/user/update-user`;
      const res = await fetch(url, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: form.username, email: form.email }),
      })
      const data = await res.json();

      if(!data.success){
        dispatch(updateFailure(data.message));
        toast.error(data.message);
      }

      toast.success(data.message);
      dispatch(updateSuccess(data.user));
      console.log(data.user);
    } catch (error) {
      dispatch(updateFailure(error.message));
      console.log(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-200 space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-600">Profile Page</h1>

        <div className="flex justify-center">
          <img
            src={currentUser?.avatar || '/default.jpg'}
            alt="Profile"
            onClick={() => fileRef.current.click()}
            className="w-24 h-24 rounded-full object-cover border-2 cursor-pointer hover:opacity-80 transition"
          />
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {loading && <p className="text-center text-sm text-gray-500">Uploading...</p>}
        
        <form className="space-y-4">
          <input
            name='username'
            type="text"
            onChange={handleChange}
            value={form.username}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
          <input
            name='email'
            type="email"
            onChange={handleChange}
            value={form.email}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <button type='button' onClick={() => setShowVerify(true)} className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              {loading ? "Please wait...": "Update Account"}
            </button>
            <button type='button' onClick={() => {setShowVerify(true), setChangePass(true)}} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              {loading ? "Please wait...": "Update Password"}
            </button>
            <button type= "button" onClick= {() => navigate('/create-listing')} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Create Listing
            </button>
          </div>
        </form>


        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
          <button className="w-full py-2 text-red-500 hover:text-red-600 font-semibold" onClick={deleteAccount}>
            Delete Account
          </button>
          <button className="w-full py-2 text-gray-600 hover:text-gray-800 font-semibold" onClick={signOut}>
            Sign Out
          </button>
        </div>
        <button type='button' className='p-3 w-full' onClick={()=> setShowListing(!showListing)}>{showListing? "Hide listings": "Show Listings"}</button>
        {showListing && <ShowListings/>}
      </div>
      {showVerify && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 space-y-4">
            <h2 className="text-xl font-semibold text-center text-blue-700">Verify Password</h2>
            
            { changePass && <input
              name='password'
              type="text"
              placeholder="Enter new password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />}

            <input
              type="password"
              placeholder="Enter old password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => {setShowVerify(false), setChangePass(false)}} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleVerifySubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Verify</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}