import * as db from '../config/mysql_connect'
import { Feeling } from '../interface/diary.interface'

export const findUserById = async ({ id }: { id: string }) => {
  try {
    const SQL = 'select id, email, password, type, name, role, user_token, disabled from user where id = ?'
    const SQL_VALUES = [id]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const findUserByEmail = async ({ email }: { email: string }) => {
  try {
    const SQL =
      'select id, email, password, type, name, role, user_token, disabled from user where type = 0 and email = ?'
    const SQL_VALUES = [email]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const findUserBySocial = async ({ type, social_token }: { type: number; social_token: string }) => {
  try {
    const SQL = 'select id, type, name, role, user_token, disabled from user where type = ? and social_token = ?'
    const SQL_VALUES = [type, social_token]
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
}: {
  email: string
  password: string
  name: string
  type: number
  user_token: string
}) => {
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

export const updateUserTokenByEmail = async ({ user_token, email }: { user_token: string; email: string }) => {
  try {
    const SQL = 'update user set user_token = ? where email = ?'
    const SQL_VALUES = [user_token, email]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const insertUserBySocial = async ({
  name,
  type,
  user_token,
  social_token,
}: {
  name: string
  type: number
  user_token: string
  social_token: string
}) => {
  try {
    const SQL = 'insert into user(name, type, user_token, social_token) values(?, ?, ?, ?)'
    const SQL_VALUES = [name, type, user_token, social_token]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row.insertId
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const updateUserTokenBySocial = async ({
  type,
  user_token,
  social_token,
}: {
  type: number
  user_token: string
  social_token: string
}) => {
  try {
    const SQL = 'update user set user_token = ? where type = ? AND social_token = ?'
    const SQL_VALUES = [user_token, type, social_token]
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
  id: number
  feeling: Feeling
  emotions: string
  text: string
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
