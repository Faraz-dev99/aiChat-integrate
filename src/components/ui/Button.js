import React from 'react'

const Button=({ children, onClick, disabled, className})=> {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 bg-blue-600 text-white rounded-full ${disabled ? 'opacity-50' : 'hover:bg-blue-700'} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button
