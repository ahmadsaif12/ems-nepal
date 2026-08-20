import React from 'react'
import { ArrowLeftIcon, ArrowRightIcon, ShieldIcon, UserIcon } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import LoginLandingLeftSide from '../components/LoginLeftSide'

const portalOptions = [
  {
    to: '/login/admin',
    title: 'Admin Portal',
    description: 'Manage employees, departments, payroll, and system configurations.',
    icon: ShieldIcon,
  },
  {
    to: '/login/employee',
    title: 'Employee Portal',
    description: 'Access your personal information, view pay stubs, and update your profile.',
    icon: UserIcon,
  },
]

const PortalChooser = () => {
  return (
    <>
      <div className='mb-10 text-center md:text-left'>
        <h2 className='mb-3 text-3xl font-medium tracking-tight text-slate-900'>Welcome Back</h2>
        <p className='text-slate-500'>Select your portal to securely access the system.</p>
      </div>

      <div className='space-y-4'>
        {portalOptions.map((portal) => {
          const Icon = portal.icon

          return (
            <Link
              key={portal.to}
              to={portal.to}
              className='group block rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50 sm:p-6'
            >
              <div className='flex items-start gap-4'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-slate-200 transition-all duration-300 group-hover:ring-indigo-200'>
                  <Icon className='h-5 w-5 text-indigo-600' />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-4'>
                    <h3 className='font-medium text-slate-900'>{portal.title}</h3>
                    <ArrowRightIcon className='h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600' />
                  </div>
                  <p className='mt-1 text-sm leading-relaxed text-slate-500'>{portal.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className='mt-12 text-center md:text-left text-sm text-slate-400'>
        <p className='text-center text-sm text-slate-500 md:text-left'>
          © {new Date().getFullYear()} Arcodify Agency. All rights reserved.
        </p>
      </div>
    </>
  )
}

const LoginLanding = () => {
  const { pathname } = useLocation()
  const isRootLoginPage = pathname === '/login' || pathname === '/login/'

  return (
    <div className='flex min-h-screen flex-col md:flex-row'>
      <LoginLandingLeftSide />

      <div className='flex w-full flex-1 items-center justify-center overflow-y-auto bg-white p-6 sm:p-12 lg:p-16'>
        <div className='w-full max-w-md animate-fade-in'>
          {!isRootLoginPage && (
            <Link
              to='/login'
              className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600'
            >
              <ArrowLeftIcon className='h-4 w-4' />
              Back to portals
            </Link>
          )}

          {isRootLoginPage ? <PortalChooser /> : <Outlet />}
        </div>
      </div>
    </div>
  )
}

export default LoginLanding
