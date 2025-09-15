import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderService from '../../services/order.service';
import Cookies from 'js-cookie';
import { getSessionData } from '../../util/session_util';

const OrderInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { productId, name, price, quantity, description } = location.state || {};

    const [paymentInfo, setPaymentInfo] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });



    const handleSubmit = async (e) => {
        e.preventDefault()
        //const userId = Cookies.get('userId');
        const sessionData = getSessionData('userId');
        const userId = sessionData.userId;
        try {
            // Call the service to create the order
            const response = await OrderService.create(userId, { productId: productId, quantity: quantity });

            // Check if the order creation was successful
            if (response && response.status == 200) { // Adjust this check based on your API response structure
                const data = response.data;
                navigate('/payment-info', {
                    state: {
                        productId,
                        data,
                        name,
                        price,
                        quantity,
                        total: (price * quantity).toFixed(2),

                    },
                });

            } else {
                alert('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while creating the order. Please try again.');
        }
    };

    return (
        <div className="max-w-lg mx-auto my-10 p-8 bg-white rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Order Information</h2>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{name}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <div className="text-lg">
                    <p className="font-semibold text-gray-700">Price: <span className="text-gray-900">${price.toFixed(2)}</span></p>
                    <p className="font-semibold text-gray-700">Quantity: <span className="text-gray-900">{quantity}</span></p>
                    <p className="font-bold text-gray-800 mt-4 text-xl">Total: <span className="text-green-600">${(price * quantity).toFixed(2)}</span></p>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Create Order
                </button>
            </div>
        </div>
    );
};

export default OrderInfo;
