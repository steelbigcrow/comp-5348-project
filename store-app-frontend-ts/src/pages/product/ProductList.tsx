/**
 * 产品列表页面组件
 * 显示所有产品，点击进入详情页
 */

import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services';
import type { Product, ProductListPageProps } from '../../types';

/**
 * ProductList 产品列表页面组件
 * @param props - 组件属性
 * @returns 产品列表 JSX
 */
const ProductList: React.FC<ProductListPageProps> = ({ className }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await productService.getProductList();
        setProducts(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch products. Please try again later.';
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
    <div
      className={`max-w-5xl mx-auto my-10 p-8 bg-gray-50 rounded-xl shadow-lg ${className || ''}`}
    >
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-900">
        Explore Our Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-left flex flex-col bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`View details for ${product.name}`}
          >
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{product.description}</p>
              <p className="text-2xl font-semibold text-indigo-600 mt-4">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
