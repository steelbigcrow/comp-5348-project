import type { Order } from '../../types';
import { productsFixture } from './products';
import { otherUserFixture, userFixture } from './users';
import { paymentFixture } from './payments';

const timestampFixture = '2025-01-01T00:00:00.000Z';

export const createdOrderFixture: Order = {
  id: 101,
  timestamp: timestampFixture,
  quantity: 2,
  amount: productsFixture[0].price * 2,
  orderStatus: 'PENDING',
  deliveryStatus: 'PENDING',
  product: productsFixture[0],
  user: userFixture,
};

export const ordersFixture: Order[] = [
  {
    ...createdOrderFixture,
    id: 101,
    payment: paymentFixture,
  },
  {
    ...createdOrderFixture,
    id: 102,
    orderStatus: 'COMPLETED',
    payment: paymentFixture,
  },
  {
    ...createdOrderFixture,
    id: 103,
    payment: undefined,
  },
  {
    ...createdOrderFixture,
    id: 104,
    user: otherUserFixture,
    payment: paymentFixture,
  },
];

