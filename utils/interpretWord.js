export function interpretWord(texto) {
  let resultado = ''

  resultado = texto.includes('_')
    ? texto.replace(/_/g, ' ')
    : texto
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')

  // Converter primeira letra para minúscula, se for camelCase
  if (texto[0] === texto[0]?.toLowerCase()) {
    resultado = resultado.charAt(0).toLowerCase() + resultado.slice(1)
  }

  return resultado
}
