export function minutesToHours(minutes) {
  if (typeof minutes !== 'number' || minutes < 0) {
    throw new Error('O argumento deve ser um número positivo.')
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours}h:${remainingMinutes.toString().padStart(2, '0')}m`
}

export function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`
}

export function calculateMinutesFromDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new TypeError('O valor fornecido não é uma data válida.')
  }

  return date.getHours() * 60 + date.getMinutes()
}
