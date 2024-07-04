export type Middleware = <T extends ApiResponse<T>>(
  _req: NextRequestWithUser,
  _res: NextApiResponse<T>,
  _next?: Middleware
) => void | NextApiResponse<T>
