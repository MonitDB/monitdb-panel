import {
  faArrowRightFromBracket,
  faGear,
  faUser,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { permission } from 'const/permissions'
import { useRouter } from 'next/router'
import React from 'react'

import Image from '~/components/image'
import Link from '~/components/link'
import { useUser } from '~/hooks/index'
// import DatabasesSvg from '~/icons/databases.svg'

const buttonClasses =
  'block h-16 leading-[64px] px-5 border-b-4 text-white lg:hover:text-opacity-100'
const buttonClassesActive = 'border-blue text-opacity-100'

const Header = () => {
  const router = useRouter()

  const { hasPermissions, userState } = useUser()

  const navMenuList = [
    {
      title: 'Dashboard',
      href: '/dashboard/',
      requiredPermissions: [permission.DASHBOARD_PAGE],
    },
    {
      title: 'Alerts',
      href: '/alerts/',
      requiredPermissions: [permission?.ALERT_PAGE],
    },
    {
      title: 'Analysis',
      href: '/analysis/',
      requiredPermissions: [permission?.ANALISYS_PAGE],
    },
    {
      title: 'Reports',
      href: '/reports/',
      requiredPermissions: [permission.REPORT_PAGE],
    },
    {
      title: 'States',
      href: '/states/',
      requiredPermissions: [permission.STATES_PAGE],
    },
    {
      title: 'Configurations',
      href: '/configurations/',
      requiredPermissions: [permission.CONFIGURATION_PAGE],
    },
  ]

  for (const item of navMenuList) {
    if (
      router.pathname.search(item.href.replace(/\/$/, '')) >= 0 &&
      !hasPermissions(item.requiredPermissions) &&
      item.href !== '/dashboard/'
    )
      router.push('/403/')
  }

  return (
    <header className="relative w-full h-16 z-40">
      <div className="fixed bg-gray-dark w-full flex items-center justify-start text-white">
        <div className="w-full md:w-auto">
          <h1>
            <Link
              href="/dashboard/"
              className="flex items-center justify-center h-16 px-8 space-x-2 uppercase font-oxygen xl:w-80"
            >
              {/* <DatabasesSvg className="block w-5 h-5" /> <span>MonitDB</span> */}
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
                  userState &&
                  hasPermissions(item.requiredPermissions) && (
                    <li key={`nav-item-${index}`}>
                      <Link
                        href={item.href}
                        className={classNames(buttonClasses, {
                          [buttonClassesActive]:
                            router.pathname.search(
                              item.href.replace(/\/$/, '')
                            ) >= 0,
                          'border-gray-dark text-opacity-50':
                            router.pathname.search(
                              item.href.replace(/\/$/, '')
                            ) < 0,
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
                    href="/my-account/"
                    className="flex items-center space-x-2 py-1 px-4
                      lg:hover:text-blue"
                  >
                    <i className="block w-5 h-5">
                      <FontAwesomeIcon icon={faGear} />
                    </i>
                    <span>Account Settings</span>
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

            <div className="px-1 bg-white rounded-lg">
              <Image
                src="/images/logos/advance-care.png"
                width="758"
                height="259"
                alt=""
                className="w-full max-w-[100px] h-auto mx-auto"
              />
            </div>
          </div>

          <button type="button" className="ml-auto inline-block md:hidden">
            Open Menu
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
