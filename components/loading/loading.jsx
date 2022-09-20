import classNames from 'classnames'
import React from 'react'

import styles from './loading.module.css'

const Loading = ({ className = '', dark = false }) => {
  return (
    <div
      className={classNames(styles.loading, className, {
        [styles.loadingDark]: dark,
      })}
    ></div>
  )
}

export default Loading
