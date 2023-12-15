import React from 'react'
import Select from 'react-select'
import { Label } from 'reactstrap'
import { selectThemeColors } from '../Utils'

const InSelect = ( props ) => {
  const { id, name, label, ...rest } = props
  return (
    <div className="mt-1">
      {label ? <Label
        className="text-dark"
        style={{ fontWeight: "bold" }}
        htmlFor={id}
      >
        {label}
      </Label> : ""}
      <Select
        {...rest}
        id={id}
        name={name}
        isSearchable
        isClearable
        classNamePrefix='dropdown'
        theme={selectThemeColors}
      // classNamePrefix="dropdown"
      />
    </div>
  )
}

export default InSelect
