import jwt from 'jsonwebtoken'
import config from '../config'
import * as db from '../modules/query'
import { NextFunction, Request, Response } from 'express'

const { JWT_SECRET } = config

export const createToken = (email: string) => {
  return jwt.sign({
    user: email,
  }, JWT_SECRET as string, {
    expiresIn: '4 weeks',
  })
}

export const isSignIn = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      success: false,
      msg: '토큰이 없음. 인증이 거부됨.'
    });
  }

  const token = authorization.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: '토큰이 없음. 인증이 거부됨.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    // @ts-ignore
    const [findByUser] = await db.findUserByEmail({ email: decoded.user })
    if (!findByUser) {
      return res.status(401).json({
        success: false,
        msg: '유저가 존재하지 않습니다.',
      });
    }
    req.params.email = findByUser.email;
    next();
  } catch (e) {
    console.error(e);
    res.status(404).json({
      success: false,
      msg: '토큰이 유효하지 않습니다.'
    });
  }


}
