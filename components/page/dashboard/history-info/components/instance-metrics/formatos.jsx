import React from 'react'

import estilo from '../ui/painel.module.css'

// O maior valor de uma coluna nesta leitura. E a escala das barras: barra cheia
// quer dizer "o maior destes agora", e nao uma percentagem de coisa nenhuma.
export function maximoDaColuna(linhas, chave) {
  let maior = 0
  for (const linha of linhas ?? []) {
    const numero = Number(linha?.[chave])
    if (Number.isFinite(numero) && numero > maior) maior = numero
  }
  return maior
}

// Soma de uma coluna, com os valores que nao sao numero a contar como zero.
export function somaDaColuna(linhas, chave) {
  let total = 0
  for (const linha of linhas ?? []) {
    const numero = Number(linha?.[chave])
    if (Number.isFinite(numero)) total += numero
  }
  return total
}

export const comSeparador = (valor) => {
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero.toLocaleString() : '—'
}

export const comCasas = (valor, casas = 1) => {
  const numero = Number(valor)
  return Number.isFinite(numero)
    ? numero.toLocaleString(undefined, {
        minimumFractionDigits: casas,
        maximumFractionDigits: casas,
      })
    : '—'
}

export const cortado = (texto) => (
  <span className={estilo.corta} title={String(texto ?? '')}>
    {texto ?? '—'}
  </span>
)

// Milissegundos acumulados em forma legivel. 328 541 014 ms nao se le; 3 d 19 h
// le-se. O Grafana deles faz o mesmo nos Top 10 ("34.2 mins") e tem razao.
export function comoDuracao(valor) {
  const ms = Number(valor)
  if (!Number.isFinite(ms)) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  const segundos = ms / 1000
  if (segundos < 60) return `${comCasas(segundos)} s`
  const minutos = segundos / 60
  if (minutos < 60) return `${comCasas(minutos)} min`
  const horas = minutos / 60
  if (horas < 24) return `${comCasas(horas)} h`
  return `${comCasas(horas / 24)} d`
}
