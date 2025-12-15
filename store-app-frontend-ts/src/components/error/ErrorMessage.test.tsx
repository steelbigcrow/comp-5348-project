import { act, render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders an alert with the provided message', () => {
    render(<ErrorMessage message="Something went wrong" onClose={() => {}} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('An Error Occurred')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('auto-closes after 5 seconds', () => {
    const onClose = jest.fn();
    render(<ErrorMessage message="Boom" onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('cleans up the timer on unmount', () => {
    const onClose = jest.fn();
    const { unmount } = render(<ErrorMessage message="Boom" onClose={onClose} />);

    unmount();
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});

