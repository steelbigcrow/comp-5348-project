import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { rest } from 'msw';
import { renderWithRouter } from '../../test/utils/render';
import { server } from '../../test/msw/server';
import { createdOrderFixture, productsFixture } from '../../test/fixtures';
import PaymentInfo from './PaymentInfo';

describe('PaymentInfo (integration)', () => {
  it('shows a message when no order state is provided', () => {
    renderWithRouter(
      <Routes>
        <Route path="/payment-info" element={<PaymentInfo />} />
      </Routes>,
      { initialEntries: ['/payment-info'] },
    );

    expect(screen.getByText('No order information available.')).toBeInTheDocument();
  });

  it('shows an error when submitting while logged out', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/payment-info" element={<PaymentInfo />} />
      </Routes>,
      {
        initialEntries: [
          {
            pathname: '/payment-info',
            state: {
              data: createdOrderFixture,
              name: productsFixture[0].name,
              price: productsFixture[0].price,
              quantity: 2,
              total: '25.00',
              productId: 1,
            },
          },
        ],
      },
    );

    await userEvent.type(screen.getByLabelText('Your Account ID'), 'acc-1');
    await userEvent.type(screen.getByLabelText('Address'), 'Sydney');
    await userEvent.click(screen.getByRole('button', { name: 'Make Payment' }));

    expect(await screen.findByText('Please login first.')).toBeInTheDocument();
  });

  it('submits payment successfully and navigates to order list', async () => {
    sessionStorage.setItem('userId', '1');
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(
      <Routes>
        <Route path="/payment-info" element={<PaymentInfo />} />
        <Route path="/order-list" element={<div>ORDER LIST PAGE</div>} />
      </Routes>,
      {
        initialEntries: [
          {
            pathname: '/payment-info',
            state: {
              data: createdOrderFixture,
              name: productsFixture[0].name,
              price: productsFixture[0].price,
              quantity: 2,
              total: '25.00',
              productId: 1,
            },
          },
        ],
      },
    );

    await userEvent.type(screen.getByLabelText('Your Account ID'), 'acc-1');
    await userEvent.type(screen.getByLabelText('Address'), 'Sydney');
    await userEvent.click(screen.getByRole('button', { name: 'Make Payment' }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Payment Successful!');
    });
    expect(await screen.findByText('ORDER LIST PAGE')).toBeInTheDocument();

    alertSpy.mockRestore();
  });

  it('shows backend error message when payment fails', async () => {
    sessionStorage.setItem('userId', '1');

    server.use(
      rest.post('*/store/users/:userId/orders/:orderId/payments', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'Payment failed' }));
      }),
    );

    renderWithRouter(
      <Routes>
        <Route path="/payment-info" element={<PaymentInfo />} />
      </Routes>,
      {
        initialEntries: [
          {
            pathname: '/payment-info',
            state: {
              data: createdOrderFixture,
              name: productsFixture[0].name,
              price: productsFixture[0].price,
              quantity: 2,
              total: '25.00',
              productId: 1,
            },
          },
        ],
      },
    );

    await userEvent.type(screen.getByLabelText('Your Account ID'), 'acc-1');
    await userEvent.type(screen.getByLabelText('Address'), 'Sydney');
    await userEvent.click(screen.getByRole('button', { name: 'Make Payment' }));

    expect(await screen.findByText('Payment failed')).toBeInTheDocument();
  });
});
