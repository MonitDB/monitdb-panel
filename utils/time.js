export function minutesToHours(minutes) {
  if (typeof minutes !== 'number' || minutes < 0) {
    throw new Error('O argumento deve ser um número positivo.')
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = (minutes % 60).toFixed(2)

  return `${hours}h:${remainingMinutes.toString().padStart(2, '00')}m`
}

export function calculateMinutesFromDate(value) {
  const date = new Date(value)

  return date.getHours() * 60 + date.getMinutes()
}
