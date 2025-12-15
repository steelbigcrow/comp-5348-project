import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import { renderWithRouter } from '../../test/utils/render';
import ProductDetail from './ProductDetail';

const OrderInfoStateViewer = () => {
  const location = useLocation();
  const state = location.state as { productId?: number; quantity?: number; name?: string } | null;

  return (
    <div>
      <div>productId:{state?.productId}</div>
      <div>quantity:{state?.quantity}</div>
      <div>name:{state?.name}</div>
    </div>
  );
};

describe('ProductDetail (integration)', () => {
  it('shows invalid id error for non-numeric param', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>,
      { initialEntries: ['/product/abc'] },
    );

    expect(await screen.findByText('Invalid product id.')).toBeInTheDocument();
  });

  it('renders product and shows login prompt when logged out', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>,
      { initialEntries: ['/product/1'] },
    );

    expect(await screen.findByText('Coffee Mug')).toBeInTheDocument();
    expect(screen.getByText('Please login to purchase')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Buy Now' })).not.toBeInTheDocument();
  });

  it('enforces minimum quantity of 1 and navigates with state on Buy Now when logged in', async () => {
    sessionStorage.setItem('userId', '1');

    renderWithRouter(
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/order-info" element={<OrderInfoStateViewer />} />
      </Routes>,
      { initialEntries: ['/product/1'] },
    );

    expect(await screen.findByText('Coffee Mug')).toBeInTheDocument();

    const decrease = screen.getByRole('button', { name: 'Decrease quantity' });
    const increase = screen.getByRole('button', { name: 'Increase quantity' });
    const quantityContainer = increase.closest('div');
    expect(quantityContainer).not.toBeNull();

    await userEvent.click(decrease);
    expect(within(quantityContainer as HTMLElement).getByText('1')).toBeInTheDocument();

    await userEvent.click(increase);
    await userEvent.click(increase);
    expect(within(quantityContainer as HTMLElement).getByText('3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Buy Now' }));

    expect(await screen.findByText('productId:1')).toBeInTheDocument();
    expect(screen.getByText('quantity:3')).toBeInTheDocument();
    expect(screen.getByText('name:Coffee Mug')).toBeInTheDocument();
  });
});
