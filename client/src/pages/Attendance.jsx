import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import CheckingButton from '../components/attendance/CheckingButton'
import AttendanceStats from '../components/attendance/AttendanceStats'
import AttendanceHistory from '../components/attendance/AttendanceHistory'
import api from '../api/axios'

const Attendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get("/attendance");
      const json = res.data;
      setHistory(json.data || [])
      if (json.employee?.isDeleted) setIsDeleted(true)
    } catch (err) {
      console.error("Failed to fetch attendance:", err)
      setError(err?.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <Loading />

  const toDateKey = (d) =>
    new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Kathmandu' })
  const todayKey = toDateKey(new Date())
  const todayRecord = history.find((r) => toDateKey(r.date) === todayKey)

  return (
    <div className='animate-fade-in'>
      <div className='page-header mt-6 ml-6'>
        <h1 className='page-title'>Attendance</h1>
        <p className='page-subtitle mt-1'>Track your work hours and daily check-ins</p>
      </div>

      {error && (
        <div className='mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'>
          {error}
        </div>
      )}

      {isDeleted ? (
        <div className='mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center'>
          <p className='text-rose-600'>
            You can no longer clock in or out because your employee records have been marked as deleted
          </p>
        </div>
      ) : (
        <div className='mb-8'>
          <CheckingButton todayRecord={todayRecord} onAction={fetchData} />
        </div>
      )}
      <AttendanceStats history={history} />
      <AttendanceHistory history={history} />
    </div>
  )
}

export default Attendance