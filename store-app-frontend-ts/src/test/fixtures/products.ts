import type { Product } from '../../types';

export const productsFixture: Product[] = [
  {
    id: 1,
    name: 'Coffee Mug',
    description: 'A mug for coffee',
    price: 12.5,
  },
  {
    id: 2,
    name: 'Tea Kettle',
    description: 'A kettle for tea',
    price: 39.99,
  },
];

export const getProductFixture = (id: number): Product | undefined =>
  productsFixture.find((product) => product.id === id);

