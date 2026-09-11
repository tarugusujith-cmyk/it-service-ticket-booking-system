import { useAuth } from '../../hooks/useAuth'
import AdminDashboard from './AdminDashboard'
import AgentDashboard from './AgentDashboard'
import EmployeeDashboard from './EmployeeDashboard'

export default function DashboardRouter() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'admin') return <AdminDashboard />
  if (user.role === 'agent') return <AgentDashboard />
  return <EmployeeDashboard />
}
