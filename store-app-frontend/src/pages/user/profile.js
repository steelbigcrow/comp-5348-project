// src/components/UserProfile.js
import Cookies from 'js-cookie';
import React from 'react';
import { useState, useEffect } from 'react';
import UserDataService from '../../services/user.service'
import { useNavigate } from 'react-router-dom';
import { getSessionData } from '../../util/session_util';

const UserProfile = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const sessionData = getSessionData('userId');
    const userId = sessionData.userId;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        UserDataService.update(1, formData)
            .then(response => {
                // Check if response status is 200 (success)
                if (response.status === 200) {
                    console.log("Registration successful");
                    // Redirect to the home page
                    navigate('/');
                }
            })
            .catch(error => {
                // Handle errors here if the registration fails
                if (error.response) {
                    console.error("Error response:", error.response.data);
                    setError(error.response.data.message || 'Failed to fetch user data. Please try again later.');
                } else if (error.request) {
                    console.error("No response from server:", error.request);
                    setError('Error: No response from server. Please try again.');

                } else {
                    console.error("Error:", error.message);
                    setError('Error: Something went wrong. Please try again.');
                }
            });
        console.log('Registering user:', formData);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Retrieve the user ID from the cookie


                if (!userId) {
                    console.error('User ID not found in cookies.');
                    return;
                }

                // Fetch user data using the ID from the cookie
                const response = await UserDataService.get(userId);
                setFormData(response.data); // Populate the form with the fetched user data
            } catch (error) {
                setError(error.message || 'Failed to fetch user data. Please try again later.');
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);


    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        bio: 'Software Engineer with a passion for building web applications.',
    };

    return (
        <>
            {error && (

                <div className="">
                    <div className='flex justify-end'>
                        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-auto max-w-sm ml-4" role="alert">
                            <strong class="font-bold">Error</strong>
                            <span class="block sm:inline">{error}</span>
                            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">

                            </span>
                        </div>
                    </div>
                </div>


            )}
            <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">

                <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"

                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"

                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"

                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"

                        />
                    </div>
                    <div className="text-center">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                            Edit Profile
                        </button>
                    </div>
                </form>
            </div>

        </>
    );
};

export default UserProfile;
