import React, { useState } from 'react';
import { Link, Route, Routes } from "react-router-dom";
import Cookies from 'js-cookie';
import { getSessionData } from '../../util/session_util';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    //const userId = Cookies.get('userId');
    const sessionData = getSessionData('userId');
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        window.location.reload();
    };

    return (
        <nav className="bg-blue-600">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-white text-2xl font-bold">
                    <Link to="/">Brand</Link>
                </div>
                <div className="hidden md:flex space-x-4">

                    {sessionData && sessionData.userId ? (
                        <>
                            <Link to="/order-list" className="text-white hover:bg-blue-500 px-3 py-2 rounded">Order List</Link>
                            <Link to="/profile" className="text-white hover:bg-blue-500 px-3 py-2 rounded">Profile</Link>
                            <button
                                onClick={handleLogout}
                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded ml-4"
                            >
                                Logout
                            </button>
                        </>

                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:bg-blue-500 px-3 py-2 rounded">Login</Link>
                            <Link to="/register" className="text-white hover:bg-blue-500 px-3 py-2 rounded">Register</Link>
                        </>
                    )}

                </div>
                <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-blue-500`}>
                <a href="#" className="block text-white hover:bg-blue-500 px-4 py-2">Home</a>
                <a href="#" className="block text-white hover:bg-blue-500 px-4 py-2">About</a>
                <a href="#" className="block text-white hover:bg-blue-500 px-4 py-2">Services</a>
                <a href="#" className="block text-white hover:bg-blue-500 px-4 py-2">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
