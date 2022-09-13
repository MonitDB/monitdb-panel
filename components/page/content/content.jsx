import classNames from 'classnames'
import React from 'react'

const PageContent = ({ className = '', children }) => {
  return (
    <div
      className={classNames(
        'p-8 w-full xl:ml-auto xl:w-[calc(100vw-320px)]',
        className
      )}
    >
      {children}
    </div>
  )
}

export default PageContent
