import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React from 'react'

const Select = ({ className = '', name, options, onChange }) => {
  return (
    <div className="relative h-8 border border-gray-light rounded w-full">
      <select
        name={name}
        className={classNames(
          'relative w-full bg-transparent text-sm px-2 h-8 appearance-none z-10 text-xs',
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
