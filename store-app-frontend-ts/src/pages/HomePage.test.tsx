import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

jest.mock('./product/ProductList', () => ({
  __esModule: true,
  default: () => <div data-testid="product-list" />,
}));

describe('HomePage', () => {
  it('renders ProductList', () => {
    render(<HomePage />);
    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  it('passes className to the wrapper element', () => {
    const { container } = render(<HomePage className="home-page" />);
    expect(container.firstChild).toHaveClass('home-page');
  });
});

