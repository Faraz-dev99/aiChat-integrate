import React from 'react'

const Input =({ type, value, onChange, placeholder, className })=> {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={` p-2 outline-none rounded-lg w-full ${className}`}
      />
    );
  }
  

export default Input
