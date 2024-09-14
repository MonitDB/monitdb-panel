import classNames from 'classnames'
import React, { Fragment } from 'react'

import Link from '~/components/link'

const PageHeader = ({ title, breadcrumbs = [], extra = [] }) => {
  return (
    <header className="mb-10 text-black">
      <div className="flex items-center justify-between">
        {title && <h1 className="heading-lg mb-2">{title}</h1>}
        <div>{extra}</div>
      </div>
      {breadcrumbs.length > 0 ? (
        <ul className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => {
            return (
              <Fragment key={`breadcrumb-item-${index}`}>
                <li>
                  <Link
                    href={breadcrumb.href}
                    className={classNames({
                      'text-gray lg:hover:text-black':
                        index !== breadcrumbs.length - 1,
                    })}
                  >
                    {breadcrumb.title}
                  </Link>
                </li>
                {index !== breadcrumbs.length - 1 && (
                  <li className="text-gray">/</li>
                )}
              </Fragment>
            )
          })}
        </ul>
      ) : (
        ''
      )}
    </header>
  )
}

export default PageHeader
