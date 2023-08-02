const isValidDateString = (dateString: string) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(dateString)

export default isValidDateString
