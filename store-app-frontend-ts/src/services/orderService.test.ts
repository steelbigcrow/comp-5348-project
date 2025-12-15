import http from '../http-common';
import orderService, {
  createOrder,
  getOrder,
  getOrderList,
  getOrderListByUser,
  updateOrder,
} from './orderService';

jest.mock('../http-common', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedHttp = http as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
};

describe('orderService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getOrderList calls user orders endpoint', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await getOrderList(7);
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/7/orders');
  });

  it('getOrderListByUser calls user orders endpoint', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await getOrderListByUser(7);
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/7/orders');
  });

  it('getOrder calls order detail endpoint', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await getOrder(7, 101);
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/7/orders/101');
  });

  it('createOrder posts to create endpoint', async () => {
    mockedHttp.post.mockResolvedValueOnce({ status: 200 });
    await createOrder(7, { productId: 1, quantity: 2 });
    expect(mockedHttp.post).toHaveBeenCalledWith('/store/users/7/orders', { productId: 1, quantity: 2 });
  });

  it('updateOrder puts to update endpoint', async () => {
    mockedHttp.put.mockResolvedValueOnce({ status: 200 });
    await updateOrder(7, 101, { orderStatus: 'COMPLETED' });
    expect(mockedHttp.put).toHaveBeenCalledWith('/store/users/7/orders/101', { orderStatus: 'COMPLETED' });
  });

  it('default export exposes create/update', async () => {
    mockedHttp.post.mockResolvedValueOnce({ status: 200 });
    await orderService.create(7, { productId: 1, quantity: 2 });
    expect(mockedHttp.post).toHaveBeenCalledWith('/store/users/7/orders', { productId: 1, quantity: 2 });
  });
});

