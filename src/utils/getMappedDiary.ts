const getMappedDiary = (diary: {
  diary_id: number
  feel: string
  emotions: string
  text: string
  create_date: string
}) => {
  const { diary_id, feel, emotions, text, create_date } = diary
  const targetDate = new Date(create_date)
  const year = targetDate.getFullYear()
  const month = targetDate.getMonth() + 1
  const date = targetDate.getDate()
  return {
    diaryId: diary_id,
    feel,
    emotions: JSON.parse(emotions),
    text,
    createDate: {
      year,
      month,
      date,
    },
  }
}

export default getMappedDiary
