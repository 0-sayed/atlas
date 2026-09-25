import { resolve } from 'node:path'
import { z } from 'zod'
export type Config = {
  dir: string
  port: number
  frontendPort: number
  token: string
  staticDir?: string
}
const port = z.coerce.number().int().min(1024).max(65535)
export function config(): Config {
  const token = z
    .string()
    .min(32)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .parse(process.env.ATLAS_WRITE_TOKEN)
  return {
    dir: resolve(process.env.ATLAS_DATA_DIR ?? '.local'),
    port: port.parse(process.env.ATLAS_PORT ?? 4317),
    frontendPort: port.parse(process.env.ATLAS_FRONTEND_PORT ?? 5173),
    token,
    staticDir: resolve('dist'),
  }
}
