import React from 'react'
import { format } from 'date-fns'

const STATUS_STYLES = {
  PRESENT: 'bg-emerald-50 text-emerald-700',
  LATE: 'bg-amber-50 text-amber-700',
  ABSENT: 'bg-rose-50 text-rose-700',
  ON_LEAVE: 'bg-indigo-50 text-indigo-700',
}

const getDayTypeDisplay = (record) => {
  switch (record.dayType) {
    case 'WEEKEND':
      return 'Weekend'
    case 'HOLIDAY':
      return 'Holiday'
    case 'HALF_DAY':
      return 'Half Day'
    default:
      return 'Full Day'
  }
}

const AttendanceHistory = ({ history }) => {
  return (
    <div className='card overflow-hidden'>
      <div className='px-6 py-4 border-b border-slate-100'>
        <h3 className='font-semibold text-slate-900'>Recent Activity</h3>
      </div>

      <div className='overflow-x-auto'>
        <table className='table-modern'>
          <thead>
            <tr>
              <th className='px-6 py-4'>Date</th>
              <th className='px-6 py-4'>Check In</th>
              <th className='px-6 py-4'>Check Out</th>
              <th className='px-6 py-4'>Working Hours</th>
              <th className='px-6 py-4'>Day Type</th>
              <th className='px-6 py-4'>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className='text-center py-12 text-slate-600'>
                  No records found
                </td>
              </tr>
            ) : (
              history.map((record) => {
                const dayType = getDayTypeDisplay(record)
                return (
                  <tr key={record._id || record.date}>
                    <td className='px-6 py-4 font-medium text-slate-900'>
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </td>
                    <td className='px-6 py-4 text-slate-600'>
                      {record.checkIn ? format(new Date(record.checkIn), 'hh:mm a') : '--'}
                    </td>
                    <td className='px-6 py-4 text-slate-600'>
                      {record.checkOut ? format(new Date(record.checkOut), 'hh:mm a') : '--'}
                    </td>
                    <td className='px-6 py-4 text-slate-600'>
                      {record.workingHours ? `${record.workingHours} Hrs` : '--'}
                    </td>
                    <td className='px-6 py-4 text-slate-600'>{dayType}</td>
                    <td className='px-6 py-4'>
                      <span
                        className={
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ' +
                          (STATUS_STYLES[record.status] || 'bg-slate-100 text-slate-600')
                        }
                      >
                        {record.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendanceHistory