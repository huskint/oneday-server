import express, { Request, Response, NextFunction } from 'express'

import * as db from '../modules/query'
import { isSignIn } from '../modules/auth'
import { Emotion, Feeling } from '../interface/diary.interface'

const router = express.Router()

// 일기 등록
router.post('/', isSignIn, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { feeling, emotions = [], text } = req.body
    const feelingList = Object.values(Feeling)
    const emotionList = Object.values(Emotion)

    if (!feelingList.includes(feeling)) {
      res.status(403).json({
        success: false,
        msg: '기분이 올바르지 않습니다.',
      })
      return
    }

    if (
      Array.isArray(emotions) &&
      emotions.length > 0 &&
      !emotions.every((emotion: Emotion) => emotionList.includes(emotion))
    ) {
      res.status(403).json({
        success: false,
        msg: '감정이 올바르지 않습니다.',
      })
      return
    }

    await db.insertDiary({
      id: parseInt(id, 10),
      feeling,
      emotions: JSON.stringify(emotions),
      text,
    })

    res.status(200).json({
      success: true,
      msg: `일기가 등록 되었습니다.`,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      success: false,
      msg: '오류가 발생 했습니다.',
    })
  }
})

export default router
