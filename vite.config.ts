import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import ts from 'typescript'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(() => {
  const env = {
    ...loadEnv('development', process.cwd(), 'ATLAS_'),
    ...process.env,
  }
  const port = Number(env.ATLAS_PORT ?? 4317)
  return {
    plugins: [
      {
        name: 'nest-typescript',
        enforce: 'pre',
        transform(code, id) {
          if (!id.includes('/server/') || !id.endsWith('.ts')) return
          return ts.transpileModule(code, {
            compilerOptions: {
              target: ts.ScriptTarget.ES2022,
              module: ts.ModuleKind.ESNext,
              experimentalDecorators: true,
              emitDecoratorMetadata: true,
              sourceMap: true,
            },
            fileName: id,
          }).outputText
        },
      },
      react(),
      tailwindcss(),
    ],
    server: {
      host: '127.0.0.1',
      port: Number(env.ATLAS_FRONTEND_PORT ?? 5173),
      strictPort: true,
      proxy: {
        '/api': { target: `http://127.0.0.1:${port}`, changeOrigin: true },
      },
    },
    test: {
      include: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'server/**/*.test.ts',
        'shared/**/*.test.ts',
      ],
    },
  }
})
