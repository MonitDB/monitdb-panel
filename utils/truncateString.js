/**
 * Trunca uma string se for maior que um comprimento máximo e adiciona "..." ao final.
 *
 * @param {string} str - A string a ser truncada.
 * @param {number} [maxLength=60] - O comprimento máximo permitido para a string.
 * @returns {string} - A string truncada com "..." se exceder o comprimento máximo, ou a string original.
 */
export function truncateString(string_, maxLength = 60) {
  if (string_.length > maxLength) {
    return string_.slice(0, maxLength - 3) + '...'
  }
  return string_
}
