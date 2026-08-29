import React, { useState } from 'react'
import { LogIn, LogOut, Loader2 } from 'lucide-react'
import api from '../../api/axios'

const CheckingButton = ({ todayRecord, onAction }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAttendance = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post("/attendance")
      onAction()
    } catch (err) {
      console.error("Failed to record attendance:", err)
      setError(err?.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut

  return (
    <div className='fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50'>
      {error && (
        <div className='max-w-xs rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 shadow-lg'>
          {error}
        </div>
      )}

      <button
        type='button'
        onClick={handleAttendance}
        disabled={loading}
        className={
          'flex flex-col items-center gap-2 rounded-xl px-5 py-4 shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70 ' +
          (isCheckedIn
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : 'bg-indigo-600 text-white hover:bg-indigo-700')
        }
      >
        {loading ? (
          <Loader2 className='size-7 animate-spin' />
        ) : isCheckedIn ? (
          <LogOut className='size-7' />
        ) : (
          <LogIn className='size-7' />
        )}

        <div className='text-center'>
          <h2 className='text-sm font-semibold leading-tight'>
            {loading ? 'Processing...' : isCheckedIn ? 'Clock Out' : 'Clock In'}
          </h2>
          <p className='text-xs opacity-80'>
            {loading
              ? 'Please wait'
              : isCheckedIn
              ? 'Click to end your shift'
              : 'Start your work day'}
          </p>
        </div>
      </button>
    </div>
  )
}

export default CheckingButton