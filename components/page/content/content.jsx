import classNames from 'classnames'
import React from 'react'

const PageContent = ({
  className = '',
  removeSidebarMargin = false,
  children,
}) => {
  return (
    <div
      className={classNames('p-8 w-full', className, {
        'xl:ml-auto xl:w-[calc(100vw-320px)]': !removeSidebarMargin,
      })}
    >
      {children}
    </div>
  )
}

export default PageContent
