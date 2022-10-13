import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React from 'react'

const Select = ({
  containerClass = '',
  className = '',
  name,
  options,
  onChange = () => {},
}) => {
  return (
    <div
      className={classNames(
        'relative h-10 border border-gray rounded w-full',
        containerClass
      )}
    >
      <select
        name={name}
        className={classNames(
          'relative w-full bg-transparent px-2 h-10 appearance-none z-10 text-xs',
          className
        )}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option, index) => (
          <option key={`option-${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FontAwesomeIcon
        icon={faChevronDown}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs"
      />
    </div>
  )
}

export default Select
