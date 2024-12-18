import { z } from 'zod';

export const envSchema = z.object({
  supabase: z.object({
    url: z.string().default(''),
    anonKey: z.string().default(''),
  }),
  api: z.object({
    baseUrl: z.string().default(''),
    pixUrl: z.string().default(''),
    timeout: z.number().default(30000),
  }),
  security: z.object({
    maxLoginAttempts: z.number().default(5),
    sessionTimeout: z.number().default(3600000),
    rateLimit: z.object({
      windowMs: z.number().default(900000),
      maxRequests: z.number().default(100),
    }),
  }),
});

export type EnvConfig = z.infer<typeof envSchema>;