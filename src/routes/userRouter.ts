import express, { Request, Response, NextFunction } from 'express';
import * as db from '../modules/db_query';

const router = express.Router();

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userAll = await db.findAllUser();
        res.status(200).json(userAll);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

export default router;
