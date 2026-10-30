import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('user management', () => {
  it('shows required-field validation messages', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add user' }))

    expect(screen.getByText('Enter a name.')).toBeInTheDocument()
    expect(screen.getByText('Enter an email address.')).toBeInTheDocument()
    expect(screen.getByText('Enter a department.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Full name' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows a validation message for an invalid email address', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('textbox', { name: 'Full name' }), 'Jamie Rivera')
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'not-an-email')
    await user.type(screen.getByRole('textbox', { name: 'Department' }), 'Support')
    await user.click(screen.getByRole('button', { name: 'Add user' }))

    expect(screen.getByText('Enter a valid email address, such as name@example.com.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('adds a valid user to the directory and resets the form', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('textbox', { name: 'Full name' }), 'Jamie Rivera')
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'jamie@example.com')
    await user.type(screen.getByRole('textbox', { name: 'Department' }), 'Support')
    await user.click(screen.getByRole('button', { name: 'Add user' }))

    const row = screen.getByRole('row', { name: /Jamie Rivera jamie@example\.com Support/ })
    expect(row).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Full name' })).toHaveValue('')
    expect(screen.getByText('5', { selector: '.count-badge' })).toBeInTheDocument()
  })

  it('filters users by name', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('searchbox', { name: 'Search users' }), 'sofia')

    const table = screen.getByRole('table', { name: 'User directory' })
    expect(within(table).getByText('Sofia Chen')).toBeInTheDocument()
    expect(within(table).queryByText('Ava Patel')).not.toBeInTheDocument()
  })

  it('filters users by email', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('searchbox', { name: 'Search users' }), 'marcus.green@')

    const table = screen.getByRole('table', { name: 'User directory' })
    expect(within(table).getByText('Marcus Green')).toBeInTheDocument()
    expect(within(table).queryByText('Ava Patel')).not.toBeInTheDocument()
  })

  it('shows an accessible empty state when no users match', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('searchbox', { name: 'Search users' }), 'nobody-matches')

    expect(screen.getByRole('status')).toHaveTextContent('No users match your search.')
    expect(screen.getByText('No users match your search.', { selector: '.empty-cell' })).toBeInTheDocument()
  })
})
