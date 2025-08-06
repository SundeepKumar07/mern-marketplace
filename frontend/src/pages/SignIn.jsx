import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import Oauth from "../components/Oauth.jsx";

export default function SignIn() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [login, setlogin] = useState(true);

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(login) dispatch(signInStart());

    try {
      const url = login ? `${import.meta.env.VITE_API_BACKEND}/api/auth/sign-in` : `${import.meta.env.VITE_API_BACKEND}/api/auth/sign-up`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          login
            ? { email: form.email, password: form.password }
            : form
        ),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!data.success) {
        if(login) dispatch(signInFailure(data.message));
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success(data.message);

      if (login) {
        console.log(data.user);
        dispatch(signInSuccess(data.user));
        navigate("/");
      } else {
        setlogin(true);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          {login ? "Sign In" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!login && (
            <div className="relative">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:border-blue-500 transition"
                required
              />
              <label className="absolute left-4 top-2 text-sm text-gray-500 peer-focus:text-blue-500 transition-all">
                Username
              </label>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:border-blue-500 transition"
              required
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 peer-focus:text-blue-500 transition-all">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:border-blue-500 transition"
              required
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 peer-focus:text-blue-500 transition-all">
              Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "Please wait..." : login ? "Sign In" : "Sign Up"}
          </button>
          <Oauth/>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>

        <p className="mt-6 text-center text-gray-600">
          {login ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setlogin(!login)}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            {login ? "Sign up" : "Sign in"}
          </button>
        </p>

      </div>
    </div>
  );
}