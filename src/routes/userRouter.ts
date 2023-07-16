import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import axios from 'axios'

import * as db from '../modules/query'
import getValidationUser from '../utils/getValidationUser'
import { createToken, isSignIn } from '../modules/auth'

const router = express.Router()

// 유저 이메일 회원가입
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const token = createToken(email, 0)
    if (!getValidationUser('email', email)) {
      res.status(403).json({
        success: false,
        msg: '이메일이 올바르지 않습니다.',
      })
      return
    }
    if (!getValidationUser('password', password)) {
      res.status(403).json({
        success: false,
        msg: '비밀번호가 올바르지 않습니다.',
      })
      return
    }
    if (!getValidationUser('name', name)) {
      res.status(403).json({
        success: false,
        msg: '이름이 올바르지 않습니다.',
      })
      return
    }

    const [findByUser] = await db.findUserByEmail({ email })
    if (findByUser) {
      if (findByUser.disabled === 1) {
        res.status(409).json({
          success: false,
          msg: '탈퇴한 회원 입니다.',
        })
        return
      }
      res.status(409).json({
        success: false,
        msg: '이미 가입 된 회원 입니다.',
      })
      return
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const userToken = createToken(email, 0)
    await db.insertUserByEmail({
      email,
      password: hashPassword,
      name,
      type: 0,
      user_token: userToken,
    })
    const [signUpUser] = await db.findUserByEmail({ email })
    res.status(200).json({
      success: true,
      msg: `${name}님 회원가입 되었습니다.`,
      data: {
        token: signUpUser.user_token,
        user: {
          name: signUpUser.name,
          type: signUpUser.type,
        },
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

// 유저 이메일 로그인
router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (!getValidationUser('email', email)) {
      res.status(401).json({
        success: false,
        msg: '아이디 또는 비밀번호가 일치하지 않습니다.',
      })
      return
    }
    if (!getValidationUser('password', password)) {
      res.status(401).json({
        success: false,
        msg: '아이디 또는 비밀번호가 일치하지 않습니다.',
      })
      return
    }

    const [findByUser] = await db.findUserByEmail({ email })
    if (!findByUser) {
      return res.status(409).json({
        success: false,
        msg: '아이디 또는 비밀번호가 일치하지 않습니다.',
      })
    }
    const isMatchUser = await bcrypt.compare(password, findByUser.password)
    if (!isMatchUser) {
      return res.status(409).json({
        success: false,
        msg: '아이디 또는 비밀번호가 일치하지 않습니다.',
      })
    }

    delete findByUser.password

    const token = createToken(findByUser.email, 0)
    await db.updateUserTokenByEmail({ user_token: token, email })
    res.status(200).json({
      success: true,
      msg: `${findByUser.name}님 로그인 되었습니다.`,
      data: {
        user: findByUser,
      },
    })
  } catch (e) {
    console.error(e)
    res.status(401).json({
      success: false,
      msg: '오류가 발생 했습니다.',
    })
  }
})

router.post('/auth', isSignIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params
    const [findByUser] = await db.findUserByEmail({ email })
    delete findByUser.password
    res.status(200).json({
      success: true,
      data: {
        user: findByUser,
      },
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      msg: '오류가 발생 했습니다.',
    })
  }
})

router.post('/oauth/kakao', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body
    if (!code) {
      return res.status(409).json({
        success: false,
        msg: '코드 값이 없습니다.',
      })
    }

    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            grant_type: 'authorization_code',
            client_id: '22a47cacd66d8fbc418475aec08c1495',
            code,
            redirect_uri: 'http://localhost:5173/oauth/kakao',
          },
        },
      )

      const { access_token } = response.data
      const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      const {
        id,
        kakao_account: { nickname },
      } = data

      const name = nickname || `카카오@${id}`

      if (!id) {
        return res.status(409).json({
          success: false,
          msg: '카카오 로그인 정보가 올바르지 않습니다.',
        })
      }

      const [findByUser] = await db.findUserBySocial({ social_token: id, type: 1 })
      if (!findByUser) {
        const userToken = createToken(id, 1)
        await db.insertUserBySocial({
          name,
          type: 1,
          user_token: userToken,
          social_token: String(id),
        })
      }
      const [signinUser] = await db.findUserBySocial({ social_token: id, type: 1 })
      res.status(200).json({
        success: true,
        msg: `${nickname}님 로그인 되었습니다.`,
        data: {
          token: signinUser.user_token,
          user: {
            name: signinUser.name,
            type: signinUser.type,
          },
        },
      })
    } catch (e) {
      return res.status(409).json({
        success: false,
        msg: '카카오 로그인에 실패 했습니다.',
      })
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      msg: '오류가 발생 했습니다.',
    })
  }
})

export default router
