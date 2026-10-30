import type { ChangeEventHandler, InputHTMLAttributes } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'onChange'> {
  id: string
  label: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  error?: string
}

function Input({
  id,
  label,
  error,
  required = false,
  className = '',
  ...props
}: InputProps) {
  const describedBy = [props['aria-describedby'], error ? `${id}-error` : undefined]
    .filter(Boolean)
    .join(' ') || undefined

  return (
    <div className={`field ${className}`.trim()}>
      <label className="field-label" htmlFor={id}>
        {label}
        {required && <span className="required-mark" aria-hidden="true"> *</span>}
      </label>
      <input
        {...props}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="field-input"
      />
      {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  )
}

export default Input
