import classNames from 'classnames'
import Breadcrumbs from 'nextjs-breadcrumbs'
import React from 'react'

import styles from './content.module.css'

const labels = {
  'my-account': 'Minha Conta',
}

const PageContent = ({ className = '', hideBreadcrumbs = false, children }) => {
  return (
    <div className={classNames('p-8 w-full xl:pl-96', className)}>
      {!hideBreadcrumbs && (
        <Breadcrumbs
          containerClassName={styles.breadcrumbs}
          useDefaultStyle={false}
          rootLabel="Home"
          transformLabel={(label) => labels[label] || label}
        />
      )}

      {children}
    </div>
  )
}

export default PageContent
