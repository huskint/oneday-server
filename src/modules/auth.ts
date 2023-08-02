import jwt from 'jsonwebtoken'
import config from '../config'
import * as db from '../modules/query'
import { NextFunction, Request, Response } from 'express'
import { getDiaryByUserIdAndDiaryId } from '../modules/query'

const { JWT_SECRET } = config

export const createToken = (userId: string, type: number) => {
  return jwt.sign(
    {
      userId,
      type,
    },
    JWT_SECRET as string,
    {
      expiresIn: '4 weeks',
    },
  )
}

export const isSignIn = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({
      success: false,
      msg: '토큰이 없음. 인증이 거부됨.',
    })
  }

  const token = authorization.split('Bearer ')[1]
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: '토큰이 없음. 인증이 거부됨.',
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string)
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({
        success: false,
        msg: '토큰이 유효하지 않습니다.',
      })
    }

    const [findByUser] =
      decoded.type === 0
        ? await db.findUserByEmail({ email: decoded.userId })
        : await db.findUserBySocial({
            type: decoded.type,
            social_token: decoded.userId,
          })

    if (!findByUser) {
      return res.status(401).json({
        success: false,
        msg: '유저가 존재하지 않습니다.',
      })
    }

    req.params.email = findByUser.email
    req.params.id = findByUser.id
    next()
  } catch (e) {
    console.error(e)
    res.status(404).json({
      success: false,
      msg: '토큰이 유효하지 않습니다.',
    })
  }
}

export const isDiaryOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, diaryId } = req.params
    const diary = await db.getDiaryByUserIdAndDiaryId({ diaryId, id })
    if (!diary) {
      return res.status(401).json({
        success: false,
        msg: '해당 일기가 존재하지 않습니다.',
      })
    }
    next()
  } catch (e) {
    console.error(e)
    res.status(500).json({
      success: false,
      msg: '오류가 발생했습니다.',
    })
  }
}
