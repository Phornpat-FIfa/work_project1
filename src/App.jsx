import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import AdminShell from './components/AdminShell'
import PurchaseOrders from './pages/PurchaseOrders'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import Leads from './pages/Leads'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'

function AdminLayout() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <AdminShell />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/po" element={<PurchaseOrders />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/leads" element={<Leads />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
