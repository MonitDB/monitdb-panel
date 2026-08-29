/* eslint-disable @next/next/no-img-element */
import {
  faArrowRightFromBracket,
  faGear,
  faUser,
  faUserPen,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'antd'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import React from 'react'

import Image from '~/components/image'
import Link from '~/components/link'
import { useUser } from '~/hooks/index'
import { useConfigStore } from '~/services/state-manager/config-store'
import {
  Feature,
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'
// import DatabasesSvg from '~/icons/databases.svg'

// O separador ativo era o unico sinal e vinha do indigo da marca sobre preto —
// 2.9:1, nao se via. Agora o item aceso e branco com peso, o apagado e cinza
// legivel (nao branco a 50% de opacidade) e acende no hover.
const buttonClasses =
  'block h-16 leading-[64px] px-5 border-b-4 transition-colors lg:hover:text-white'
const buttonClassesActive = 'border-blue-soft text-white font-medium'
const buttonClassesIdle = 'border-gray-dark text-gray'

const Header = () => {
  const router = useRouter()

  const { config } = useConfigStore()

  const { userState } = useUser()

  const navMenuListData = [
    {
      title: 'Dashboard',
      href: '/dashboard/',
    },
    {
      title: 'Alerts',
      href: '/alerts/',
      requiredPermissions: Feature.ALERTS,
    },
    {
      title: 'Analysis',
      href: '/analysis/',
      requiredPermissions: Feature.ANALYSIS,
    },
    {
      title: 'Reports',
      href: '/reports/',
      requiredPermissions: Feature.REPORTS,
    },
    {
      title: 'States',
      href: '/states/',
      requiredPermissions: Feature.STATES,
    },
    {
      title: 'Integrations',
      href: '/integrations/',
      requiredPermissions: Feature.INTEGRATION,
    },
    {
      title: (
        <span className="whitespace-nowrap">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-1" />
          Monit AI
        </span>
      ),
      href: '/monit-ai/new',
      accent: true,
    },
    {
      title: 'Insights',
      href: '/insights/',
    },
    {
      title: 'Terminal',
      href: '/terminal/',
      requiredFeatureFunction: FeatureFunction.SSH_TERMINAL,
    },
    {
      title: 'Files',
      href: '/sftp/',
      requiredFeatureFunction: FeatureFunction.SSH_TERMINAL,
    },
    {
      title: 'Desktop',
      href: '/remote/',
      requiredFeatureFunction: FeatureFunction.REMOTE_DESKTOP,
    },
  ]

  const navMenuList = navMenuListData.filter((item) => {
    if (item.requiredFeatureFunction) {
      return hasPermission(userState, item.requiredFeatureFunction, TypeGrant.OWNER)
    }
    if (item.requiredPermissions) {
      return userState?.grants?.some((grant) => {
        return (
          grant.idFeature === item.requiredPermissions && grant.typeGrant != '0'
        )
      })
    }
    return true
  })

  return (
    <header className="relative w-full h-16 z-40">
      <div className="fixed bg-gray-dark w-full flex items-center justify-start text-white">
        <div className="w-full md:w-auto">
          <h1>
            <Link
              href="/dashboard/"
              className="flex items-center justify-center h-16 px-8 space-x-2 uppercase font-oxygen xl:w-80"
            >
              <Image
                src="/images/logos/monitdb.png"
                alt="MonitDB"
                width="475"
                height="89"
                className="w-full max-w-[140px]"
              />
            </Link>
          </h1>
        </div>

        <div className="w-full md:flex md:items-center">
          <nav>
            <ul className="flex items-center">
              {navMenuList.map(
                (item, index) =>
                  userState && (
                    <li key={`nav-item-${index}`}>
                      <Link
                        href={item.href}
                        className={classNames(buttonClasses, {
                          [buttonClassesActive]:
                            item.href.split('/')[1] ===
                            router.pathname.split('/')[1],
                          [buttonClassesIdle]:
                            item.href.split('/')[1] !==
                            router.pathname.split('/')[1],
                          // O Monit AI e o unico item que e "outra coisa":
                          // fica com a cor da marca enquanto nao esta aceso.
                          'text-blue-soft':
                            item.accent &&
                            item.href.split('/')[1] !==
                              router.pathname.split('/')[1],
                        })}
                      >
                        {item.title}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </nav>

          <div className="ml-auto pr-4 flex items-center justify-between space-x-2 lg:pr-6">
            {userState?.grants?.some(
              (grant) => grant.idFeature === Feature.CONFIGURATION
            ) && (
              <Link
                href="/configurations/"
                className="w-8 h-8 flex items-center justify-center transition-all duration-300 ease-in-out
                  lg:group-hover:opacity-75"
              >
                <i className="block w-5 h-5">
                  <FontAwesomeIcon icon={faGear} />
                </i>
              </Link>
            )}

            <div className="group relative">
              <Link
                href="/my-account/"
                className="w-8 h-8 flex items-center justify-center rounded-full border
                border-white transition-all duration-300 ease-in-out
                  lg:group-hover:opacity-75"
              >
                <FontAwesomeIcon icon={faUser} />
              </Link>
              <ul
                className="absolute top-[40px] left-1/2 w-full min-w-48 bg-white border
                border-gray-light shadow-md space-y-1 transform -translate-x-1/2
                translate-y-6 text-gray-dark text-sm py-2 opacity-0 invisible transition-all
                duration-150 ease-in-out delay-300 lg:group-hover:translate-y-2
                lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:delay-0"
              >
                <li>
                  <Link
                    href="/my-account/"
                    className="flex items-center space-x-2 py-1 px-4
                      lg:hover:text-blue"
                  >
                    <i className="block w-5 h-5">
                      <FontAwesomeIcon icon={faUserPen} />
                    </i>
                    <span>Profile settings</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/logout/"
                    className="flex items-center space-x-2 py-1 px-4
                      lg:hover:text-blue"
                  >
                    <i className="block w-5 h-5">
                      <FontAwesomeIcon
                        icon={faArrowRightFromBracket}
                        className="transform rotate-180"
                      />
                    </i>
                    <span>Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
            {/* Separador + pastilha branca: o logotipo do cliente encostava ao
                avatar e o resultado dependia do tamanho do PNG que ele manda. */}
            <span className="block w-px h-5 bg-white bg-opacity-20" />
            <div className="flex items-center h-7 px-2 bg-white rounded-full">
              <img
                src={config.logo ?? '/images/logos/monitdb.png'}
                className="max-h-5 w-auto"
                alt={config?.customerName ?? 'MonitDB'}
              />
            </div>
          </div>

          <Button type="primary" className="ml-auto inline-block md:hidden">
            Open Menu
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
