import {
  faBell,
  faChevronDown,
  faFileLines,
  faGauge,
  faGear,
  faMagnifyingGlassChart,
  faPager,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

import Link from '~/components/link'
import Reveal from '~/helpers/reveal'

const buttonClasses = `py-2 px-4 rounded-md flex items-center w-full text-sm
  justify-start appearance-none font-normal lg:hover:bg-blue-light lg:hover:text-white`
const subButtonClasses = `block py-2 pl-[52px] pr-4 w-full rounded-md text-sm
  lg:hover:bg-blue-light lg:hover:text-white`

const Sidebar = ({ className = '' }) => {
  const [isExpandedIndex, setIsExpandedIndex] = useState(-1)

  const toggleIsExpandedIndex = (index) => {
    setIsExpandedIndex(isExpandedIndex === index ? -1 : index)
  }

  return (
    <div
      className={`bg-white w-full p-4 font-oxygen scrollbar-thin scrollbar-thumb-gray-light
        overflow-y-scroll md:w-60 md:h-[calc(100vh-56px)] ${className}`}
    >
      <nav>
        <ul className="space-y-2 text-gray-dark">
          <li>
            <Link
              href="/dashboard/"
              className={[buttonClasses, 'text-blue'].join(' ')}
            >
              <i className="w-5 h-5 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faGauge} />
              </i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/" className={[buttonClasses].join(' ')}>
              <i className="w-5 h-5 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faTableColumns} />
              </i>
              <span>Súmulas</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/" className={[buttonClasses].join(' ')}>
              <i className="w-5 h-5 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faBell} />
              </i>
              <span>Alertas</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/" className={[buttonClasses].join(' ')}>
              <i className="w-5 h-5 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
              </i>
              <span>Análise</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/" className={[buttonClasses].join(' ')}>
              <i className="w-5 h-5 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faFileLines} />
              </i>
              <span>Relatórios</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className={[buttonClasses].join(' ')}
              onClick={() => toggleIsExpandedIndex(5)}
            >
              <i className="w-5 h-5 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faPager} />
              </i>
              <span>Propriedade</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={[
                  `block ml-auto transform transition-all duration-300 ease-in-out`,
                  isExpandedIndex === 5 && 'rotate-180',
                ].join(' ')}
              />
            </button>

            <Reveal active={isExpandedIndex === 5}>
              <ul className="pt-2 space-y-1">
                <li>
                  <Link
                    href="/dashboard/"
                    className={[subButtonClasses].join(' ')}
                  >
                    <span>Versões instaladas</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/"
                    className={[subButtonClasses].join(' ')}
                  >
                    <span>Uso de disco</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/"
                    className={[subButtonClasses].join(' ')}
                  >
                    <span>Backups</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/"
                    className={[subButtonClasses].join(' ')}
                  >
                    <span>SQL Agente Jobs</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/"
                    className={[subButtonClasses].join(' ')}
                  >
                    <span>Licenciamento de servidores SQL</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/"
                    className={[subButtonClasses].join(' ')}
                  >
                    <span>Configuração de propriedades</span>
                  </Link>
                </li>
              </ul>
            </Reveal>
          </li>
          <li>
            <Link href="/dashboard/" className={[buttonClasses].join(' ')}>
              <i className="w-5 h-5 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faGear} />
              </i>
              <span>Configurações</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
