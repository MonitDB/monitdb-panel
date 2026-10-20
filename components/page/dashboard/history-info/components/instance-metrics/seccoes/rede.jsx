import React from 'react'

import { FeatureFunction } from '~/utils/hasPermission'

import Barra from '../../ui/barra'
import Cartao from '../../ui/cartao'
import Chip from '../../ui/chip'
import Seccao from '../../ui/seccao'
import Tabela from '../../ui/tabela'
import { comSeparador, cortado, maximoDaColuna } from '../formatos'
import { horaDeLeitura, podeLer } from '../use-component'

function colunasDaRede(tecto) {
  return [
    { chave: 'Client', cabecalho: 'Cliente' },
    { chave: 'Login', cabecalho: 'Login', formatar: cortado },
    { chave: 'Program', cabecalho: 'Programa', formatar: cortado },
    {
      chave: 'Connections',
      cabecalho: 'Ligacoes',
      direita: true,
      formatar: comSeparador,
    },
    {
      chave: 'PacketsRead',
      cabecalho: 'Pacotes recebidos',
      formatar: (valor) => (
        <Barra valor={valor} maximo={tecto} texto={comSeparador(valor)} />
      ),
    },
    {
      chave: 'PacketsWritten',
      cabecalho: 'Enviados',
      direita: true,
      formatar: comSeparador,
    },
  ]
}

function Rede({ user, netIo }) {
  if (!podeLer(user, FeatureFunction.NETWORK_IO_BY_CLIENT)) return <></>

  const clientes = (netIo.data ?? []).length

  return (
    <Seccao
      id="sec-rede"
      titulo="Rede e ligacoes"
      quando={horaDeLeitura(netIo.lido)}
      resumo={
        <Chip tom="info" ponto>
          {comSeparador(clientes)} clientes ligados
        </Chip>
      }
    >
      <Cartao
        titulo="Network I/O by client"
        largura={3}
        loading={netIo.loading}
        erro={netIo.erro}
        linhasEsqueleto={6}
        nota="so processos de utilizador; os pacotes sao acumulados por ligacao"
      >
        <Tabela
          colunas={colunasDaRede(maximoDaColuna(netIo.data, 'PacketsRead'))}
          linhas={netIo.data}
          limite={10}
        />
      </Cartao>
    </Seccao>
  )
}

export default Rede
