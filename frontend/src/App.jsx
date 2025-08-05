import { Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

import Home from './pages/Home.jsx';
import SignIn from './pages/SignIn.jsx';
import About from './pages/About.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import Search from './pages/Search.jsx';
import PrivateRouter from './components/PrivateRouter.jsx';
import Profile from './pages/Profile.jsx';
import CreateListing from './pages/CreateListing.jsx';
import UpdateListing from './pages/UpdateListing.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {
  return (
    <>
    <ToastContainer/>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/sign-in' element={<SignIn/>} />
      <Route path='/about' element={<About/>} />
      <Route path="/listing/:listingId" element={<ListingDetail />} />
      <Route path="/search" element={<Search />} />
      <Route element={<PrivateRouter/>}>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/create-listing' element={<CreateListing/>} />
        <Route path='/edit-listing/:listingId' element={<UpdateListing/>} />
      </Route>
    </Routes>
    </>
  )
}