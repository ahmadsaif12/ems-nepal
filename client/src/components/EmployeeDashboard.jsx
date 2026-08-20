import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck2, CalendarPlus2, DollarSign, FileText } from 'lucide-react'

const cards = [
  {
    icon: CalendarCheck2,
    title: 'Days Present',
    subtitle: 'This Month',
    value: (data) => data?.currentMonthAttendance ?? 0,
    accent: 'text-emerald-400',
    strip: 'bg-emerald-300',
    iconBg: 'bg-emerald-50 ring-emerald-200',
  },
  {
    icon: FileText,
    title: 'Pending Leaves',
    subtitle: 'Awaiting approval',
    value: (data) => data?.pendingLeaves ?? 0,
    accent: 'text-rose-400',
    strip: 'bg-rose-300',
    iconBg: 'bg-rose-50 ring-rose-200',
  },
  {
    icon: DollarSign,
    title: 'Latest Payslip',
    subtitle: 'Most recent salary slip',
    value: (data) => (data?.latestPayslip?.netSalary ? `$${data.latestPayslip.netSalary.toLocaleString()}` : 'N/A'),
    accent: 'text-sky-400',
    strip: 'bg-sky-300',
    iconBg: 'bg-sky-50 ring-sky-200',
  },
]

const actions = [
  {
    to: '/attendance',
    title: 'Mark Attendance',
    icon: CalendarCheck2,
    trailingIcon: ArrowRight,
    className: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700',
  },
  {
    to: '/leave',
    title: 'Apply for Leave',
    icon: CalendarPlus2,
    className: 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
  },
]

const EmployeeDashboard = ({ data }) => {
  const employee = data?.employee ?? {}

  return (
    <div className='animate-fade-in p-6 lg:p-8'>
      <div className='page-header'>
        <h1 className='page-title'>Welcome, {employee.firstName || 'Employee'}!</h1>
        <p className='page-subtitle'>
          {employee.position || 'Employee'} - {employee.department || 'No Department'}
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {cards.map(({ icon: Icon, title, subtitle, value, accent, strip, iconBg }) => (
          <div key={title} className='card card-hover relative overflow-hidden p-5 shadow-sm'>
            <div className={`absolute left-0 top-0 h-full w-1.5 ${strip}`} />
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0 pl-2'>
                <p className='text-sm font-medium text-slate-700'>{title}</p>
                <h2 className='mt-2 text-2xl font-semibold text-slate-900'>{value(data)}</h2>
                <p className='mt-1 text-sm text-slate-500'>{subtitle}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${iconBg}`}>
                <Icon className={`h-5 w-5 ${accent}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 w-fit'>
        <div className='rounded-2xl p-3'>
          <div className='grid gap-3 sm:grid-cols-2'>
            {actions.map(({ to, title, icon: Icon, trailingIcon: TrailingIcon, className }) => (
              <Link
                key={title}
                to={to}
                className={`inline-flex h-11 items-center justify-between gap-3 rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${className}`}
              >
                <span className='inline-flex items-center gap-2'>
                  <Icon className='h-4 w-4' />
                  {title}
                </span>
                {TrailingIcon ? <TrailingIcon className='h-4 w-4 shrink-0' /> : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
