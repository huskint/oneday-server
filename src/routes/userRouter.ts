import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import * as db from '../modules/query';
import getValidation from "../utils/getValidation";
import { createToken } from "../modules/auth";

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const token = createToken(email);
        console.log(token);
        if (!getValidation('email', email)) {
            res.status(403).json({ success: false, msg: '이메일이 올바르지 않습니다.' });
            return;
        }
        if (!getValidation('password', password)) {
            res.status(403).json({ success: false, msg: '비밀번호가 올바르지 않습니다.' });
            return;
        }
        if (!getValidation('name', name)) {
            res.status(403).json({ success: false, msg: '이름이 올바르지 않습니다.' });
            return;
        }

        const findByUser = await db.findUserByEmail({ email });
        if (findByUser.length > 0) {
            if (findByUser[0].disabled === 1) {
                res.status(409).json({ success: false, msg: '탈퇴한 회원 입니다.' });
                return;
            }
            res.status(409).json({ success: false, msg: '이미 가입 된 회원 입니다.' });
            return;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const userToken = createToken(email);
        await db.insertUserByEmail({
            email,
            password: hashPassword,
            name,
            type: 0,
            user_token: userToken,
        });
        const [signUpUser] = await db.findUserByEmail({ email });
        res.status(200).json({ success: true, msg: `${name}님 회원가입 되었습니다.`, token: signUpUser.user_token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, msg: '오류가 발생 했습니다.' });
    }
});

export default router;
