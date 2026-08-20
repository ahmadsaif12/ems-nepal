import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const LoginForm = ({ role, title, subtitle }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
      <div className='mb-8'>
        <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600'>
          {role}
        </p>
        <h1 className='text-3xl font-medium tracking-tight text-slate-900'>{title}</h1>
        <p className='mt-2 text-sm leading-relaxed text-slate-500'>{subtitle}</p>
      </div>

      {error && (
        <div className='mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
          {error}
        </div>
      )}

      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label className='mb-2 block text-sm font-medium text-slate-700' htmlFor='email'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            placeholder='you@example.com'
            autoComplete='email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-slate-700' htmlFor='password'>
            Password
          </label>
          <div className='relative'>
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              autoComplete='current-password'
              value={formData.password}
              onChange={handleChange}
              className='pr-20'
            />
            <button
              type='button'
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute inset-y-0 right-3 flex items-center text-indigo-600 transition-colors hover:text-indigo-700'
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>
        </div>

        <button type='submit' className='btn-primary w-full' disabled={loading}>
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
