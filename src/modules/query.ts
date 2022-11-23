import * as db from '../config/mysql_connect'
import { Feeling } from '../interface/diary.interface'

export const findUserByEmail = async ({ email }: { email: string }) => {
  try {
    const SQL: string = 'select id, email, password, type, name, role, user_token, disabled from user where type = 0 and email = ?'
    const SQL_VALUES = [email]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const insertUserByEmail = async ({
  email,
  password,
  name,
  type,
  user_token,
}: { email: string, password: string; name: string; type: number, user_token: string }) => {
  try {
    const SQL = 'insert into user(email, password, name, type, user_token) values(?, ?, ?, ?, ?)'
    const SQL_VALUES = [email, password, name, type, user_token]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row.insertId
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const updateUserTokenByEmail = async ({ user_token, email }: { user_token: string, email: string }) => {
  try {
    const SQL: string = 'update user set user_token = ? where email = ?'
    const SQL_VALUES = [user_token, email]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const insertDiary = async ({
  id,
  feeling,
  emotions = '',
  text = '',
}: {
  id: number,
  feeling: Feeling,
  emotions: string,
  text: string,
}) => {
  try {
    const SQL = 'insert into diary(id, feeling, emotions, text) values(?, ?, ?, ?)'
    const SQL_VALUES = [id, feeling, emotions, text]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row.insertId
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}
