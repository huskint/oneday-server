type FormDate = {
  year: number
  month: number
  date: number
}

const getFormDate = (dateObj: FormDate) => {
  const { year, month, date } = dateObj

  const formattedMonth = month.toString().padStart(2, '0')
  const formattedDate = date.toString().padStart(2, '0')

  return `${year}-${formattedMonth}-${formattedDate}`
}

export default getFormDate
