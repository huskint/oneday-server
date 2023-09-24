import express, { Request, Response } from 'express'

import { isSignIn } from '../modules/auth'
import { getQuestionByType } from '../modules/query'

const router = express.Router()

router.get('/:type', isSignIn, async (req: Request, res: Response) => {
  try {
    const { type } = req.params

    if (!type) {
      res.status(403).json({
        success: false,
        msg: '질문 타입이 올바르지 않습니다.',
      })
      return
    }

    const findQuestion = await getQuestionByType({
      type,
    })

    if (findQuestion.length === 0) {
      res.status(403).json({
        success: false,
        msg: '질문이 존재하지 않습니다.',
      })
      return
    }

    const mappedQuestion = findQuestion.map((question: any) => ({
      seq: question.seq,
      text: question.text,
    }))

    res.status(200).json({
      success: true,
      data: {
        question: mappedQuestion,
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
