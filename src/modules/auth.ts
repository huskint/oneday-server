import jwt from 'jsonwebtoken'
import config from '../config'
import * as db from '../modules/query'
import { NextFunction, Request, Response } from 'express'

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
      msg: '올바른 접근이 아닙니다.',
    })
  }

  const token = authorization.split('Bearer ')[1]
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: '올바른 접근이 아닙니다.',
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string)
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({
        success: false,
        msg: '올바른 접근이 아닙니다.',
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
      msg: '올바른 접근이 아닙니다.',
    })
  }
}

export const isDiaryOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, diaryId } = req.params
    const diary = await db.getDiaryByUserIdAndDiaryId({
      diaryId: parseInt(diaryId, 10),
      id: parseInt(id, 10),
    })
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

export const isAnswerOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, answerId } = req.params
    const answer = await db.getAnswerByUserIdAndAnswerId({
      answerId: parseInt(answerId, 10),
      id: parseInt(id, 10),
    })
    if (!answer) {
      return res.status(401).json({
        success: false,
        msg: '해당 답변이 존재하지 않습니다.',
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
