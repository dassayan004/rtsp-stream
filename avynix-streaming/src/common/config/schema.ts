import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  BASE_URL: z.string().url('BASE_URL must be a valid URL'),

  PORT: z
    .string()
    .default('8000')
    .transform((val) => {
      const num = Number(val);
      if (Number.isNaN(num) || num <= 0) {
        throw new Error('PORT must be a valid number');
      }
      return num;
    }),

  MEDIAMTX_CONTROL_BASE: z
    .string()
    .url('MEDIAMTX_CONTROL_BASE must be a valid URL')
    .default('http://localhost:9997'),
  MEDIAMTX_HLS_BASE: z
    .string()
    .url('MEDIAMTX_HLS_BASE must be a valid URL')
    .default('http://localhost:8888'),
  MEDIAMTX_WEBRTC_BASE: z
    .string()
    .url('MEDIAMTX_WEBRTC_BASE must be a valid URL')
    .default('http://localhost:8889'),
  MEDIAMTX_USER: z.string().default('admin'),
  MEDIAMTX_PASS: z.string().default('admin'),
});

export type ConfigSchema = z.infer<typeof configSchema>;
