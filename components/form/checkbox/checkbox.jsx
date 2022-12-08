import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useEffect, useRef } from 'react'

import styles from './checkbox.module.css'

const Checkbox = ({ className, defaultValue, onChange, ...properties }) => {
  const elementReference = useRef()

  const handleChange = useCallback(
    (event) => {
      const checked = event.target.checked

      onChange(checked)
    },
    [onChange]
  )

  useEffect(() => {
    if (defaultValue) {
      elementReference.current.checked = defaultValue
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={classNames(styles.checkbox, className)}>
      <input
        ref={elementReference}
        type="checkbox"
        onChange={handleChange}
        {...properties}
      />
      <i>
        <FontAwesomeIcon icon={faCheck} />
      </i>
    </div>
  )
}

export default Checkbox
