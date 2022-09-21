import { NextSeo } from 'next-seo'
import React from 'react'

import Grid from '~/components/grid'
import Link from '~/components/link'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'

const ConfigurationsPage = () => {
  return (
    <>
      <NextSeo title="Configurações - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader title="Configurações" />

            <Grid>
              <div className="col-span-2 space-y-10 md:col-span-6">
                <div className="w-full">
                  <h3 className="mb-5 heading-md">Monitoramento</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Servidores monitorados
                        </strong>
                        <span className="group-hover:opacity-75">
                          Adicionar servidores para monitorar; editar
                          credenciais de conexão; remover ou suspender
                          servidores monitorados.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Descoberta de instância
                        </strong>
                        <span className="group-hover:opacity-75">
                          Descubra novas instâncias em sua propriedade.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Hosts VMware
                        </strong>
                        <span className="group-hover:opacity-75">
                          Configure hosts VMware para monitoramento.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Vestígio
                        </strong>
                        <span className="group-hover:opacity-75">
                          Habilite ou desabilite o rastreamento do Profiler em
                          servidores selecionados.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Eventos estendidos
                        </strong>
                        <span className="group-hover:opacity-75">
                          Habilite ou desabilite eventos estendidos para alerta
                          avançado.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Grupos
                        </strong>
                        <span className="group-hover:opacity-75">
                          Organize seus servidores monitorados em grupos.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Opções do aplicativo</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Configurações de autenticação
                        </strong>
                        <span className="group-hover:opacity-75">
                          Defina as preferências de autenticação para o MonitDB.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Gerenciar usuários
                        </strong>
                        <span className="group-hover:opacity-75">
                          Gerencie usuários, funções e permissões.
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Conexões do monitor básico
                        </strong>
                        <span className="group-hover:opacity-75">
                          Veja os detalhes das conexões do seu monitor base;
                          conectar a diferentes monitores de base.
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Configurações do visor
                        </strong>
                        <span className="group-hover:opacity-75">
                          Defina as preferências de exibição do usuário para o
                          MonitDB.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">API</h3>

                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Tokens de autenticação
                        </strong>
                        <span className="group-hover:opacity-75">
                          Gerencie tokens de autenticação para o MonitDB.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Baixe o módulo PowerShell
                        </strong>
                        <span className="group-hover:opacity-75">
                          Configure o MonitDB por meio do PowerShell.
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Veja exemplos de scripts do PowerShell
                        </strong>
                        <span className="group-hover:opacity-75">
                          Baixe exemplos de scripts do PowerShell para a API.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-span-2 space-y-10 md:col-span-6">
                <div className="w-full">
                  <h3 className="mb-5 heading-md">Alertas e métricas</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Configurações de alerta
                        </strong>
                        <span className="group-hover:opacity-75">
                          Habilitar e desabilitar tipos de alerta; alterar os
                          limites e níveis de alerta.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Configurações de notificação
                        </strong>
                        <span className="group-hover:opacity-75">
                          Configure e gerencie notificações de alertas
                          (Email/Slack/SNMP/Webhook/EventLog).
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Métricas personalizadas
                        </strong>
                        <span className="group-hover:opacity-75">
                          Crie e gerencie métricas personalizadas e alertas
                          personalizados.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Supressão de alerta
                        </strong>
                        <span className="group-hover:opacity-75">
                          Crie janelas de supressão de alertas agendadas ou
                          pontuais (anteriormente janelas de manutenção).
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Gestão de dados</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          <i className="rounded py-px px-1 text-xs bg-blue text-white not-italic">
                            aprimoradas
                          </i>{' '}
                          Configurações de dados
                        </strong>
                        <span className="group-hover:opacity-75">
                          Especifique por quanto tempo o MonitDB mantém os dados
                          históricos em seu Repositório de Dados.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Licenciamento</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Licenciamento
                        </strong>
                        <span className="group-hover:opacity-75">
                          Aloque licenças para seus servidores.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Sobre</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Sobre
                        </strong>
                        <span className="group-hover:opacity-75">
                          Exiba informações sobre os componentes do MonitDB.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Grid>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsPage
