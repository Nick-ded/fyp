import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  className = '',
  ...props 
}) => {
  const baseStyles = "rounded-xl border border-slate-700 bg-slate-800 transition-all duration-300"
  
  const variants = {
    default: "hover:border-slate-600 hover:bg-slate-700 hover:shadow-lg hover:shadow-violet-500/10",
    elevated: "border-slate-600 bg-slate-700 hover:border-slate-500 hover:shadow-lg",
    ghost: "border-transparent bg-transparent hover:bg-white/5"
  }
  
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
