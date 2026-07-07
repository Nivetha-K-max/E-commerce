import React from 'react'

export default function Card({ children, className = '', as: Component = 'div', ...props }) {
  const classes = ['bg-white token-radius token-card transition-all duration-200', className || '']
  return (
    <Component className={classes.join(' ').trim()} {...props}>
      {children}
    </Component>
  )
}
