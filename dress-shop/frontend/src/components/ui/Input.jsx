import React from 'react'

export default function Input({ label, id, className = '', ...props }) {
  const classes = ['px-4 py-3 border border-gray-200 rounded-lg focus-visible:ring-4 focus-visible:ring-rose/10', className || '']
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id} className="text-sm font-medium text-muted mb-1">{label}</label>}
      <input id={id} className={classes.join(' ').trim()} {...props} />
    </div>
  )
}
