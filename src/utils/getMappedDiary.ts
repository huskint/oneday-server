const getMappedDiary = (diary: { id: string; feel: string; emotions: string; text: string; crate_date: string }) => {
  const { id, feel, emotions, text, crate_date } = diary
  const targetDate = new Date(crate_date)
  const year = targetDate.getFullYear()
  const month = targetDate.getMonth() + 1
  const date = targetDate.getDate()
  return {
    diaryId: id,
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
