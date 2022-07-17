import * as db from '../config/mysql_connect';

export const findAllUser = async () => {
    try {
        const SQL: string = 'select * from user';
        const [row] = await db.connect((con: any) => con.query(SQL))();
        return row;
    } catch (e: any) {
        console.error(e);
        throw new Error(e);
    }
};
