export const TOKENS_PAIR = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQyNTk0NTAwfQ.ez5l_wIUwPsyMnDhHRj9tL-OZrFlJ2vTzPbE-7yD4P0', // Зашифрованный токен доступа
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQyNTk0NTAwfQ.Gc8ItN8oWr_hB5gDe5HHZ2WSoDC61_S5lD5wXJne8UI', // Зашифрованный токен обновления
};

export const UNAUTHORIZED = {
  statusCode: 401,
  message: 'Invalid user credentials',
  error: 'Unauthorized',
};
