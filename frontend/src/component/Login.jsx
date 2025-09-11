import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/user/login',
        user,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      // ✅ Store token & user info in localStorage
      localStorage.setItem("token", res.data.token); // token returned from backend
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccessMsg('✅ Login successful!');

      setTimeout(() => navigate('/HomePage'), 1000);
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.response?.data?.message || "Login failed");
    }

    setUser({ username: '', password: '' });
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/LoginBg.jpg')" }}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl text-center font-bold mb-6 text-yellow-500">Made for you!</h1>
        <h2 className="text-2xl text-center mb-6 text-slate-900" >"Hungry? Let's fix that in minutes"</h2>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Log In
          </button>
        </form>
        <p className='mt-2  text-center'>Forgot Password</p>
        <p className="mt-4 text-center text-white">
          Don’t have an account?{" "}
          <Link to="/signUp" className="underline hover:text-yellow-300">
            Sign Up
          </Link>
        </p>
      </div>

      {successMsg && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-6 py-3 rounded-md shadow-md border border-green-300">
          {successMsg}
        </div>
      )}
    </div>
  );
};

export default Login;
