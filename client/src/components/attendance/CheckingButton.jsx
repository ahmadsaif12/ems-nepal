import React, { useState } from 'react'
import { LogIn, LogOut, Loader2 } from 'lucide-react'

const CheckingButton = ({ todayRecord, onAction }) => {
  const [loading, setLoading] = useState(false)

  const handleAttendance = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onAction()
    }, 1000)
  }

  if (todayRecord?.checkOut) {
    return (
      <div className='flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200'>
        <h3 className='text-lg font-bold text-slate-900'>Work Day Completed</h3>
        <p className='text-slate-500 text-sm mt-1'>Great job! See you tomorrow</p>
      </div>
    )
  }

  const isCheckedIn = !!todayRecord?.isCheckedIn

  return (
    <div className='fixed bottom-6 right-6 flex flex-col z-50'>
      <button
        type='button'
        onClick={handleAttendance}
        disabled={loading}
        className={
          'flex flex-col items-center gap-2 rounded-xl px-5 py-4 shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70 ' +
          (isCheckedIn
            ? 'bg-rose-600 text-white hover:bg-rose-700'
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