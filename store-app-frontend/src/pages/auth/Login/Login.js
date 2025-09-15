import { useState } from 'react';
import Cookies from 'js-cookie';
import UserDataService from '../../../services/user.service'
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../components/error/error';
import { setSessionData } from '../../../util/session_util';

function Login() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        UserDataService.login(formData)
            .then(response => {
                // Check if response status is 200 (success)
                if (response.status === 200) {

                    const userId = response.data.id;
                    //Cookies.set('userId', userId, { expires: 7 });
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
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}
            <div class="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
                <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div class="mb-4">
                        <label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div class="mb-6">
                        <label for="password" class="block text-gray-700 font-semibold mb-2">Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                    </div>
                    <button type="submit"
                        class="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200">Login</button>
                </form>
                <div class="text-center mt-4">
                    <a href="#" class="text-blue-500 hover:underline">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
