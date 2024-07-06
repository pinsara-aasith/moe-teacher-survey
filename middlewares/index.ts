import { NextResponse } from 'next/server'
import { Middleware } from '../lib/types/middleware'
import { NextRequestWithUser } from '../lib/checkIfAuthenticated'

export type AppMiddleware = (
  _req: NextRequestWithUser,
  params?: { [key: string]: any },
  _next?: AppMiddleware
) => Promise<void | NextResponse>

export type ApiHandler = (
  _req: NextRequestWithUser,
  params?: { [key: string]: any },
) => Promise<void | NextResponse>


export const withMiddlewares = (...middlewares: Middleware[]): Middleware => {
  // Create chain of middlewares
  const chain = middlewares.reduceRight(
    (next, middleware) => (req, res) => middleware(req, res, next),
    (_req, res) => res.status(200).json({ success: true })
  )

  // Return chain of middlewares
  return chain
}

export const withAppMiddlewares = (...middlewares: AppMiddleware[]): AppMiddleware => {
  // Create chain of middlewares
  const chain = middlewares.reduceRight(
    (next, middleware) => async (req, params) => {
      if (middleware.length == 3) {
        return await middleware(req, params, next)
      } else if (middleware.length == 2) {
        return await middleware(req, params)
      } if (middleware.length == 1) {
        return await middleware(req)
      }

    },
    (_req) => Promise.resolve(NextResponse.json<any>({ success: true }, { status: 200 }))
  )

  // Return chain of middlewares
  return chain
}
