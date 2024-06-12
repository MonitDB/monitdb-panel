/**
 * Agrupa os elementos de um array com base em uma chave especificada.
 *
 * @param {Array} array - O array de objetos a ser agrupado.
 * @param {string} key - A chave pela qual os objetos serão agrupados.
 * @returns {Array} - Um array de objetos, cada um contendo um rótulo e os dados agrupados.
 */
export function groupBy(array, key) {
  const groupedResult = {}

  for (const object of array) {
    const keyValue = object[key]

    if (!groupedResult[keyValue]) {
      groupedResult[keyValue] = []
    }

    groupedResult[keyValue].push(object)
  }

  return Object.entries(groupedResult).map(([label, data]) => ({
    label,
    data,
  }))
}
