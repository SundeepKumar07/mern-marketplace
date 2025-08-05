import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleGoogleClick = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth, provider);

        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            credentials: 'include',
            body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
        });
        const data = await res.json();
        
        if (data.success === false) {
            dispatch(signInFailure(data.message));
            toast.error(data.message);
            return;
        }

      dispatch(signInSuccess(data.user));
      toast.success('Google Sign-In Successful!');
      navigate('/');
    } catch (error) {
        console.log("google error", error);
    }
  }

  return (
    <button onClick= {handleGoogleClick} type ='button' className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50">
      Continue with Google
    </button>
  )
}