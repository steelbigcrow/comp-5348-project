import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../../test/msw/server';
import { renderWithRouter } from '../../test/utils/render';
import OrderList from './OrderList';

describe('OrderList (integration)', () => {
  it('shows an error when logged out', async () => {
    renderWithRouter(<OrderList />, { initialEntries: ['/order-list'] });

    expect(await screen.findByText('Order History')).toBeInTheDocument();
    expect(await screen.findByText('Please login to view orders')).toBeInTheDocument();
  });

  it('shows empty state when the user has no orders', async () => {
    sessionStorage.setItem('userId', '1');
    server.use(
      rest.get('*/store/users/:userId/orders', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      }),
    );

    renderWithRouter(<OrderList />, { initialEntries: ['/order-list'] });

    expect(await screen.findByText('Order History')).toBeInTheDocument();
    expect(await screen.findByText('No orders found.')).toBeInTheDocument();
  });

  it('renders orders and shows cancel button for pending payments', async () => {
    sessionStorage.setItem('userId', '1');

    renderWithRouter(<OrderList />, { initialEntries: ['/order-list'] });

    expect(await screen.findByText('Order History')).toBeInTheDocument();
    expect(await screen.findByText(/Order ID: 101/)).toBeInTheDocument();
    expect(screen.getByText(/Order ID: 102/)).toBeInTheDocument();
    expect(screen.getByText(/Order ID: 103/)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Cancel Payment' })).toBeInTheDocument();
    expect(screen.getByText('Payment completed')).toBeInTheDocument();
  });

  it('cancels payment successfully and reloads', async () => {
    sessionStorage.setItem('userId', '1');
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(<OrderList />, { initialEntries: ['/order-list'] });

    await screen.findByText(/Order ID: 101/);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel Payment' }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Payment cancelled successfully');
    });
    expect(await screen.findByText('Payment refunded')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel Payment' })).not.toBeInTheDocument();

    alertSpy.mockRestore();
  });

  it('shows backend error message when cancel payment fails', async () => {
    sessionStorage.setItem('userId', '1');

    server.use(
      rest.put('*/store/users/:userId/orders/:orderId/payments/:paymentId', (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Failed to cancel payment' }));
      }),
    );

    renderWithRouter(<OrderList />, { initialEntries: ['/order-list'] });

    await screen.findByText(/Order ID: 101/);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel Payment' }));

    expect(await screen.findByText('Failed to cancel payment')).toBeInTheDocument();
  });
});
