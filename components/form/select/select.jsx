import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const CustomSelect = ({ name, options, onChange, ...properties }) => {
  return (
    <Select
      showSearch
      optionFilterProp="label"
      name={name}
      onChange={onChange}
      style={{ width: '100%' }}
      {...properties}
    >
      {options.map((option, index) => (
        <Select.Option
          key={`option-${option.value}-${index}`}
          value={option.value}
        >
          {option.label}
        </Select.Option>
      ))}
    </Select>
  )
}

CustomSelect.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default CustomSelect
