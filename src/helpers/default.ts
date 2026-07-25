export const DEF = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002/api';

export const BASE = apiBaseUrl.replace(/\/api\/?$/, '');
