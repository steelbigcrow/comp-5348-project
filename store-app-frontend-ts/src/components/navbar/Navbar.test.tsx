import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('shows Login/Register links when logged out', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });

  it('shows Order List/Profile/Logout when logged in', () => {
    sessionStorage.setItem('userId', '1');

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Order List' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
  });

  it('toggles the mobile menu when clicking the toggle button', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const mobileMenu = homeLink.closest('div');
    expect(mobileMenu).toHaveClass('hidden');

    await userEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    expect(mobileMenu).toHaveClass('block');
  });

  it('clears session and navigates to login on logout', async () => {
    sessionStorage.setItem('userId', '1');

    render(
      <MemoryRouter initialEntries={['/order-list']}>
        <Navbar />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(sessionStorage.getItem('userId')).toBeNull();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Order List' })).not.toBeInTheDocument();
  });
});
