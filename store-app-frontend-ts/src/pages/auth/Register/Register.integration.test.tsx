import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { rest } from 'msw';
import { server } from '../../../test/msw/server';
import { renderWithRouter } from '../../../test/utils/render';
import Register from './Register';

describe('Register (integration)', () => {
  it('registers successfully and navigates home', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<div>HOME</div>} />
      </Routes>,
      { initialEntries: ['/register'] },
    );

    await userEvent.type(screen.getByLabelText('First Name'), 'Test');
    await userEvent.type(screen.getByLabelText('Last Name'), 'User');
    await userEvent.type(screen.getByLabelText('Email'), 'test.user@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('HOME')).toBeInTheDocument();
    expect(sessionStorage.getItem('userId')).toBe('1');
  });

  it('shows backend error message on registration failure', async () => {
    server.use(
      rest.post('*/store/users/register', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'Registration failed' }));
      }),
    );

    renderWithRouter(
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>,
      { initialEntries: ['/register'] },
    );

    await userEvent.type(screen.getByLabelText('First Name'), 'Test');
    await userEvent.type(screen.getByLabelText('Last Name'), 'User');
    await userEvent.type(screen.getByLabelText('Email'), 'test.user@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Registration failed')).toBeInTheDocument();
  });
});
