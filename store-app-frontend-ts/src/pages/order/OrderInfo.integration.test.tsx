import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { renderWithRouter } from '../../test/utils/render';
import OrderInfo from './OrderInfo';
import PaymentInfo from '../payment/PaymentInfo';

describe('OrderInfo (integration)', () => {
  it('shows a message when no product state is provided', () => {
    renderWithRouter(
      <Routes>
        <Route path="/order-info" element={<OrderInfo />} />
      </Routes>,
      { initialEntries: ['/order-info'] },
    );

    expect(screen.getByText('No product information available.')).toBeInTheDocument();
  });

  it('redirects to login when submitting while logged out', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(
      <Routes>
        <Route path="/order-info" element={<OrderInfo />} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>,
      {
        initialEntries: [
          {
            pathname: '/order-info',
            state: {
              productId: 1,
              name: 'Coffee Mug',
              price: 12.5,
              quantity: 2,
              description: 'A mug for coffee',
            },
          },
        ],
      },
    );

    await userEvent.click(screen.getByRole('button', { name: 'Create Order' }));
    expect(alertSpy).toHaveBeenCalledWith('Please login first.');
    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();

    alertSpy.mockRestore();
  });

  it('creates an order and navigates to payment info with state', async () => {
    sessionStorage.setItem('userId', '1');

    renderWithRouter(
      <Routes>
        <Route path="/order-info" element={<OrderInfo />} />
        <Route path="/payment-info" element={<PaymentInfo />} />
      </Routes>,
      {
        initialEntries: [
          {
            pathname: '/order-info',
            state: {
              productId: 1,
              name: 'Coffee Mug',
              price: 12.5,
              quantity: 2,
              description: 'A mug for coffee',
            },
          },
        ],
      },
    );

    await userEvent.click(screen.getByRole('button', { name: 'Create Order' }));
    expect(await screen.findByText('Payment Information')).toBeInTheDocument();
    expect(screen.getByText('Coffee Mug')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });
});
