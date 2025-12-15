import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { rest } from 'msw';
import { server } from '../../../test/msw/server';
import { renderWithRouter } from '../../../test/utils/render';
import Login from './Login';

describe('Login (integration)', () => {
  it('logs in successfully and navigates home', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>HOME</div>} />
      </Routes>,
      { initialEntries: ['/login'] },
    );

    await userEvent.type(screen.getByLabelText('Email'), 'test.user@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('HOME')).toBeInTheDocument();
    expect(sessionStorage.getItem('userId')).toBe('1');
  });

  it('shows backend error message on login failure', async () => {
    server.use(
      rest.post('*/store/users/login', (_req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
      }),
    );

    renderWithRouter(
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>,
      { initialEntries: ['/login'] },
    );

    await userEvent.type(screen.getByLabelText('Email'), 'bad@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('alerts on forgot password', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>,
      { initialEntries: ['/login'] },
    );

    await userEvent.click(screen.getByRole('button', { name: 'Forgot Password?' }));
    expect(alertSpy).toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
