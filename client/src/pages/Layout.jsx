import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from "../context/AuthContext"
import Loading from '../components/Loading'

const Layout = () => {
  const {user,loading} = useAuth()
  if(loading) return <Loading />
  if(!user) return  <Navigate to ="/login" />
  
  return (
    <div className='flex min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30'>
      <Sidebar />
      <main className='min-w-0 w-full flex-1'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout