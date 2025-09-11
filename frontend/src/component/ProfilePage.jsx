import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const navigateHome = () => {
    navigate("/HomePage");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-orange-500 text-white flex flex-col items-center py-6">
        {/* Profile Logo + Username */}
        <div className="flex flex-col items-center mb-10 text-black">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black text-3xl mb-2">
            {user.username ? user.username[0].toUpperCase() : "U"}
          </div>
          <span className="text-lg font-semibold">{user.username}</span>
        </div>

        {/* Sidebar Options */}
        <div className="flex flex-col justify-between h-full w-full p-5 ">
          {/* Top buttons */}
          <div className="flex flex-col gap-6 text-center">
            <button className="py-2 hover:bg-slate-600 bg-slate-300 transition rounded-sm w-full pl-2 pr-6 text-black">
              My Info
            </button>
            <button className="py-2 hover:bg-slate-600 bg-slate-300 transition rounded-sm w-full pl-2 pr-6 text-black">
              Saved Recipes
            </button>
            <button className="py-2 hover:bg-slate-600 bg-slate-300 transition rounded-sm w-full pl-2 pr-6 text-black">
              My Reviews
            </button>
            <button className="py-2 hover:bg-slate-600 bg-slate-300 transition rounded-sm w-full pl-2 pr-6 text-black">
              Settings
            </button>
            <button
            onClick={navigateHome}
            className="py-2 hover:bg-slate-600 bg-slate-300 transition rounded-sm w-full pl-2 pr-6 text-black">
              Home
            </button>
          </div>

          {/* Logout button at bottom */}
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="py-2 hover:bg-orange-600 bg-slate-300 transition rounded-sm w-full pl-2 pr-6"
            >
              Logout
            </button>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 text-white text-5xl">
        <h1 className="text-3xl font-bold mb-6">Welcome,  {user.username}</h1>
        <p className="mb-2">👤{user.fullName}</p>
        <p className="mb-6">📧 {user.email}</p>



      </div>
    </div>
  );
}

export default ProfilePage;
