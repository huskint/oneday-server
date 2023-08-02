import express, { Request, Response, NextFunction } from 'express'

import * as db from '../modules/query'
import { isSignIn } from '../modules/auth'
import { Emotion, Feeling } from '../interface/diary.interface'
import getMappedEmotions from '../utils/getMappedEmotions'
import getMappedFeels from '../utils/getMappedFeels'
import isValidDateString from '../utils/isValidDateString'
import getFormDate from '../utils/getFormDate'
import { getDiariesByYearAndMonth } from '../modules/query'

const router = express.Router()

// 일기 등록
router.post('/', isSignIn, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { feel, emotions = [], text, date } = req.body
    const staticFeels = getMappedFeels()
    const staticEmotions = getMappedEmotions()

    if (!staticFeels.includes(feel)) {
      res.status(403).json({
        success: false,
        msg: '기분이 올바르지 않습니다.',
      })
      return
    }

    if (
      Array.isArray(emotions) &&
      emotions.length > 0 &&
      !emotions.every((emotion: Emotion) => staticEmotions.includes(emotion))
    ) {
      res.status(403).json({
        success: false,
        msg: '감정이 올바르지 않습니다.',
      })
      return
    }

    const dateString = getFormDate(date)
    const validDateString = isValidDateString(dateString)
    if (!validDateString) {
      res.status(403).json({
        success: false,
        msg: '날짜가 올바르지 않습니다.',
      })
      return
    }

    await db.insertDiary({
      id: parseInt(id, 10),
      feel,
      emotions: JSON.stringify(emotions),
      text,
      dateString,
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

router.get('/', isSignIn, async (req: Request, res: Response) => {
  try {
    const { id, year, month } = req.params

    if (!year || !month) {
      res.status(403).json({
        success: false,
        msg: '년도와 월을 입력해주세요.',
      })
      return
    }

    const diaries = await db.getDiariesByYearAndMonth({
      id: parseInt(id, 10),
      year: parseInt(year, 10),
      month: parseInt(month, 10),
    })

    res.status(200).json({
      success: true,
      data: {
        diary: diaries || [],
      },
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
