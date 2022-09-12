import classNames from 'classnames'
import React from 'react'

import styles from './sidebar.module.css'

const PageSidebar = ({ className = '', children }) => {
  return (
    <aside
      className={classNames(
        `w-full bg-gray-dark text-white p-8 xl:fixed xl:top-16
          xl:left-0 xl:w-80 xl:h-[calc(100vh-64px)]`,
        className
      )}
    >
      {children}
    </aside>
  )
}

export const PageSidebarTitle = ({ className = '', children }) => {
  return (
    <h3
      className={classNames(
        'mb-4 flex items-center space-x-2 text-xl font-bold',
        className
      )}
    >
      {children}
    </h3>
  )
}

export const PageSidebarLinksList = ({ className = '', children }) => {
  return <ul className={classNames(styles.linksList, className)}>{children}</ul>
}

export default PageSidebar
