import React, { useState } from "react";
import { Input, Label } from "reactstrap";

const ImageButton = (props) => {
  const { children, onChange, id, name, className, htmlFor, onClick } = props;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target.result;
        onChange(fileUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Label htmlFor={htmlFor} className={`${className}`}>
        {children}
      <Input
        id={id}
        name={name}
        type="file"
        onChange={(e) => {
          handleFileChange(e);
        }}
        onClick={onClick}
        hidden
      />
    </Label>
  );
};

export default ImageButton;
