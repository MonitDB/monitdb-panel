import {
  faArrowRightFromBracket,
  faChevronDown,
  faGear,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import Grid from '~/components/grid'
import Image from '~/components/image'
import Link from '~/components/link'
import DatabasesSvg from '~/icons/databases.svg'
import UserSvg from '~/icons/user.svg'

const Header = () => {
  return (
    <header className="relative bg-blue z-40">
      <Grid className="container py-4 text-white">
        <div className="col-span-2 lg:col-span-6">
          <h1>
            <Link
              href="/dashboard/"
              className="flex items-center space-x-2 uppercase font-oxygen"
            >
              <DatabasesSvg className="block w-5 h-5" /> <span>MonitDB</span>
            </Link>
          </h1>
        </div>

        <div
          className="col-span-2 flex items-center justify-end text-sm
            lg:col-span-6"
        >
          <ul className="flex items-center space-x-6">
            <li>
              <div className="relative">
                <p className="flex items-center space-x-2">
                  <Image
                    src="/images/flags/pt.png"
                    alt="Português"
                    width="96"
                    height="96"
                    className="w-5 h-auto"
                  />
                  <span>Português</span>{' '}
                  <FontAwesomeIcon icon={faChevronDown} />
                </p>
                <select
                  name="language"
                  className="appearance-none absolute top-0 left-0 opacity-0
                    w-full h-full z-10 border-0 bg-transparent cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="pt" selected>
                    Português
                  </option>
                </select>
              </div>
            </li>
            <li className="relative group">
              <Link href="/dashboard/" className="flex items-center space-x-2">
                <UserSvg className="block w-4 h-4" />
                <span>João</span>
              </Link>

              <ul
                className="absolute top-full right-0 w-full min-w-48 bg-white border
                border-gray-light shadow-md rounded-md space-y-1 transform
                translate-y-6 text-gray-dark py-2 opacity-0 invisible transition-all
                duration-150 ease-in-out delay-150 lg:group-hover:translate-y-3
                lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:delay-0"
              >
                <li>
                  <Link
                    href="/dashboard/"
                    className="flex items-center space-x-2 py-1 px-4
                      lg:hover:text-blue"
                  >
                    <i className="block w-5 h-5">
                      <FontAwesomeIcon icon={faUserPen} />
                    </i>
                    <span>Dados pessoais</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/"
                    className="flex items-center space-x-2 py-1 px-4
                      lg:hover:text-blue"
                  >
                    <i className="block w-5 h-5">
                      <FontAwesomeIcon icon={faGear} />
                    </i>
                    <span>Preferências</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/"
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
            </li>
            <li className="relative group">
              <Link href="/dashboard/" className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
              </Link>
            </li>
          </ul>

          <button type="button" className="ml-auto inline-block md:hidden">
            abrir menu
          </button>
        </div>
      </Grid>
    </header>
  )
}

export default Header
