import http from '../http-common';
import productService, {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getProductList,
  updateProduct,
} from './productService';

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

describe('productService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getAllProducts calls anonymous browse endpoint', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await getAllProducts();
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/-1/products');
  });

  it('getProductList delegates to getAllProducts endpoint', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await getProductList();
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/-1/products');
  });

  it('getProduct calls product detail endpoint', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await getProduct(10, 99);
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/10/products/99');
  });

  it('createProduct posts to create endpoint', async () => {
    mockedHttp.post.mockResolvedValueOnce({ status: 200 });
    await createProduct(10, { name: 'A', description: 'B', price: 1 });
    expect(mockedHttp.post).toHaveBeenCalledWith('/store/users/10/products', {
      name: 'A',
      description: 'B',
      price: 1,
    });
  });

  it('updateProduct puts to update endpoint', async () => {
    mockedHttp.put.mockResolvedValueOnce({ status: 200 });
    await updateProduct(10, 99, { name: 'A' });
    expect(mockedHttp.put).toHaveBeenCalledWith('/store/users/10/products/99', { name: 'A' });
  });

  it('deleteProduct calls delete endpoint', async () => {
    mockedHttp.delete.mockResolvedValueOnce({ status: 200 });
    await deleteProduct(10, 99);
    expect(mockedHttp.delete).toHaveBeenCalledWith('/store/users/10/products/99');
  });

  it('default export exposes the same operations', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await productService.getProductList();
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/-1/products');
  });
});

