import React, { useEffect, useState } from 'react'
import { X, User, Briefcase, ShieldCheck, Loader2 } from 'lucide-react'
import { DEPARTMENTS } from '../assets/assets'
import api from "../api/axios";

const EMPLOYMENT_STATUSES = ['ACTIVE', 'INACTIVE', 'PROBATION', 'ON_LEAVE', 'TERMINATED']

const STATUS_STYLES = {
  ACTIVE: 'bg-slate-100 text-slate-800 border-slate-200',
  INACTIVE: 'bg-slate-50 text-slate-800 border-slate-200',
  PROBATION: 'bg-slate-100 text-slate-800 border-slate-200',
  ON_LEAVE: 'bg-slate-100 text-slate-800 border-slate-200',
  TERMINATED: 'bg-slate-100 text-slate-800 border-slate-200',
}

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: DEPARTMENTS[0] || '',
  position: '',
  basicSalary: 0,
  allowances: 0,
  deductions: 0,
  employmentStatus: 'ACTIVE',
  role: 'EMPLOYEE',
  password: '',
  joinDate: '',
  bio: '',
}

const fieldClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 ' +
  'shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100'

const labelClass = 'mb-1 block text-xs font-medium text-slate-500'

const EmployeeForm = ({ employee, onClose, onSave }) => {
  const isEdit = Boolean(employee)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || DEPARTMENTS[0] || '',
        position: employee.position || '',
        basicSalary: employee.basicSalary ?? 0,
        allowances: employee.allowances ?? 0,
        deductions: employee.deductions ?? 0,
        employmentStatus: employee.employmentStatus || 'ACTIVE',
        role: employee.user?.role || employee.userId?.role || 'EMPLOYEE',
        password: '',
        joinDate: employee.joinDate ? employee.joinDate.slice(0, 10) : '',
        bio: employee.bio || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [employee])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { password, ...rest } = form
    const payload = {
      ...rest,
      ...(password ? { password } : {}),
      basicSalary: Number(form.basicSalary) || 0,
      allowances: Number(form.allowances) || 0,
      deductions: Number(form.deductions) || 0,
      joinDate: form.joinDate ? new Date(form.joinDate).toISOString() : '',
    }

    try {
      const employeeId = employee?.id || employee?._id
      const url = isEdit ? `/employees/${employeeId}` : '/employees'
      const method = isEdit ? 'put' : 'post'

      const res = await api[method](url, payload)
      onSave(res.data)
    } catch (err) {
      setError(err?.response?.data?.error?.message || err?.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm'>
      <div className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-8 py-5 backdrop-blur'>
          <div>
            <h2 className='text-xl font-semibold text-slate-800'>
              {isEdit ? 'Edit Employee' : 'Add Employee'}
            </h2>
            <p className='mt-0.5 text-xs text-slate-400'>
              {isEdit ? 'Update the details below and save your changes.' : 'Fill in the details to onboard a new employee.'}
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8 px-8 py-6'>
          {error && (
            <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700'>
              {error}
            </div>
          )}

          <section className='space-y-4'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4 text-slate-500' />
              <h3 className='text-sm font-semibold uppercase tracking-wide text-slate-700'>
                Personal Information
              </h3>
            </div>
            <div className='rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <label className='block'>
                  <span className={labelClass}>First name</span>
                  <input
                    name='firstName'
                    placeholder='First name'
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </label>
                <label className='block'>
                  <span className={labelClass}>Last name</span>
                  <input
                    name='lastName'
                    placeholder='Last name'
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </label>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <label className='block'>
                  <span className={labelClass}>Phone</span>
                  <input
                    name='phone'
                    placeholder='Phone'
                    value={form.phone}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>
                <label className='block'>
                  <span className={labelClass}>Join date</span>
                  <input
                    name='joinDate'
                    type='date'
                    value={form.joinDate}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>
              </div>

              <label className='block'>
                <span className={labelClass}>Bio</span>
                <textarea
                  name='bio'
                  placeholder='A short bio about this employee'
                  rows={3}
                  value={form.bio}
                  onChange={handleChange}
                  className={fieldClass + ' resize-none'}
                />
              </label>
            </div>
          </section>

          <section className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Briefcase className='h-4 w-4 text-slate-500' />
              <h3 className='text-sm font-semibold uppercase tracking-wide text-slate-700'>
                Employment Details
              </h3>
            </div>
            <div className='rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <label className='block'>
                  <span className={labelClass}>Department</span>
                  <select
                    name='department'
                    value={form.department}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </label>
                <label className='block'>
                  <span className={labelClass}>Position</span>
                  <input
                    name='position'
                    placeholder='Position'
                    value={form.position}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <label className='block'>
                  <span className={labelClass}>Basic salary</span>
                  <input
                    name='basicSalary'
                    type='number'
                    min='0'
                    value={form.basicSalary}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>
                <label className='block'>
                  <span className={labelClass}>Allowances</span>
                  <input
                    name='allowances'
                    type='number'
                    min='0'
                    value={form.allowances}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>
                <label className='block'>
                  <span className={labelClass}>Deductions</span>
                  <input
                    name='deductions'
                    type='number'
                    min='0'
                    value={form.deductions}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>
              </div>

              <label className='block'>
                <span className={labelClass}>Status</span>
                <select
                  name='employmentStatus'
                  value={form.employmentStatus}
                  onChange={handleChange}
                  className={
                    'w-36 rounded-lg border px-3 py-2 text-xs font-semibold shadow-sm transition ' +
                    'focus:outline-none focus:ring-2 focus:ring-slate-100 ' +
                    (STATUS_STYLES[form.employmentStatus] || STATUS_STYLES.ACTIVE)
                  }
                >
                  {EMPLOYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className='space-y-4'>
            <div className='flex items-center gap-2'>
              <ShieldCheck className='h-4 w-4 text-slate-500' />
              <h3 className='text-sm font-semibold uppercase tracking-wide text-slate-700'>
                Account Setup
              </h3>
            </div>
            <div className='rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <label className='block'>
                  <span className={labelClass}>Work email</span>
                  <input
                    name='email'
                    type='email'
                    placeholder='work@example.com'
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </label>
                <label className='block'>
                  <span className={labelClass}>
                    {isEdit ? 'Change password' : 'Password'}
                  </span>
                  <input
                    name='password'
                    type='password'
                    placeholder={isEdit ? 'Leave blank to keep current' : '••••••••'}
                    value={form.password}
                    onChange={handleChange}
                    required={!isEdit}
                    className={fieldClass}
                  />
                </label>
              </div>

              <label className='block max-w-xs'>
                <span className={labelClass}>System role</span>
                <select
                  name='role'
                  value={form.role}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  <option value='EMPLOYEE'>Employee</option>
                  <option value='ADMIN'>Admin</option>
                </select>
              </label>
            </div>
          </section>

          <div className='flex justify-end gap-3 border-t border-slate-200 pt-5'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='btn-primary flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold shadow-sm transition disabled:opacity-60'
            >
              {loading && <Loader2 className='h-4 w-4 animate-spin' />}
              {isEdit ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeForm