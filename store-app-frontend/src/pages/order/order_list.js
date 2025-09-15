import React, { useEffect, useState } from 'react';
import OrderService from '../../services/order.service';
import Cookies from 'js-cookie';
import PaymentService from '../../services/payment.service';
import ErrorMessage from '../../components/error/error';
import { getSessionData } from '../../util/session_util';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const userId = Cookies.get('userId');
    const sessionData = getSessionData('userId');
    const userId = sessionData.userId;

    const handleCancelPayment = (userId, orderId, paymentId) => (e) => {
        e.preventDefault();
        PaymentService.cancelPayment(userId, paymentId, orderId)
            .then(response => {
                if (response.status == 200) {
                    alert("successful")
                }
            })
            .catch(error => {
                console.log(error)
                setError(error.response.data.message)
            })

    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Fetch user data using the ID from the cookie
                const response = await OrderService.getOrderListByUser(sessionData.userId)
                const filteredOrders = response.data.filter(order => order.user.id === userId);
                setOrders(filteredOrders);

                setLoading(false);
            } catch (error) {
                setError(error.message || 'Failed to fetch user data. Please try again later.');
                setLoading(false);
                console.error("Error fetching user data:", error);
            }
        };

        fetchOrder();

    }, []);

    if (loading) return <div className="text-center text-gray-500">Loading...</div>;


    return (
        <>
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}
            <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>
                <div className="grid gap-6 max-w-2xl w-full">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
                        >
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Order ID: {order.id}</h2>

                            <div className="grid grid-cols-2 gap-y-2 text-gray-600">
                                <span className="font-semibold">Timestamp:</span>
                                <span>{new Date(order.timestamp).toLocaleString()}</span>

                                <span className="font-semibold">Quantity:</span>
                                <span>{order.quantity}</span>

                                <span className="font-semibold">Order Amount:</span>
                                <span>${order.amount.toFixed(2)}</span>

                                <span className="font-semibold">Order Status:</span>
                                <span>{order.orderStatus}</span>

                                <span className="font-semibold">Delivery Status:</span>
                                <span>{order.deliveryStatus}</span>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-700">Product Details</h3>
                                <div className="ml-4 text-gray-600">
                                    <p><span className="font-semibold">Name:</span> {order.product.name}</p>
                                    <p><span className="font-semibold">Description:</span> {order.product.description}</p>
                                    <p><span className="font-semibold">Price:</span> ${order.product.price.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-700">User Information</h3>
                                <div className="ml-4 text-gray-600">
                                    <p><span className="font-semibold">Name:</span> {order.user.firstName} {order.user.lastName}</p>
                                    <p><span className="font-semibold">Email:</span> {order.user.email}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-700">Payment Information</h3>
                                {order.payment ? (
                                    <div className="ml-4 text-gray-600">
                                        <p><span className="font-semibold">Amount Paid:</span> ${order.payment.amount.toFixed(2)}</p>
                                        <p><span className="font-semibold">Status:</span> {order.payment.paymentStatus}</p>
                                        <p><span className="font-semibold">Transaction ID:</span> {order.payment.transactionRecordId}</p>
                                    </div>
                                ) : (
                                    <p className="ml-4 text-gray-500">Payment has not been made yet.</p>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                {order.payment && (order.orderStatus === "COMPLETED" || order.orderStatus === "REFUNDED") ? (
                                    <span className="text-gray-500 text-sm">Payment {order.orderStatus.toLowerCase()}</span>
                                ) : order.payment ? (
                                    <button
                                        onClick={(e) => handleCancelPayment(userId, order.id, order.payment.id)(e)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                    >
                                        Cancel Payment
                                    </button>
                                ) : <></>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>


    );
};

export default OrderList;
