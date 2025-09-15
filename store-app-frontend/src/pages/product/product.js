// src/components/ProductList.js
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../../services/product.service';
import Cookies from 'js-cookie';
import { getSessionData } from '../../util/session_util';

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = Cookies.get('userId');

    const incrementQuantity = (id) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity: product.quantity + 1 } : product
        ));
    };
    const sessionData = getSessionData('userId');

    const navigate = useNavigate();

    const handleBuyNow = (product) => {
        // Navigate to the order info page with product and quantity as state
        navigate(`/order-info`, {
            state: {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                description: product.description,
            },
        });
    };



    const decrementQuantity = (id) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity: Math.max(1, product.quantity - 1) } : product
        ));
    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {

                // Fetch user data using the ID from the cookie
                const response = await productService.getProductList();
                const productsWithQuantity = response.data.map(product => ({ ...product, quantity: 1 }));
                setProducts(productsWithQuantity);

            } catch (error) {
                setError(error.message || 'Failed to fetch user data. Please try again later.');
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-5xl mx-auto my-10 p-8 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-10 text-gray-900">Explore Our Products </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex flex-col bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{product.description}</p>
                            <p className="text-2xl font-semibold text-indigo-600 mt-4">${product.price.toFixed(2)}</p>

                            <p className="text-gray-500 mt-1 flex items-center space-x-4">
                                <span>Quantity: {product.quantity}</span>
                                <span className="flex space-x-2">
                                    <button
                                        onClick={() => decrementQuantity(product.id)}
                                        className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-full transition"
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => incrementQuantity(product.id)}
                                        className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 font-semibold rounded-full transition"
                                    >
                                        +
                                    </button>
                                </span>
                            </p>

                            {sessionData && sessionData.userId ? (
                                <button
                                    onClick={() => handleBuyNow(product)}
                                    className="mt-6 bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Buy Now
                                </button>
                            ) : (
                                <p className="text-red-500 text-sm mt-4">Please login to purchase</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
