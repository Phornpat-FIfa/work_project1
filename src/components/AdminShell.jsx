import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', to: '/dashboard' },
  { key: 'projects', label: 'โครงการ', to: '/projects' },
  { key: 'po', label: 'ใบสั่งซื้อ', to: '/po' },
  { key: 'expenses', label: 'เบิกจ่าย', to: '/expenses' },
  { key: 'reports', label: 'รายงานสรุป', to: '/reports' },
  { key: 'leads', label: 'Lead ลูกค้า', to: '/leads' },
]

export default function AdminShell() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u))
    return () => unsub()
  }, [])

  const emailUser = user?.email ? user.email.split('@')[0] : 'admin'
  const displayName = `${emailUser}@admin`
  const avatar = emailUser[0].toUpperCase()

  return (
    <aside style={{
      background: '#0B1F3A',
      color: '#FFF',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: "'IBM Plex Sans Thai', system-ui, sans-serif",
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 8px 24px', borderBottom: '1px solid #1F3358', marginBottom: 16,
      }}>
        <div style={{
          width: 28, height: 28, background: '#FFF', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#0B1F3A', fontWeight: 700, fontSize: 12,
        }}>SB</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>SOLID BUILD</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.key}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              background: isActive ? '#1F3358' : 'transparent',
              color: isActive ? '#FFF' : '#B8C4DA',
              borderRadius: 6, fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              textDecoration: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{
                  width: 4, height: 16, borderRadius: 2, flexShrink: 0,
                  background: isActive ? '#E0A800' : 'transparent',
                }} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: 12, background: '#1F3358', borderRadius: 8, fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, background: '#E0A800', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0B1F3A', fontWeight: 600, fontSize: 12,
          }}>{avatar}</div>
          <div>
            <div style={{ fontWeight: 500 }}>{displayName}</div>
            <div style={{ color: '#8FA0BD', fontSize: 11 }}>Single role</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
