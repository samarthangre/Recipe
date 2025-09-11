import React from "react";
import Navbar from "./Navbar";

function GetInTouch() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Navbar */}
            <div className="flex items-center justify-between px-5 py-3">
                <Navbar />
                <h4 className="text-yellow-400 font-bold hover:text-yellow-300 text-2xl self-end">
                    <a href="/">← Back</a>
                </h4>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 items-center justify-center px-3 py-17">
                <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full h-full items-center relative -top-8">

                    {/* Left Section - Text Content */}
                    <div>
                        <p className="pl-4 text-3xl font-extrabold font-serif mb-4 text-gray-400">
                            “Let’s Cook Up a Conversation!”
                        </p>
                        <p className="pl-4 text-xl font-medium font-sans mb-8 text-gray-500">
                            We’d love to hear your ideas, feedback, or collaborations!
                        </p>


                        {/* Contact Us */}
                        <div className="mb-6 pt-11">
                            <h2 className="bg-white text-black inline-block px-4 py-2 rounded-2xl rounded-tl-none rounded-br-none shadow-2xl font-semibold mb-3">
                                Contact Us.
                            </h2>
                            <p className="hover:text-yellow-400 transition-colors duration-300">
                                www.dumbchef.com
                            </p>
                            <p className="hover:text-yellow-400 transition-colors duration-300">999 999 9999</p>
                            <p className="hover:text-yellow-400 transition-colors duration-300">dumbchef@gamil.com</p>
                        </div>

                        {/* Follow Us */}
                        <div className="mb-6 pt-8">
                            <h2 className="bg-white text-black inline-block px-4 py-2 rounded-2xl rounded-tl-none rounded-br-none shadow-2xl font-semibold mb-3">
                                Follow Us.
                            </h2>
                            <p>
                                <a
                                    href="https://www.instagram.com/dumbchef1111"
                                    className="hover:text-yellow-400 transition-colors duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Instagram - @dumbchef1111
                                </a>
                            </p>
                            <p>
                                <a
                                    href="https://www.facebook.com/dumbchef1111"
                                    className="hover:text-yellow-400 transition-colors duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook - @dumbchef1111
                                </a>
                            </p>
                            <p>
                                <a
                                    href="https://www.youtube.com/@dumbchef1111"
                                    className="hover:text-yellow-400 transition-colors duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Youtube - @dumbchef1111
                                </a>
                            </p>
                        </div>

                        {/* Share Recipes */}
                        <div className="mb-6 pt-8">
                            <h2 className="bg-white text-black inline-block px-4 py-2  font-semibold mb-3 rounded-3xl rounded-tl-none rounded-br-none shadow-2xl">
                                Share your Recipes with us!
                            </h2>
                            <p>Got a recipe idea?</p>
                            <p>
                                Send it to{" "}
                                <span className="text-yellow-400">
                                    recipes@dumbchefmail.com
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Image */}
                    <div className="flex pb-20 w-full h-full">
                        <img
                            src="/GetInTouchBg.jpg"
                            alt="Delicious food"
                            className="rounded-2xl shadow-2xl w-[800px] h-[800px] object-cover"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default GetInTouch;
