import React, { useEffect } from 'react';

const ErrorMessage = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); // Call the onClose function to hide the message after 5 seconds
        }, 5000);
        return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }, [onClose]);

    return (

        <div
            className="fixed top-10 right-4 max-w-xs bg-red-300 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg z-50"
            role="alert"
        >
            <p className="font-bold">An Error Occurred</p>
            <p>{message}</p>
        </div>

    );
};

export default ErrorMessage;
