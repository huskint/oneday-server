import express, { Request, Response } from 'express'

import * as db from '../modules/query'
import { isAnswerOwner, isSignIn } from '../modules/auth'
import { getAnswerByUserId, insertAnswer } from '../modules/query'

const router = express.Router()

router.get('/try', isSignIn, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const answers = await getAnswerByUserId({
      id: parseInt(id, 10),
    })

    let isTry = true
    if (answers.length > 0) {
      const recentAnswer = answers[0]
      const recentDate = new Date(recentAnswer.create_date)

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      recentDate.setHours(0, 0, 0, 0)

      const daysDifference = (today.getTime() - recentDate.getTime()) / (1000 * 60 * 60 * 24)
      isTry = daysDifference > 7
    }

    res.status(200).json({
      success: true,
      data: {
        isTry,
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

router.get('/', isSignIn, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const answers = await getAnswerByUserId({
      id: parseInt(id, 10),
    })

    const getMappedAnswer = (answer: string) =>
      answer.split('').map((score: string, index: number) => ({
        seq: index + 1,
        score: parseInt(score, 10),
      }))

    const mappedAnswers = answers.map((answer: any) => {
      const mappedAnswer = getMappedAnswer(answer.result)
      return {
        answer_id: answer.answer_id,
        type: answer.type,
        answer: mappedAnswer,
        sumScore: mappedAnswer.reduce((acc: number, cur: any) => acc + cur.score, 0),
      }
    })

    res.status(200).json({
      success: true,
      data: {
        answers: mappedAnswers,
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

router.get('/:answerId', isSignIn, isAnswerOwner, async (req: Request, res: Response) => {
  try {
    const { id, answerId } = req.params

    const answer = await db.getAnswerByUserIdAndAnswerId({
      answerId: parseInt(answerId, 10),
      id: parseInt(id, 10),
    })

    if (answer.length === 0) {
      res.status(403).json({
        success: false,
        msg: '해당 답변이 존재하지 않습니다.',
      })
      return
    }

    const getMappedAnswer = (answer: string) =>
      answer.split('').map((score: string, index: number) => ({
        seq: index + 1,
        score: parseInt(score, 10),
      }))

    const mappedAnswer = getMappedAnswer(answer[0].result)

    res.status(200).json({
      success: true,
      data: {
        answer: mappedAnswer,
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

router.post('/write', isSignIn, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { type, scores } = req.body

    if (!type) {
      res.status(403).json({
        success: false,
        msg: '질문 타입이 올바르지 않습니다.',
      })
      return
    }

    if (!Array.isArray(scores) || scores.length !== 10) {
      res.status(403).json({
        success: false,
        msg: '점수가 올바르지 않습니다.',
      })
      return
    }

    if (!scores.every((score: number) => score >= 0 && score <= 9)) {
      res.status(403).json({
        success: false,
        msg: '점수는 1부터 9까지만 가능합니다.',
      })
      return
    }

    const answers = await getAnswerByUserId({
      id: parseInt(id, 10),
    })

    let isTry = true
    if (answers.length > 0) {
      const recentAnswer = answers[0]
      const recentDate = new Date(recentAnswer.create_date)

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      recentDate.setHours(0, 0, 0, 0)

      const daysDifference = (today.getTime() - recentDate.getTime()) / (1000 * 60 * 60 * 24)
      isTry = daysDifference > 7
    }

    if (!isTry) {
      res.status(403).json({
        success: false,
        msg: '7일이 지나야 테스트를 할 수 있습니다.',
      })
      return
    }

    await insertAnswer({
      id: parseInt(id, 10),
      type,
      result: scores.join(''),
    })

    res.status(200).json({
      success: true,
      msg: '테스트가 완료 되었습니다.',
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
