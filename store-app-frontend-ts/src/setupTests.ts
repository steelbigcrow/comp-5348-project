import '@testing-library/jest-dom';
import { TransformStream } from 'stream/web';
import { TextDecoder, TextEncoder } from 'util';

if (typeof globalThis.TransformStream === 'undefined') {
  (globalThis as unknown as { TransformStream: typeof TransformStream }).TransformStream =
    TransformStream;
}

if (typeof globalThis.TextEncoder === 'undefined') {
  (globalThis as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  (globalThis as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
}

const { server } = require('./test/msw/server') as typeof import('./test/msw/server');

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  sessionStorage.clear();
});

afterAll(() => {
  server.close();
});
