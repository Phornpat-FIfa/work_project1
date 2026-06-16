import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminShell from './components/AdminShell'
import PurchaseOrders from './pages/PurchaseOrders'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import History from './pages/History'
import Leads from './pages/Leads'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
        <AdminShell />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/po" element={<PurchaseOrders />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/history" element={<History />} />
          <Route path="/leads" element={<Leads />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
