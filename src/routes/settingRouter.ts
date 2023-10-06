import express, { Request, Response } from 'express'

import { isSignIn } from '../modules/auth'
import { getAnswerCountByUserId, getDiariesCountByUserId } from '../modules/query'

const router = express.Router()

router.get('/write', isSignIn, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const diaryCount = await getDiariesCountByUserId({
      id,
    })

    const answerCount = await getAnswerCountByUserId({
      id,
    })

    res.status(200).json({
      success: true,
      data: {
        diaryCount,
        answerCount,
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
