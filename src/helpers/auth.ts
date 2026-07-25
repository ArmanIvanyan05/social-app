const TOKEN_KEY = 'social_network_auth_token';

export const getAuthToken = (): string | null =>
  window.localStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token: string): void => {
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  window.localStorage.removeItem(TOKEN_KEY);
};

export const hasAuthToken = (): boolean => Boolean(getAuthToken());
