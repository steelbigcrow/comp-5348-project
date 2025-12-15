import { screen } from '@testing-library/react';
import App from './App';
import { renderWithRouter } from './test/utils/render';

type RouteCase = {
  path: string;
  assertion: () => Promise<void> | void;
};

describe('App routing', () => {
  const cases: RouteCase[] = [
    {
      path: '/',
      assertion: async () => {
        expect(await screen.findByText('Explore Our Products')).toBeInTheDocument();
      },
    },
    {
      path: '/login',
      assertion: () => {
        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
      },
    },
    {
      path: '/register',
      assertion: () => {
        expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
      },
    },
    {
      path: '/profile',
      assertion: () => {
        expect(screen.getByRole('heading', { name: 'User Profile' })).toBeInTheDocument();
      },
    },
    {
      path: '/order-info',
      assertion: () => {
        expect(screen.getByText('No product information available.')).toBeInTheDocument();
      },
    },
    {
      path: '/payment-info',
      assertion: () => {
        expect(screen.getByText('No order information available.')).toBeInTheDocument();
      },
    },
    {
      path: '/order-list',
      assertion: async () => {
        expect(await screen.findByText('Order History')).toBeInTheDocument();
      },
    },
    {
      path: '/product',
      assertion: async () => {
        expect(await screen.findByText('Explore Our Products')).toBeInTheDocument();
      },
    },
    {
      path: '/product/1',
      assertion: async () => {
        expect(await screen.findByText('Coffee Mug')).toBeInTheDocument();
      },
    },
  ];

  it.each(cases)('renders route $path', async ({ path, assertion }) => {
    renderWithRouter(<App />, { initialEntries: [path] });
    await assertion();
  });
});

