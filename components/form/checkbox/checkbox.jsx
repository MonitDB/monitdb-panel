import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React from 'react'

import styles from './checkbox.module.css'

const Checkbox = ({ className, ...properties }) => {
  return (
    <div className={classNames(styles.checkbox, className)}>
      <input type="checkbox" {...properties} />
      <i>
        <FontAwesomeIcon icon={faCheck} />
      </i>
    </div>
  )
}

export default Checkbox
