const allowedOrigins = new Set([
  'https://www.sofia-olsson.online',
  'https://sofia-olsson.vercel.app',
  'http://localhost:3000',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177'
]);

export const getCorsHeaders = (origin: string | null) => {
  try {
    console.log('CORS request from origin:', origin);
    console.log('Allowed origins:', Array.from(allowedOrigins));
  } catch (error) {
    console.error('Error logging CORS info:', error);
  }
  const headers = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS, GET',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };

  if (origin && allowedOrigins.has(origin)) {
    return {
      ...headers,
      'Access-Control-Allow-Origin': origin
    };
  }

  return headers;
};
