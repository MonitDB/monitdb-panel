export function groupBy(array, key) {
  const resultadoAgrupado = {}

  for (const object of array) {
    const keyValue = object[key]

    if (!resultadoAgrupado[keyValue]) {
      resultadoAgrupado[keyValue] = []
    }

    resultadoAgrupado[keyValue].push(object)
  }

  return Object.entries(resultadoAgrupado).map(([label, data]) => ({
    label,
    data,
  }))
}
