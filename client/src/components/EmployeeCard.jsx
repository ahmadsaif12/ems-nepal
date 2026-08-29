import React, { useState } from 'react'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import api from '../api/axios'

const EmployeeCard = ({ employee, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(false)
  const initials = `${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`.toUpperCase()

  const handleDelete = async () => {
    const employeeId = employee.id || employee._id
    if (!employeeId) return

    const confirmed = window.confirm(
      `Delete ${employee.firstName} ${employee.lastName}? This cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      await api.delete(`/employees/${employeeId}`)
      onDelete()
    } catch (err) {
      console.error(
        'failed to delete employee:',
        err?.response?.data?.error?.message ?? err?.response?.data?.error ?? err.message
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className='group relative flex w-full min-w-[260px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'>
      {/* Hover actions */}
      <div className='absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
        <button
          type='button'
          onClick={onEdit}
          disabled={deleting}
          className='rounded-lg bg-white/95 p-2 text-slate-600 shadow ring-1 ring-slate-200 transition hover:bg-white hover:text-indigo-600 disabled:opacity-50'
          aria-label='Edit employee'
        >
          <Pencil className='h-4 w-4' />
        </button>
        <button
          type='button'
          onClick={handleDelete}
          disabled={deleting}
          className='rounded-lg bg-white/95 p-2 text-slate-600 shadow ring-1 ring-slate-200 transition hover:bg-white hover:text-rose-600 disabled:opacity-50'
          aria-label='Delete employee'
        >
          {deleting ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
        </button>
      </div>

      {/* Top banner */}
      <div className='relative flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-white px-6 py-12'>
        <span className='absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow ring-1 ring-slate-100'>
          {employee.department}
        </span>
        <div className='flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-600 ring-4 ring-white'>
          {initials}
        </div>
      </div>

      {/* Body */}
      <div className='flex flex-1 flex-col px-5 py-5'>
        <h3 className='text-base font-semibold leading-tight text-slate-900'>
          {employee.firstName} {employee.lastName}
        </h3>
        <p className='mt-0.5 text-sm text-slate-500'>{employee.position}</p>
      </div>
    </div>
  )
}

export default EmployeeCard