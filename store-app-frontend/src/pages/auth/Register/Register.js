import Cookies from 'js-cookie';
import { useState } from 'react';
import UserDataService from '../../../services/user.service'
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../components/error/error';
import { setSessionData } from '../../../util/session_util';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        UserDataService.create(formData)
            .then(response => {
                // Check if response status is 200 (success)
                if (response.status == 200) {
                    console.log("Registration successful");
                    const userId = response.data.id;
                    setSessionData('userId', { userId });
                    // Redirect to the home page
                    window.location.href = "/";
                }
            })
            .catch(error => {
                // Handle errors here if the registration fails
                if (error.response) {
                    console.error("Error response:", error.response.data);
                    setError(error.response.data.message || 'Registration failed');
                } else if (error.request) {
                    console.error("No response from server:", error.request);
                    setError('No response from server. Please try again.');
                } else {
                    console.error("Error:", error.message);
                    setError('Something went wrong. Please try again.');
                }
            });
        console.log('Registering user:', formData);
    };

    return (
        <>
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}

            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                        Register
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </>

    );
};

export default Register;
