import cn from 'classnames'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Link from '~/components/link'
import DatabasesSvg from '~/icons/databases.svg'

const buttonClasses =
  'block h-16 leading-[64px] px-5 border-b-4 text-white lg:hover:text-opacity-100'
const buttonClassesActive = 'border-blue text-opacity-100'

const navMenuList = [
  {
    title: 'Dashboard',
    href: '/dashboard/',
  },
  {
    title: 'Alertas',
    href: '/alerts/',
  },
  {
    title: 'Análise',
    href: '/analysis/',
  },
  {
    title: 'Relatórios',
    href: '/reports/',
  },
  {
    title: 'Propriedade',
    href: '/estate/',
  },
  {
    title: 'Configurações',
    href: '/configurations/',
  },
]

const Header = () => {
  const router = useRouter()

  return (
    <header className="w-full h-16 z-40">
      <div className="fixed bg-gray-dark w-full flex items-center justify-start text-white">
        <div className="w-full md:w-auto">
          <h1>
            <Link
              href="/dashboard/"
              className="flex items-center justify-center h-16 px-8 space-x-2 uppercase font-oxygen bg-blue"
            >
              <DatabasesSvg className="block w-5 h-5" /> <span>MonitDB</span>
            </Link>
          </h1>
        </div>

        <div>
          <nav>
            <ul className="flex items-center">
              {navMenuList.map((item, index) => (
                <li key={`nav-item-${index}`}>
                  <Link
                    href={item.href}
                    className={cn(buttonClasses, {
                      [buttonClassesActive]:
                        item.href.search(router.asPath) >= 0,
                      'border-gray-dark text-opacity-50':
                        item.href.search(router.asPath) < 0,
                    })}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button type="button" className="ml-auto inline-block md:hidden">
            abrir menu
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
