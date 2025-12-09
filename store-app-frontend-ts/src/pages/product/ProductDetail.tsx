/**
 * 产品列表页面组件
 * 显示所有产品并提供购买功能
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, getSession } from '../../services';
import {
  Product,
  ProductWithQuantity,
  ProductListPageProps,
} from '../../types';

/**
 * ProductDetail 产品列表页面组件
 * 显示所有可购买的产品，支持数量选择和购买
 * @param props - 组件属性
 * @returns 产品列表页面 JSX 元素
 */
const ProductDetail: React.FC<ProductListPageProps> = ({ className }) => {
  // 产品列表状态（带数量）
  const [products, setProducts] = useState<ProductWithQuantity[]>([]);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);
  // 错误状态
  const [error, setError] = useState<string | null>(null);

  // 获取用户会话
  const sessionData = getSession();

  // 路由导航
  const navigate = useNavigate();

  /**
   * 增加产品数量
   * @param id - 产品ID
   */
  const incrementQuantity = (id: number): void => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  /**
   * 减少产品数量（最小为1）
   * @param id - 产品ID
   */
  const decrementQuantity = (id: number): void => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity - 1) }
          : product
      )
    );
  };

  /**
   * 处理立即购买
   * @param product - 要购买的产品
   */
  const handleBuyNow = (product: ProductWithQuantity): void => {
    // 导航到订单信息页面，传递产品和数量
    navigate('/order-info', {
      state: {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
      },
    });
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // 获取产品列表
        const response = await productService.getProductList();
        // 为每个产品添加默认数量1
        const productsWithQuantity: ProductWithQuantity[] = response.data.map(
          (product: Product) => ({
            ...product,
            quantity: 1,
          })
        );
        setProducts(productsWithQuantity);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch products. Please try again later.';
        setError(errorMessage);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className={`max-w-5xl mx-auto my-10 p-8 bg-gray-50 rounded-xl shadow-lg ${className || ''}`}>
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-900">
        Explore Our Products
      </h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {product.description}
              </p>
              <p className="text-2xl font-semibold text-indigo-600 mt-4">
                ${product.price.toFixed(2)}
              </p>

              <p className="text-gray-500 mt-1 flex items-center space-x-4">
                <span>Quantity: {product.quantity}</span>
                <span className="flex space-x-2">
                  <button
                    onClick={() => decrementQuantity(product.id)}
                    className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-full transition"aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <button
                    onClick={() => incrementQuantity(product.id)}
                    className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 font-semibold rounded-full transition"
                    aria-label="Increase quantity"
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
                <p className="text-red-500 text-sm mt-4">
                  Please login to purchase
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;