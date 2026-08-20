import { Building2, CalendarCheck2, CalendarMinus2, Users } from 'lucide-react'

const cards = [
  {
    icon: Users,
    title: 'Total Employees',
    subtitle: 'Active workforce',
    value: (data) => data?.totalEmployees ?? 0,
    accent: 'text-sky-400',
    strip: 'bg-sky-300',
    iconBg: 'bg-sky-50 ring-sky-200',
  },
  {
    icon: Building2,
    title: 'Total Departments',
    subtitle: 'Organization structure',
    value: (data) => data?.totalDepartments ?? 0,
    accent: 'text-indigo-400',
    strip: 'bg-indigo-300',
    iconBg: 'bg-indigo-50 ring-indigo-200',
  },
  {
    icon: CalendarCheck2,
    title: 'Today Attendance',
    subtitle: 'Checked in today',
    value: (data) => data?.todayAttendance ?? 0,
    accent: 'text-emerald-400',
    strip: 'bg-emerald-300',
    iconBg: 'bg-emerald-50 ring-emerald-200',
  },
  {
    icon: CalendarMinus2,
    title: 'Pending Leaves',
    subtitle: 'Needs review',
    value: (data) => data?.pendingLeaves ?? 0,
    accent: 'text-rose-400',
    strip: 'bg-rose-300',
    iconBg: 'bg-rose-50 ring-rose-200',
  },
]

const AdminDashboard = ({ data }) => {
  return (
    <div className='animate-fade-in p-6 lg:p-8'>
      <div className='page-header'>
        <h1 className='page-title'>Admin Dashboard</h1>
        <p className='page-subtitle'>Overview of employees, departments, attendance, and leave requests.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
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
    </div>
  )
}

export default AdminDashboard
