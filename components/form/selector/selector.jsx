import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useRef, useState } from 'react'

import useOutsideClick from '~/helpers/use-click-outside'

const Selector = ({
  className = '',
  name,
  options,
  // enableSelectAllFirstItem = false,
  onChange,
}) => {
  const listReference = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])

  const handleClickOutside = () => {
    setIsOpen(false)
  }

  const reference = useOutsideClick(handleClickOutside)

  const handleChange = () => {
    const temporarySelectedOptions = []

    const inputsChecked =
      listReference.current?.querySelectorAll('input:checked')

    if (inputsChecked?.length) {
      for (const input of inputsChecked) {
        if (!input.value) {
          continue
        }

        temporarySelectedOptions.push({
          label: input.getAttribute('aria-label'),
          value: input.value,
        })
      }
    }

    setSelectedOptions(temporarySelectedOptions)
    onChange(temporarySelectedOptions.map((item) => item.value))
  }

  return (
    <div ref={reference} className={classNames('relative w-full', className)}>
      <button
        type="button"
        className="relative w-full flex items-center justify-between px-4 h-10
        bg-white leading-10 rounded outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs truncate pr-2">
          {selectedOptions.length > 0
            ? selectedOptions.map(({ label }) => label).join(', ')
            : options[0].label}
        </span>
        <FontAwesomeIcon icon={faChevronDown} className="ml-auto text-sm" />
      </button>
      <ul
        ref={listReference}
        className={classNames(
          `absolute top-full left-0 rounded bg-white w-full transform
            overflow-hidden transition-all duration-150 ease-in-out shadow-md`,
          {
            'translate-y-1 z-10': isOpen,
            'translate-y-2 opacity-0 invisible': !isOpen,
          }
        )}
      >
        {options.map(({ value, label }, index) => (
          <li key={`selector-${name}-${value}-${index}`}>
            <label
              className={classNames(
                'py-2 px-2 pl-4 flex items-center space-x-2 cursor-pointer text-xs',
                'transition-all duration-150 ease-in-out lg:hover:bg-gray-light lg:hover:bg-opacity-50'
              )}
            >
              <input
                type="checkbox"
                name={name}
                value={value}
                aria-label={label}
                onChange={handleChange}
              />
              <span>{label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Selector
