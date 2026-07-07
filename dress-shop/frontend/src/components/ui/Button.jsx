import React from 'react'
import clsx from 'clsx'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-transform duration-200 focus:outline-none focus-visible:ring-4'
  const variants = {
    primary: 'bg-rose text-white shadow-btn hover:scale-[1.01] active:scale-95',
    secondary: 'bg-white text-foreground border border-gray-200 hover:bg-gray-50',
    ghost: 'bg-transparent text-foreground hover:bg-gray-50'
  }
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className, {
        'opacity-60 cursor-not-allowed': disabled || loading,
      })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="80" strokeDashoffset="60"></circle>
        </svg>
      ) : null}
      <span className={clsx({ 'ml-2': loading })}>{children}</span>
    </button>
  )
}
