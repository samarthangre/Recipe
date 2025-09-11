import React from "react";
import Navbar from "./Navbar";
import { FaArrowLeft } from "react-icons/fa";

function WhyChooseUs() {
  const reasons = [
    {
      title: "AI-Powered Recipe Generator",
      desc: "Get personalized recipes instantly based on your ingredients.",
      img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Health-Friendly",
      desc: "Built-in calorie counter and nutrition insights for mindful eating.",
      img: "https://images.unsplash.com/photo-1607344645866-009c3c60a5f6?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Time-Saver",
      desc: "No more endless browsing; find the right recipe in seconds.",
      img: "https://images.unsplash.com/photo-1604908176997-4d36a4e0c6d2?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "User Ratings & Reviews",
      desc: "Trust the community feedback before trying a new recipe.",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Creative Cooking",
      desc: "Explore new dishes and cuisines beyond the basics.",
      img: "https://images.unsplash.com/photo-1617196038435-c1e4a79e5f2b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Simple & Fun",
      desc: "Designed for everyone, from beginners to expert chefs.",
      img: "https://images.unsplash.com/photo-1589712188858-0d58c8eec6b0?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const features = [
    "Personalized recipes based on your ingredients",
    "Dietary preference support",
    "Professional chef-quality instructions",
    "Convenient shopping links for missing ingredients",
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-900 px-6 py-10 flex flex-col items-center text-white">
        {/* Navbar */}
        <Navbar />


        {/* Heading */}
        <div className="relative mb-10 w-full">
          <a
            href="/"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 text-3xl hover:text-yellow-300"
          >
            <FaArrowLeft />
          </a>
          <h1 className="text-4xl font-extrabold text-white text-center">
            Why <span className="text-yellow-400">Choose Us?</span>
          </h1>
        </div>


        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 shadow-lg rounded-2xl overflow-hidden hover:shadow-yellow-500/30 hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-yellow-400 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Features */}
        <div className="mt-16 max-w-3xl w-full text-left bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Key Benefits
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {features.map((f, idx) => (
              <li key={idx} className="hover:text-yellow-300 transition">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default WhyChooseUs;
