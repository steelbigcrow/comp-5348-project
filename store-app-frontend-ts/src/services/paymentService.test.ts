import http from '../http-common';
import paymentService, { cancelPayment, createPayment, getPayment } from './paymentService';

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

describe('paymentService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('createPayment posts to payments endpoint', async () => {
    mockedHttp.post.mockResolvedValueOnce({ status: 200 });
    await createPayment(7, 101, { fromAccountId: 'A', quantity: 2, address: 'Addr' });
    expect(mockedHttp.post).toHaveBeenCalledWith('/store/users/7/orders/101/payments', {
      fromAccountId: 'A',
      quantity: 2,
      address: 'Addr',
    });
  });

  it('getPayment calls payment detail endpoint', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await getPayment(7, 101, 201);
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/7/orders/101/payments/201');
  });

  it('cancelPayment puts to cancel endpoint', async () => {
    mockedHttp.put.mockResolvedValueOnce({ status: 200 });
    await cancelPayment(7, 201, 101);
    expect(mockedHttp.put).toHaveBeenCalledWith('/store/users/7/orders/101/payments/201');
  });

  it('default export exposes the same operations', async () => {
    mockedHttp.put.mockResolvedValueOnce({ status: 200 });
    await paymentService.cancelPayment(7, 201, 101);
    expect(mockedHttp.put).toHaveBeenCalledWith('/store/users/7/orders/101/payments/201');
  });
});

