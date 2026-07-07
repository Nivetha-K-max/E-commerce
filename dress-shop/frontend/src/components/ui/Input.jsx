import React from 'react'
import clsx from 'clsx'

export default function Input({ label, id, className = '', ...props }) {
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id} className="text-sm font-medium text-muted mb-1">{label}</label>}
      <input
        id={id}
        className={clsx('px-4 py-3 border border-gray-200 rounded-lg focus-visible:ring-4 focus-visible:ring-rose/10', className)}
        {...props}
      />
    </div>
  )
}
