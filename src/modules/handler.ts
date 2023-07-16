import { NextFunction, Request, Response } from 'express'

export interface IErr extends Error {
  status: number
  data?: any
}

export const logHandler = (err: IErr, req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date()}]` + '\n' + err.stack)
  next(err)
}

export const errorHandler = (err: IErr, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500)
  next(err)
}
