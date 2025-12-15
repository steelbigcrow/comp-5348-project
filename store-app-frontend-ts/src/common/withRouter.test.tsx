import type React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { WithRouterProps } from '../types';
import { withRouter } from './withRouter';
import { renderWithRouter } from '../test/utils/render';

type DummyProps = WithRouterProps & { label: string };

const Dummy: React.FC<DummyProps> = ({ label, router }) => {
  return (
    <div>
      <div>{label}</div>
      <div>pathname:{router.location.pathname}</div>
      <div>id:{router.params.id}</div>
      <button type="button" onClick={() => router.navigate('/next')}>
        Go Next
      </button>
    </div>
  );
};

const WrappedDummy = withRouter(Dummy);

const CurrentPath = () => {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
};

describe('withRouter', () => {
  it('injects router props and supports navigation', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/items/:id" element={<WrappedDummy label="hello" />} />
        <Route path="/next" element={<div>Next Page</div>} />
        <Route path="*" element={<CurrentPath />} />
      </Routes>,
      { initialEntries: ['/items/42'] },
    );

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('pathname:/items/42')).toBeInTheDocument();
    expect(screen.getByText('id:42')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Go Next' }));
    expect(screen.getByText('Next Page')).toBeInTheDocument();
  });

  it('sets a helpful displayName', () => {
    expect(WrappedDummy.displayName).toBe('withRouter(Dummy)');
  });
});
