import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30'>
     <p>Sidebar</p>
     <Outlet />
    </div>
  )
}

export default Layout
