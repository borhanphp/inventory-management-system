import React from "react";
import { Input, Label } from "reactstrap";

const InInput = ( props ) => {
  const { name, placeholder, value, onChange, id, label, type, ...rest } = props;
  return (
    <>
      <div className="mt-1">
        {label ? (
          <Label style={{ fontWeight: "bold" }} htmlFor={id}>
            {label}
          </Label>
        ) : (
          ""
        )}

        <Input
          name={name}
          id={id}
          bsSize="sm"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
    </>
  );
};

export default InInput;
