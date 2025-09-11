import React from "react";


function Navbar() {
    return (
        <nav className="w-full flex items-center p-4  ">
            {/* Logo on left */}
            <div className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            <div className="text-2xl font-bold"> DumbChefs</div>
            </div>
        </nav>
    );
}

export default Navbar;
