import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import paymentService from '../../services/payment.service';
import ErrorMessage from '../../components/error/error';
import { getSessionData } from '../../util/session_util';

const PaymentInfo = () => {
    const location = useLocation();
    const { productId, data, name, price, quantity, total } = location.state || {};

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [error, setError] = useState('');
    const sessionData = getSessionData('userId')
    const userId = sessionData.userId

    const handlePayment = async (e) => {
        e.preventDefault();


        const account = {
            'fromAccountId': cardNumber,
            'quantity': data.quantity,
            'address': cardName
        }
        try {
            const response = await paymentService.createPayment(userId, data.id, account)
            if (response && response.status == 200) {
                alert("SuccessFul")
            }
        } catch (e) {
            setError(e.response.data.message || 'An Error Occurred');
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}

            <h2 className="text-2xl font-bold text-center mb-4">Payment Information</h2>
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <p><strong>Product:</strong> {name}</p>
            <p><strong>Single Item Price:</strong> ${price.toFixed(2)}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p><strong>Total Amount:</strong> ${total}</p>

            <form onSubmit={handlePayment} className="mt-6">
                <div className="mb-4">
                    {data.quantity}
                    <label className="block text-sm font-medium mb-1" htmlFor="cardNumber">Your Account ID</label>
                    <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Your Account ID"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="cardName">Address</label>
                    <input
                        type="text"
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Address"
                    />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                    Make Payment
                </button>
            </form>
        </div>
    );
};

export default PaymentInfo;
