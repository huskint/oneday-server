import jwt from 'jsonwebtoken'
import config from '../config'
import * as db from '../modules/query'

const { JWT_SECRET } = config

export const createToken = (email: string) => {
  return jwt.sign({
    user: email,
  }, JWT_SECRET as string, {
    expiresIn: '4 weeks',
  })
}
