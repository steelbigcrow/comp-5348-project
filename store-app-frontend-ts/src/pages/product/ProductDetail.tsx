/**
 * 产品详情页面组件
 * 点击列表进入后展示单个产品，并支持选择数量下单
 */

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSession, productService } from '../../services';
import type { Product, WithClassNameProps } from '../../types';

/**
 * ProductDetail 产品详情页面
 * @param props - 组件属性
 * @returns 产品详情 JSX
 */
const ProductDetail: React.FC<WithClassNameProps> = ({ className }) => {
  const { id } = useParams<{ id: string }>();
  const productId = useMemo(() => (id ? parseInt(id, 10) : NaN), [id]);

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const sessionData = getSession();

  // 未登录可浏览，用 -1 作为公共访问 userId（后端已支持该约定）
  const browseUserId = sessionData?.userId ?? -1;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!Number.isFinite(productId) || productId < 1) {
        setError('Invalid product id.');
        setLoading(false);
        return;
      }

      try {
        const response = await productService.getProduct(browseUserId, productId);
        setProduct(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch product. Please try again later.';
        setError(errorMessage);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [browseUserId, productId]);

  const incrementQuantity = (): void => {
    setQuantity((q) => q + 1);
  };

  const decrementQuantity = (): void => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleBuyNow = (): void => {
    if (!product) return;

    if (!sessionData?.userId) {
      alert('Please login to purchase');
      navigate('/login');
      return;
    }

    navigate('/order-info', {
      state: {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        description: product.description,
      },
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto my-10 p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Product Detail</h2>
        <p className="text-center text-red-500">{error || 'Product not found.'}</p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-3xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-2xl ${className || ''}`}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-extrabold text-gray-800">{product.name}</h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition"
        >
          Back to list
        </button>
      </div>

      <p className="text-gray-600 mt-4">{product.description}</p>
      <p className="text-3xl font-semibold text-indigo-600 mt-6">${product.price.toFixed(2)}</p>

      <div className="mt-6 flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Quantity:</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={decrementQuantity}
            className="w-9 h-9 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-full transition"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="min-w-8 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={incrementQuantity}
            className="w-9 h-9 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 font-semibold rounded-full transition"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-8">
        {sessionData?.userId ? (
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Buy Now
          </button>
        ) : (
          <p className="text-red-500 text-sm mt-2">Please login to purchase</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
