import { Select } from 'antd'
import React from 'react'

const { Option } = Select

const Selector = ({
  className = '',
  //  name,
  options,
  value = [],
  onChange,
}) => {
  return (
    <Select
      mode="multiple"
      className={className}
      value={value}
      onChange={onChange}
      maxTagCount={'responsive'}
      placeholder={options.length > 0 ? options[0].label : 'Select options'}
      style={{ width: '100%' }}
    >
      {options.map(({ value: optionValue, label }) => (
        <Option key={optionValue} value={optionValue}>
          {label}
        </Option>
      ))}
    </Select>
  )
}

export default Selector
