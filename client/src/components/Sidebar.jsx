import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { dummyProfileData } from '../assets/assets'
import {
  CalendarCheck2,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  CalendarMinus2,
  UserRound,
  Users,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck2, iconClass: 'text-emerald-400' },
  { to: '/leave', label: 'Leave', icon: CalendarMinus2, iconClass: 'text-rose-400' },
  { to: '/payslips', label: 'Payslips', icon: DollarSign, iconClass: 'text-sky-400' },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const Sidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const userName = `${dummyProfileData.firstName} ${dummyProfileData.lastName}`
  const userInitial = (dummyProfileData.firstName?.charAt(0) || 'U').toUpperCase()
  const roleLabel = 'employee'

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const sidebarContent = (
    <div className='flex h-full flex-col px-5 py-6'>
      <div className='flex items-center justify-between border-b border-white/10 pb-5'>
        <div className='flex items-center gap-3'>
          <UserRound className='h-5 w-5 shrink-0 text-white' />
          <div>
            <p className='text-sm font-semibold tracking-wide text-white'>Employee MS</p>
            <p className='text-xs text-slate-400'>Management System</p>
          </div>
        </div>

        <button
          type='button'
          onClick={() => setMobileOpen(false)}
          className='rounded-lg border border-white/10 p-2 text-white transition-colors hover:bg-white/10 lg:hidden'
          aria-label='Close sidebar'
        >
          <X size={18} />
        </button>
      </div>

      <div className='mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/10'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-100 ring-1 ring-indigo-400/30'>
          {userInitial}
        </div>
        <div className='min-w-0'>
          <p className='truncate text-base font-semibold text-white'>{userName}</p>
          <p className='truncate text-xs text-slate-400'>{roleLabel}</p>
        </div>
      </div>

      <div className='mt-6 mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500'>
        Navigation
      </div>

      <nav className='space-y-2'>
        {navItems.map(({ to, label, icon: Icon, iconClass }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              ].join(' ')
            }
          >
            <Icon className={`h-4 w-4 shrink-0 ${iconClass || ''}`} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className='mt-auto pt-6'>
        <button
          type='button'
          onClick={() => navigate('/login', { replace: true })}
          className='flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10'
        >
          <LogOut className='h-4 w-4' />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        type='button'
        onClick={() => setMobileOpen(true)}
        className='fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-lg backdrop-blur lg:hidden'
        aria-label='Open sidebar'
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className='fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden'
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className='hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl shadow-slate-950/20 lg:sticky lg:top-0 lg:flex'>
        {sidebarContent}
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl shadow-slate-950/30 transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
