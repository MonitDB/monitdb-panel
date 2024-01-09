import classNames from 'classnames'
import React from 'react'

const PageContent = ({
  className = '',
  removeSidebarMargin = false,
  children,
}) => {
  return (
    <div
      className={classNames('p-8 w-full lg:px-14', className, {
        'xl:ml-auto xl:w-[calc(100vw-275px)]': !removeSidebarMargin,
      })}
    >
      {children}
    </div>
  )
}

export default PageContent
