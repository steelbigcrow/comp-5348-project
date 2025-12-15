import type React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export type RouterInitialEntry =
  | string
  | {
      pathname: string;
      search?: string;
      hash?: string;
      state?: unknown;
      key?: string;
    };

export const renderWithRouter = (
  ui: React.ReactElement,
  options: { initialEntries?: RouterInitialEntry[] } = {},
) => {
  const { initialEntries = ['/'] } = options;

  return render(<MemoryRouter initialEntries={initialEntries as never}>{ui}</MemoryRouter>);
};

