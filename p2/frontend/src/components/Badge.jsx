import React from 'react'

const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const baseStyles = "font-bold rounded-full inline-flex items-center justify-center"
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white",
    secondary: "bg-slate-700 text-gray-200",
    success: "bg-green-600 text-white",
    warning: "bg-amber-600 text-white",
    error: "bg-red-600 text-white"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  }
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export default Badge
