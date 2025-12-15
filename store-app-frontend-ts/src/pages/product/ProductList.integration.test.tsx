import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useParams } from 'react-router-dom';
import { rest } from 'msw';
import { renderWithRouter } from '../../test/utils/render';
import { server } from '../../test/msw/server';
import ProductList from './ProductList';

describe('ProductList (integration)', () => {
  it('shows loading then renders products', async () => {
    renderWithRouter(<ProductList />, { initialEntries: ['/product'] });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('Explore Our Products')).toBeInTheDocument();

    expect(screen.getByText('Coffee Mug')).toBeInTheDocument();
    expect(screen.getByText('Tea Kettle')).toBeInTheDocument();
  });

  it('shows an error when the API call fails', async () => {
    server.use(
      rest.get('*/store/users/-1/products', (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      }),
    );

    renderWithRouter(<ProductList />, { initialEntries: ['/product'] });

    expect(await screen.findByText(/Error:/)).toBeInTheDocument();
  });

  it('navigates to product detail when clicking a product card', async () => {
    const ProductDetailRoute = () => {
      const params = useParams<{ id: string }>();
      return <div>DETAIL:{params.id}</div>;
    };

    renderWithRouter(
      <Routes>
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetailRoute />} />
      </Routes>,
      { initialEntries: ['/product'] },
    );

    await screen.findByText('Explore Our Products');

    await userEvent.click(screen.getByRole('button', { name: 'View details for Coffee Mug' }));
    expect(await screen.findByText('DETAIL:1')).toBeInTheDocument();
  });
});
