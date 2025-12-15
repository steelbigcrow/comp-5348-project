import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { rest } from 'msw';
import { server } from '../../test/msw/server';
import { renderWithRouter } from '../../test/utils/render';
import Profile from './Profile';

describe('Profile (integration)', () => {
  it('redirects to login on submit when logged out', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>,
      { initialEntries: ['/profile'] },
    );

    await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  it('loads user data when logged in', async () => {
    sessionStorage.setItem('userId', '1');

    renderWithRouter(
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>,
      { initialEntries: ['/profile'] },
    );

    await waitFor(() => {
      expect(screen.getByLabelText('First Name:')).toHaveValue('Test');
      expect(screen.getByLabelText('Last Name:')).toHaveValue('User');
      expect(screen.getByLabelText('Email:')).toHaveValue('test.user@example.com');
    });
  });

  it('requires password when submitting profile update', async () => {
    sessionStorage.setItem('userId', '1');

    renderWithRouter(
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>,
      { initialEntries: ['/profile'] },
    );

    await screen.findByLabelText('First Name:');
    await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(await screen.findByText('Password is required to update your profile.')).toBeInTheDocument();
  });

  it('updates profile successfully and navigates home', async () => {
    sessionStorage.setItem('userId', '1');

    renderWithRouter(
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<div>HOME</div>} />
      </Routes>,
      { initialEntries: ['/profile'] },
    );

    await userEvent.clear(await screen.findByLabelText('First Name:'));
    await userEvent.type(screen.getByLabelText('First Name:'), 'NewName');
    await userEvent.type(screen.getByLabelText('Password:'), 'pw');
    await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(await screen.findByText('HOME')).toBeInTheDocument();
  });

  it('shows backend error message when update fails', async () => {
    sessionStorage.setItem('userId', '1');

    server.use(
      rest.put('*/store/users/:id/info/update', (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Update failed' }));
      }),
    );

    renderWithRouter(
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>,
      { initialEntries: ['/profile'] },
    );

    await userEvent.type(await screen.findByLabelText('Password:'), 'pw');
    await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(await screen.findByText('Update failed')).toBeInTheDocument();
  });
});
