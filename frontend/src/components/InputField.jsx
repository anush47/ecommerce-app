import React from "react";

function InputField({
  value,
  handleInputChange,
  label,
  type,
  id,
  name,
  title,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label htmlFor={label}></label>
      <p className="input-field-title">{title}</p>
      <input
        className="input-field"
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={handleInputChange}
        required
      />
    </div>
  );
}

export default InputField;
