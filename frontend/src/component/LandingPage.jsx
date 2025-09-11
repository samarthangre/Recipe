import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function LandingPage() {
    return (
        <div
            className="h-screen w-screen bg-cover bg-center relative text-white"
            style={{ backgroundImage: "url('/LandingPageBg.jpg')" }}
        >
            {/* Navbar */}
            <header className="absolute top-0 left-0 w-full px-8 py-6 flex justify-between items-center">
                <Navbar />

                {/* Nav Links */}
                <nav className="flex pt-5  text-white text-lg">
                    <Link to="/getInTouch" className="hover:text-yellow-400 pl-3 pr-3">Get In Touch</Link>
                    <span>/</span>
                    <Link to="/whyChooseUs" className="hover:text-yellow-400 pl-3 pr-3">Why choose Us</Link>
                    <span>/</span>
                    <Link to="/OurServices" className="hover:text-yellow-400 pl-3 pr-3">Our Services</Link>
                </nav>
            </header>

            <main className="flex flex-col justify-center h-full">
                <div className="w-96 pl-[5cm] text-center">
                    <h1 className="text-6xl md:text-7xl font-bold leading-snug drop-shadow-lg">
                        <h1 className="pl-5">"Turn</h1>
                        Ingredients <br />
                        <h1 className="pl-14">Into</h1>
                        Delicious <br />
                        <h1 className="pl-14">Meals"</h1>
                    </h1>

                    {/* Single line text */}
                    <p className="mt-6 text-xl italic drop-shadow-lg whitespace-nowrap">
                        No Chef Skills Needed, Just Curiosity.
                    </p>
                </div>
            </main>


            {/* Login / Signup fixed at bottom-right */}
            <div className="fixed bottom-8 right-8 flex gap-6 text-2xl font-semibold text-white">
                <Link to="/login" className="hover:text-yellow-400">Login</Link>
                <span>/</span>
                <Link to="/signup" className="hover:text-yellow-400">Sign Up</Link>
            </div>
        </div>
    );
}

export default LandingPage;
