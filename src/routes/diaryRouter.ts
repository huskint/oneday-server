import express, { Request, Response } from 'express'

import * as db from '../modules/query'
import { isDiaryOwner, isSignIn } from '../modules/auth'
import { Emotion } from '../interface/diary.interface'
import getMappedEmotions from '../utils/getMappedEmotions'
import getMappedFeels from '../utils/getMappedFeels'
import isValidDateString from '../utils/isValidDateString'
import getFormDate from '../utils/getFormDate'
import getMappedDiary from '../utils/getMappedDiary'
import { getDiariesByYearMonthAndDate } from '../modules/query'

const router = express.Router()

router.post('/', isSignIn, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { feel, emotions = [], text, date } = req.body
    const staticFeels = getMappedFeels()
    const staticEmotions = getMappedEmotions()

    const dateString = getFormDate(date)
    const validDateString = isValidDateString(dateString)
    if (!validDateString) {
      res.status(403).json({
        success: false,
        msg: '날짜가 올바르지 않습니다.',
      })
      return
    }

    const findDiary = await getDiariesByYearMonthAndDate({
      id: parseInt(id, 10),
      year: parseInt(date.year, 10),
      month: parseInt(date.month, 10),
      date: parseInt(date.date, 10),
    })

    if (findDiary.length > 0) {
      res.status(403).json({
        success: false,
        msg: '이미 일기가 존재합니다.',
      })
      return
    }

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
    const { id } = req.params
    const { year, month } = req.query

    if (typeof year !== 'string' || typeof month !== 'string') {
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

    const mappedDiaries = diaries.map(getMappedDiary)

    res.status(200).json({
      success: true,
      data: {
        diary: mappedDiaries,
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

router.get('/:diaryId', isSignIn, isDiaryOwner, async (req: Request, res: Response) => {
  try {
    const { id, diaryId } = req.params
    if (!diaryId) {
      res.status(403).json({
        success: false,
        msg: 'diaryId가 올바르지 않습니다.',
      })
      return
    }

    const diary = await db.getDiaryByUserIdAndDiaryId({
      diaryId: parseInt(diaryId, 10),
      id: parseInt(id, 10),
    })

    const diaryRow = diary[0]
    if (!diaryRow) {
      res.status(403).json({
        success: false,
        msg: '해당 일기가 존재하지 않습니다.',
      })
      return
    }

    const mappedDiary = getMappedDiary(diaryRow)

    res.status(200).json({
      success: true,
      data: {
        diary: mappedDiary,
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

router.put('/:diaryId', isSignIn, isDiaryOwner, async (req: Request, res: Response) => {
  try {
    const { id, diaryId } = req.params
    const { feel, emotions = [], text, date } = req.body

    if (!diaryId) {
      res.status(403).json({
        success: false,
        msg: 'diaryId가 올바르지 않습니다.',
      })
      return
    }

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

    await db.updateDiary({
      diaryId: parseInt(diaryId, 10),
      id: parseInt(id, 10),
      feel,
      emotions: JSON.stringify(emotions),
      text,
    })

    res.status(200).json({
      success: true,
      msg: `일기가 수정 되었습니다.`,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      success: false,
      msg: '오류가 발생 했습니다.',
    })
  }
})

router.delete('/:diaryId', isSignIn, isDiaryOwner, async (req: Request, res: Response) => {
  try {
    const { id, diaryId } = req.params

    if (!diaryId) {
      res.status(403).json({
        success: false,
        msg: 'diaryId가 올바르지 않습니다.',
      })
      return
    }

    await db.deleteDiary({
      diaryId: parseInt(diaryId, 10),
      id: parseInt(id, 10),
    })

    res.status(200).json({
      success: true,
      msg: `일기가 삭제 되었습니다.`,
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
