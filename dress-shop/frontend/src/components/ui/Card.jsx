import React from 'react'
import clsx from 'clsx'

export default function Card({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component className={clsx('bg-white token-radius token-card transition-all duration-200', className)} {...props}>
      {children}
    </Component>
  )
}
