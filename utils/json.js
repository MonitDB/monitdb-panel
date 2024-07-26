export function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString)
  } catch {
    return {}
  }
}
