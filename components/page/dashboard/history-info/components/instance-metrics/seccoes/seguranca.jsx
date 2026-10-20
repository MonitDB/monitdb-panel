import React from 'react'

import {
  FeatureFunction,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'

import Cartao from '../../ui/cartao'
import Chip from '../../ui/chip'
import Etiqueta from '../../ui/etiqueta'
import Faixas from '../../ui/faixas'
import Seccao from '../../ui/seccao'
import { comCasas, comSeparador } from '../formatos'
import {
  horaDeLeitura,
  mediaPorSegundo,
  podeLer,
  valorDoContador,
} from '../use-component'

const MEDIA = 'media por segundo desde o arranque da instancia'

function Seguranca({ user, seg }) {
  const visivel = hasSomePermissions(
    user,
    [
      FeatureFunction.SECURITY_LOGINS_LOGOUTS_ERRORS,
      FeatureFunction.SECURITY_DEADLOCKS,
    ],
    TypeGrant.READ
  )
  if (!visivel) return <></>

  const contadores = podeLer(user, FeatureFunction.SECURITY_LOGINS_LOGOUTS_ERRORS)
  const deadlocks = valorDoContador(seg.data, 'Number of Deadlocks/sec')
  const errosPorSegundo = mediaPorSegundo(seg.data, 'Errors/sec')
  const ligacoes = valorDoContador(seg.data, 'User Connections')

  const faixas = [
    contadores && {
      nome: 'Logins',
      valor: comCasas(mediaPorSegundo(seg.data, 'Logins/sec'), 2),
      tom: 'nenhum',
    },
    contadores && {
      nome: 'Logouts',
      valor: comCasas(mediaPorSegundo(seg.data, 'Logouts/sec'), 2),
      tom: 'nenhum',
    },
    contadores && {
      nome: 'Errors',
      valor: comCasas(errosPorSegundo, 2),
      tom: errosPorSegundo > 0 ? 'warn' : 'ok',
      palavra: errosPorSegundo > 0 ? 'AVISO' : 'OK',
    },
    podeLer(user, FeatureFunction.SECURITY_DEADLOCKS) && {
      nome: 'Deadlocks',
      valor: comSeparador(deadlocks),
      tom: deadlocks > 0 ? 'crit' : 'ok',
      palavra: deadlocks > 0 ? 'CRITICO · qualquer um conta' : 'OK',
    },
  ].filter(Boolean)

  return (
    <Seccao
      id="sec-seguranca"
      titulo="Seguranca"
      quando={horaDeLeitura(seg.lido)}
      resumo={
        <>
          <Chip tom={deadlocks > 0 ? 'crit' : 'ok'} ponto>
            {comSeparador(deadlocks)} deadlocks
          </Chip>
          {ligacoes !== undefined && (
            <Chip tom="info">{comSeparador(ligacoes)} ligacoes agora</Chip>
          )}
        </>
      }
    >
      <Cartao
        titulo="Security counters"
        largura={2}
        loading={seg.loading}
        erro={seg.erro}
        etiquetas={<Etiqueta tom="info">por segundo</Etiqueta>}
        nota={MEDIA}
      >
        <Faixas itens={faixas} />
      </Cartao>
    </Seccao>
  )
}

export default Seguranca
