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
  feel,
  emotions = '',
  text = '',
  dateString,
}: {
  id: number
  feel: Feeling
  emotions: string
  text: string
  dateString: string
}) => {
  try {
    const SQL = 'insert into diary(id, feel, emotions, text, create_date) values(?, ?, ?, ?, ?)'
    const SQL_VALUES = [id, feel, emotions, text, dateString]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row.insertId
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const updateDiary = async ({
  diaryId,
  id,
  feel,
  emotions = '',
  text = '',
}: {
  diaryId: number
  id: number
  feel: Feeling
  emotions: string
  text: string
}) => {
  try {
    const SQL = 'UPDATE diary SET feel = ?, emotions = ?, text = ? WHERE diary_id = ? AND id = ?'
    const SQL_VALUES = [feel, emotions, text, diaryId, id]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row.affectedRows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const deleteDiary = async ({ diaryId, id }: { diaryId: number; id: number }) => {
  try {
    const SQL = 'DELETE FROM diary WHERE diary_id = ? AND id = ?'
    const SQL_VALUES = [diaryId, id]
    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row.affectedRows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const getDiariesByYearAndMonth = async ({ id, year, month }: { id: number; year: number; month: number }) => {
  try {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const startDateString = startDate.toISOString().split('T')[0]
    const endDateString = endDate.toISOString().split('T')[0]

    const SQL = 'SELECT * FROM diary WHERE id = ? AND create_date >= ? AND create_date <= ? ORDER BY create_date'
    const SQL_VALUES = [id, startDateString, endDateString]

    const [rows] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return rows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const getDiariesByYearMonthAndDate = async ({
  id,
  year,
  month,
  date,
}: {
  id: number
  year: number
  month: number
  date: number
}) => {
  try {
    const createDate = `${year}-${month}-${date}`
    const SQL = 'SELECT * FROM diary WHERE id = ? AND create_date = ?'
    const SQL_VALUES = [id, createDate]

    const [rows] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return rows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const getDiaryByUserIdAndDiaryId = async ({ diaryId, id }: { diaryId: number; id: number }) => {
  try {
    const SQL = 'select * from diary where diary_id = ? and id = ?'
    const SQL_VALUES = [diaryId, id]

    const [rows] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return rows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const getQuestionByType = async ({ type }: { type: string }) => {
  try {
    const SQL = 'select * from question where type = ?'
    const SQL_VALUES = [type]

    const [rows] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return rows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const getAnswerByUserId = async ({ id }: { id: number }) => {
  try {
    const SQL = 'select * from answer where id = ? order by create_date desc'
    const SQL_VALUES = [id]

    const [rows] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return rows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const getAnswerByUserIdAndAnswerId = async ({ answerId, id }: { answerId: number; id: number }) => {
  try {
    const SQL = 'select * from answer where answer_id = ? and id = ?'
    const SQL_VALUES = [answerId, id]

    const [rows] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return rows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const insertAnswer = async ({ id, type, result }: { id: number; type: string; result: string }) => {
  try {
    const SQL = 'insert into answer(id, type, result) values(?, ?, ?)'
    const SQL_VALUES = [id, type, result]

    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row.insertId
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}

export const deleteAnswer = async ({ answerId, id }: { answerId: number; id: number }) => {
  try {
    const SQL = 'delete from answer where answer_id = ? and id = ?'
    const SQL_VALUES = [answerId, id]

    const [row] = await db.connect((con: any) => con.query(SQL, SQL_VALUES))()
    return row.affectedRows
  } catch (e: any) {
    console.error(e)
    throw new Error(e)
  }
}
