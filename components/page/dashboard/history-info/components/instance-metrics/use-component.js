import { useCallback, useEffect, useState } from 'react'

import useComponentContext from '~/services/state-manager/components'
import { hasPermission, TypeGrant } from '~/utils/hasPermission'

export const NOTA_MEDIA = 'media por segundo desde o arranque'

// Um pedido por COMPONENTE, nao por painel. O LTPERFCNT abastece quatro
// quadros e o LTSECCNT dois: se cada quadro fizesse o seu pedido, o ecra
// disparava seis chamadas iguais para ler a mesma DMV.
//
// O `erro` nao e enfeite. O executeQueryComponent do produto apanha a falha e
// devolve lista vazia, e uma lista vazia desenha-se exactamente como saude:
// quem olha ve um quadro vazio e conclui que nao ha nada a relatar. Aqui
// distingo "nao ha linhas" de "nao consegui ler".
export function useComponentData(componentCode, serverId) {
  const { executeQueryComponent } = useComponentContext()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState()
  const [lido, setLido] = useState()

  const fetchData = useCallback(async () => {
    if (!serverId) return
    try {
      setLoading(true)
      setErro()
      const resultado = await executeQueryComponent(componentCode, serverId)
      if (Array.isArray(resultado)) setData(resultado)
      else {
        setData([])
        setErro('resposta inesperada')
      }
    } catch {
      setData([])
      setErro('nao foi possivel ler')
      setLido(new Date())
    } finally {
      setLoading(false)
    }
  }, [componentCode, executeQueryComponent, serverId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, erro, lido, refetch: fetchData }
}

export const podeLer = (user, featureFunction) =>
  hasPermission(user, featureFunction, TypeGrant.READ)

// Os contadores de performance do SQL Server vem como pares nome/valor, e os
// valores grandes chegam como texto (bigint). Procuro pelo NOME que a query
// devolve e nao pela posicao na lista: se a query mudar de ordem, a posicao
// mente e o nome nao.
function linhaDoContador(data, nome) {
  return data?.find((item) => String(item?.Counter).trim() === nome)
}

export function valorDoContador(data, nome) {
  const valor = Number(linhaDoContador(data, nome)?.Value)
  return Number.isFinite(valor) ? valor : undefined
}

// Os contadores de seguranca sao ACUMULADOS desde o arranque da instancia. O
// numero cru nao diz nada (sao milhoes desde que o servico subiu), por isso
// divido pelo tempo de vida e mostro a media por segundo. O instante de
// arranque vem na propria linha.
export function mediaPorSegundo(data, nome) {
  const linha = linhaDoContador(data, nome)
  const valor = Number(linha?.Value)
  const arranque = new Date(linha?.StartTime ?? '').getTime()
  if (!Number.isFinite(valor) || !Number.isFinite(arranque)) return
  const segundos = (Date.now() - arranque) / 1000
  if (segundos <= 0) return
  return valor / segundos
}

export const inteiro = (valor) => {
  const numero = Number(valor)
  return Number.isFinite(numero)
    ? Math.round(numero).toLocaleString()
    : undefined
}

export const decimal = (valor, casas = 2) => {
  const numero = Number(valor)
  return Number.isFinite(numero)
    ? numero.toLocaleString(undefined, {
        minimumFractionDigits: casas,
        maximumFractionDigits: casas,
      })
    : undefined
}

// O desenho da Sara diz "verificado há N s". Mostro a HORA da leitura em vez do
// "há N s": o "há N s" só é verdade se alguém o for actualizando de segundo a
// segundo, e um contador parado a dizer "há 3 s" meia hora depois mente com
// mais confianca do que uma hora fixa.
export function horaDeLeitura(instante) {
  if (!instante) return ''
  return 'lido as ' + instante.toLocaleTimeString()
}
