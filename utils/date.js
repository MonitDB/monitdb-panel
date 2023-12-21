function getMonthsArray(startDate) {
  const currentDate = new Date()
  const monthsArray = []
  let currentDatePointer = new Date(startDate)

  while (currentDatePointer <= currentDate) {
    const month = currentDatePointer.toLocaleString('default', {
      month: 'long',
    })
    const year = currentDatePointer.getFullYear()

    currentDatePointer.setDate(1)

    monthsArray.push({ value: new Date(currentDatePointer), year, month })

    currentDatePointer.setMonth(currentDatePointer.getMonth() + 1)
  }

  return monthsArray
}

const parseDateString = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export { getMonthsArray, parseDateString }
