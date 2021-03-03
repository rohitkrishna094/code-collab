// change these - configurable
export const baseUrl =
  process.env.REACT_APP_BASE_URL || 'http://localhost:8080';

export const apiUrl = `${baseUrl}/api`;
export const judgeUrl = `${apiUrl}/judge`;
