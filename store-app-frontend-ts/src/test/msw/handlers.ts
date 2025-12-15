import { rest } from 'msw';
import {
  cancelledPaymentFixture,
  createdOrderFixture,
  getProductFixture,
  ordersFixture,
  paymentFixture,
  productsFixture,
  userFixture,
} from '../fixtures';

export const handlers = [
  rest.get('*/store/users/-1/products', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(productsFixture));
  }),

  rest.get('*/store/users/:userId/products/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id as string, 10);
    const product = Number.isFinite(id) ? getProductFixture(id) : undefined;

    if (!product) {
      return res(ctx.status(404), ctx.json({ message: 'Product not found' }));
    }

    return res(ctx.status(200), ctx.json(product));
  }),

  rest.post('*/store/users/login', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(userFixture));
  }),

  rest.post('*/store/users/register', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(userFixture));
  }),

  rest.get('*/store/users/:id/info', (req, res, ctx) => {
    const id = parseInt(req.params.id as string, 10);
    if (!Number.isFinite(id)) {
      return res(ctx.status(400), ctx.json({ message: 'Invalid user id' }));
    }

    return res(ctx.status(200), ctx.json({ ...userFixture, id }));
  }),

  rest.put('*/store/users/:id/info/update', (req, res, ctx) => {
    const id = parseInt(req.params.id as string, 10);
    if (!Number.isFinite(id)) {
      return res(ctx.status(400), ctx.json({ message: 'Invalid user id' }));
    }

    const body = req.body as Partial<typeof userFixture> | undefined;

    return res(
      ctx.status(200),
      ctx.json({
        ...userFixture,
        id,
        firstName: body?.firstName ?? userFixture.firstName,
        lastName: body?.lastName ?? userFixture.lastName,
      }),
    );
  }),

  rest.post('*/store/users/:userId/orders', (req, res, ctx) => {
    const body = req.body as { productId?: number; quantity?: number } | undefined;

    const quantity = body?.quantity ?? createdOrderFixture.quantity;
    const amount = createdOrderFixture.product.price * quantity;

    return res(ctx.status(200), ctx.json({ ...createdOrderFixture, quantity, amount }));
  }),

  rest.get('*/store/users/:userId/orders', (req, res, ctx) => {
    const userId = parseInt(req.params.userId as string, 10);
    if (!Number.isFinite(userId)) {
      return res(ctx.status(400), ctx.json({ message: 'Invalid user id' }));
    }

    return res(ctx.status(200), ctx.json(ordersFixture));
  }),

  rest.post('*/store/users/:userId/orders/:orderId/payments', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(paymentFixture));
  }),

  rest.put('*/store/users/:userId/orders/:orderId/payments/:paymentId', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(cancelledPaymentFixture));
  }),
];
