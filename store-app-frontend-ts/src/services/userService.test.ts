import http from '../http-common';
import userService, { getUser, login, register, updateUser } from './userService';

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

describe('userService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('login posts to login endpoint', async () => {
    mockedHttp.post.mockResolvedValueOnce({ status: 200 });
    await login({ email: 'a@b.com', password: 'pw' });
    expect(mockedHttp.post).toHaveBeenCalledWith('/store/users/login', { email: 'a@b.com', password: 'pw' });
  });

  it('register posts to register endpoint', async () => {
    mockedHttp.post.mockResolvedValueOnce({ status: 200 });
    await register({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'pw' });
    expect(mockedHttp.post).toHaveBeenCalledWith('/store/users/register', {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      password: 'pw',
    });
  });

  it('getUser calls user info endpoint', async () => {
    mockedHttp.get.mockResolvedValueOnce({ status: 200 });
    await getUser(7);
    expect(mockedHttp.get).toHaveBeenCalledWith('/store/users/7/info');
  });

  it('updateUser puts to update endpoint', async () => {
    mockedHttp.put.mockResolvedValueOnce({ status: 200 });
    await updateUser(7, { firstName: 'A', lastName: 'B', password: 'pw' });
    expect(mockedHttp.put).toHaveBeenCalledWith('/store/users/7/info/update', {
      firstName: 'A',
      lastName: 'B',
      password: 'pw',
    });
  });

  it('default export maps create/get/update', async () => {
    mockedHttp.post.mockResolvedValueOnce({ status: 200 });
    await userService.create({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'pw' });
    expect(mockedHttp.post).toHaveBeenCalledWith('/store/users/register', {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      password: 'pw',
    });
  });
});

