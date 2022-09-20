import classNames from 'classnames'
import React from 'react'

import styles from './loading.module.css'

const Loading = ({ className = '', light = false }) => {
  return (
    <div
      className={classNames(styles.loading, className, {
        [styles.loadingLight]: light,
      })}
    ></div>
  )
}

export default Loading
