import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../components/Layout/DashboardLayout'
import Login from '../pages/Login/Login'
import DashboardRouter from '../pages/Dashboard/DashboardRouter'
import TicketsList from '../pages/Tickets/TicketsList'
import TicketDetails from '../pages/Tickets/TicketDetails'
import CreateTicket from '../pages/Tickets/CreateTicket'
import EditTicket from '../pages/Tickets/EditTicket'
import UsersPage from '../pages/Users/UsersPage'
import CategoriesPage from '../pages/Categories/CategoriesPage'
import Profile from '../pages/Profile/Profile'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/tickets" element={<TicketsList />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/profile" element={<Profile />} />

          <Route element={<ProtectedRoute allowedRoles={['employee', 'admin']} />}>
            <Route path="/tickets/new" element={<CreateTicket />} />
          </Route>

          <Route path="/tickets/:id/edit" element={<EditTicket />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
