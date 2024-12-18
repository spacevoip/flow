import { envSchema } from './schema';
import { defaultConfig } from './defaults';

function loadEnvConfig() {
  try {
    const config = {
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || defaultConfig.supabase.url,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || defaultConfig.supabase.anonKey,
      },
      api: {
        baseUrl: import.meta.env.VITE_API_URL || defaultConfig.api.baseUrl,
        pixUrl: import.meta.env.VITE_API_URL_PIX || defaultConfig.api.pixUrl,
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || defaultConfig.api.timeout,
      },
      security: {
        maxLoginAttempts: Number(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || defaultConfig.security.maxLoginAttempts,
        sessionTimeout: Number(import.meta.env.VITE_SESSION_TIMEOUT) || defaultConfig.security.sessionTimeout,
        rateLimit: {
          windowMs: Number(import.meta.env.VITE_RATE_LIMIT_WINDOW) || defaultConfig.security.rateLimit.windowMs,
          maxRequests: Number(import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS) || defaultConfig.security.rateLimit.maxRequests,
        },
      },
    };

    const validatedConfig = envSchema.parse(config);
    return validatedConfig;
  } catch (error) {
    console.error('Environment configuration validation error:', error);
    return defaultConfig;
  }
}

export const env = loadEnvConfig();