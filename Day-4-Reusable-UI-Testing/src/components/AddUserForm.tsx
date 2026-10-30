import { useState, type FormEvent } from 'react'
import Button from './Button'
import Input from './Input'
import type { NewUser } from '../types/user'

interface AddUserFormProps {
  onAddUser: (user: NewUser) => void
}

interface FormValues {
  name: string
  email: string
  department: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = { name: '', email: '', department: '' }

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Enter a name.'
  if (!values.email.trim()) {
    errors.email = 'Enter an email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address, such as name@example.com.'
  }
  if (!values.department.trim()) errors.department = 'Enter a department.'
  return errors
}

function AddUserForm({ onAddUser }: AddUserFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    onAddUser({
      name: values.name.trim(),
      email: values.email.trim(),
      department: values.department.trim(),
    })
    setValues(initialValues)
  }

  return (
    <form className="add-user-form" noValidate onSubmit={handleSubmit}>
      <Input
        id="user-name"
        name="name"
        label="Full name"
        placeholder="e.g. Alex Morgan"
        autoComplete="name"
        value={values.name}
        onChange={(event) => setValues({ ...values, name: event.currentTarget.value })}
        error={errors.name}
        required
      />
      <Input
        id="user-email"
        name="email"
        type="email"
        label="Email address"
        placeholder="e.g. alex@example.com"
        autoComplete="email"
        value={values.email}
        onChange={(event) => setValues({ ...values, email: event.currentTarget.value })}
        error={errors.email}
        required
      />
      <Input
        id="user-department"
        name="department"
        label="Department"
        placeholder="e.g. Engineering"
        autoComplete="organization-title"
        value={values.department}
        onChange={(event) => setValues({ ...values, department: event.currentTarget.value })}
        error={errors.department}
        required
      />
      <Button type="submit" className="submit-button">Add user</Button>
    </form>
  )
}

export default AddUserForm
