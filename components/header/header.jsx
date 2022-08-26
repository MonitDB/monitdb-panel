import cn from 'classnames'
import React, { useState } from 'react'

import Link from '~/components/link'
import DatabasesSvg from '~/icons/databases.svg'

const buttonClasses =
  'block h-16 leading-[64px] px-5 border-b-4 text-white lg:hover:text-opacity-100'
const buttonClassesActive = 'border-blue text-opacity-100'

const navMenuList = [
  {
    title: 'Dashboard',
    href: '',
  },
  {
    title: 'Súmulas',
    href: '',
  },
  {
    title: 'Alertas',
    href: '',
  },
  {
    title: 'Análise',
    href: '',
  },
  {
    title: 'Relatórios',
    href: '',
  },
  {
    title: 'Propriedade',
    href: '',
  },
  {
    title: 'Configurações',
    href: '',
  },
]

const Header = () => {
  const [activeIndex, setActiveIndex] = useState(0)

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
                      [buttonClassesActive]: activeIndex === index,
                      'border-gray-dark text-opacity-50': activeIndex !== index,
                    })}
                    onClick={() => setActiveIndex(index)}
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
