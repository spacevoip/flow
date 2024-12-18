export const defaultConfig = {
  supabase: {
    url: '',
    anonKey: '',
  },
  api: {
    baseUrl: 'http://localhost:3000',
    pixUrl: 'http://localhost:3000/pix',
    timeout: 30000,
  },
  security: {
    maxLoginAttempts: 5,
    sessionTimeout: 3600000, // 1 hour
    rateLimit: {
      windowMs: 900000, // 15 minutes
      maxRequests: 100,
    },
  },
};