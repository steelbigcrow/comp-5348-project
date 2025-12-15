const DEFAULT_BASE_URL = 'http://127.0.0.1:8080';

describe('http-common', () => {
  const originalEnvBaseUrl = process.env.REACT_APP_API_BASE_URL;

  afterEach(() => {
    if (originalEnvBaseUrl === undefined) {
      delete process.env.REACT_APP_API_BASE_URL;
    } else {
      process.env.REACT_APP_API_BASE_URL = originalEnvBaseUrl;
    }
    jest.resetModules();
  });

  it('uses default baseURL when REACT_APP_API_BASE_URL is not set', async () => {
    delete process.env.REACT_APP_API_BASE_URL;
    jest.resetModules();

    const module = await import('./http-common');
    const http = module.default;

    expect(http.defaults.baseURL).toBe(DEFAULT_BASE_URL);
    expect(http.defaults.headers['Content-type']).toBe('application/json');
  });

  it('uses REACT_APP_API_BASE_URL when provided', async () => {
    process.env.REACT_APP_API_BASE_URL = 'http://example.test:9999';
    jest.resetModules();

    const module = await import('./http-common');
    const http = module.default;

    expect(http.defaults.baseURL).toBe('http://example.test:9999');
  });
});
