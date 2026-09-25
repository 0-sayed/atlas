import 'reflect-metadata'
import {
  Module,
  Catch,
  type ExceptionFilter,
  type ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import { timingSafeEqual } from 'node:crypto'
import { ZodError } from 'zod'
import { Store, DataError } from './store.js'
import { ApiController } from './controller.js'
import type { Config } from './config.js'
@Catch()
class Errors implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>()
    const status =
      error instanceof DataError
        ? error.status
        : error instanceof ZodError
          ? 400
          : error instanceof HttpException
            ? error.getStatus()
            : error instanceof Error &&
                /Duplicate|Invalid|Reserved/.test(error.message)
              ? 400
              : 500
    res.status(status).json({
      error: {
        code:
          error instanceof DataError
            ? error.code
            : status === 400
              ? 'invalid_request'
              : status === 404
                ? 'not_found'
                : 'internal_error',
        message:
          error instanceof DataError
            ? error.message
            : status === 400
              ? 'Request violates the shared contract or scoped references'
              : 'Request unavailable',
        ...(error instanceof ZodError
          ? {
              fields: error.issues.map((i) => ({
                path: i.path.join('.'),
                code: i.code,
              })),
            }
          : {}),
      },
    })
  }
}
export async function createApp(config: Config) {
  const store = new Store(config.dir)
  @Module({
    controllers: [ApiController],
    providers: [{ provide: Store, useValue: store }],
  })
  class AppModule {}
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: false,
      bodyParser: false,
      abortOnError: false,
    })
    app.disable('x-powered-by')
    const hosts = new Set([
      `127.0.0.1:${config.port}`,
      `localhost:${config.port}`,
    ])
    const origins = new Set([...hosts].map((h) => `http://${h}`))
    // In development Vite proxies with changeOrigin, while preserving the browser Origin.
    origins.add(`http://127.0.0.1:${config.frontendPort}`)
    origins.add(`http://localhost:${config.frontendPort}`)
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'",
      )
      const deny = (status: number, code: string) =>
        res
          .status(status)
          .json({ error: { code, message: 'Local access required' } })
      if (
        !hosts.has(req.headers.host ?? '') ||
        (req.headers.origin !== undefined &&
          !origins.has(req.headers.origin)) ||
        req.headers['sec-fetch-site'] === 'cross-site'
      )
        return deny(403, 'forbidden')
      if (!['GET', 'HEAD'].includes(req.method)) {
        const supplied = Buffer.from(req.headers.authorization ?? '')
        const expected = Buffer.from(`Bearer ${config.token}`)
        if (
          supplied.length !== expected.length ||
          !timingSafeEqual(supplied, expected)
        )
          return deny(401, 'unauthorized')
        if (!req.is('application/json'))
          return deny(415, 'unsupported_media_type')
      }
      next()
    })
    app.use(express.json({ limit: '2mb', strict: true }))
    app.use(
      (
        err: { status?: number },
        _req: Request,
        res: Response,
        _next: NextFunction,
      ) => {
        void _next
        res.status(err.status === 413 ? 413 : 400).json({
          error: {
            code: 'invalid_body',
            message: 'Expected bounded JSON body',
          },
        })
      },
    )
    if (config.staticDir)
      app.use(
        express.static(config.staticDir, {
          dotfiles: 'deny',
          index: 'index.html',
          fallthrough: true,
        }),
      )
    app.useGlobalFilters(new Errors())
    await app.init()
    return app
  } catch (error) {
    store.close()
    throw error
  }
}
