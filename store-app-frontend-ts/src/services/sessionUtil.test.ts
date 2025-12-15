import {
  clearSession,
  getSession,
  getUserId,
  isLoggedIn,
  setSession,
  setUserId,
} from './sessionUtil';

describe('sessionUtil', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('returns null when no user id is stored', () => {
    expect(getUserId()).toBeNull();
    expect(getSession()).toBeNull();
    expect(isLoggedIn()).toBe(false);
  });

  it('stores and reads user id from sessionStorage', () => {
    setUserId(123);
    expect(getUserId()).toBe(123);
    expect(sessionStorage.getItem('userId')).toBe('123');
  });

  it('treats non-numeric user id as not logged in', () => {
    sessionStorage.setItem('userId', 'not-a-number');
    expect(getUserId()).toBeNull();
    expect(getSession()).toBeNull();
    expect(isLoggedIn()).toBe(false);
  });

  it('setSession/getSession roundtrip', () => {
    setSession({ userId: 7 });
    expect(getSession()).toEqual({ userId: 7 });
    expect(isLoggedIn()).toBe(true);
  });

  it('clearSession removes stored user id', () => {
    setUserId(1);
    clearSession();
    expect(sessionStorage.getItem('userId')).toBeNull();
    expect(getUserId()).toBeNull();
  });
});

