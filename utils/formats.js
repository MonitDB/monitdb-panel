export const getFormattedDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

export const formatObjectToQuery = (object) => {
  const string_ = []
  for (const p in object) {
    if (object?.[p]) {
      string_.push(encodeURIComponent(p) + '=' + encodeURIComponent(object[p]))
    }
  }
  return string_.join('&')
}

export const megaBytesToGigaBytes = (mb) => {
  if (!mb) return mb
  return (Number.parseInt(mb) / 1024).toFixed(2)
}

export const dateStringToTime = (dateString) => new Date(dateString).getTime();
