import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

const STATUS_STYLE = {
  'กำลังดำเนินการ': { stBg: '#E8EDF5', stColor: '#0B1F3A' },
  'หยุดพัก':        { stBg: '#FFF4D6', stColor: '#8A6800' },
  'เสร็จแล้ว':      { stBg: '#DCEFE3', stColor: '#1B6B3F' },
}

function fmtBudget(n) {
  const num = Number(n)
  if (num >= 1000000) return `฿${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `฿${(num / 1000).toFixed(0)}K`
  return `฿${num.toLocaleString()}`
}

function pct(used, total) {
  if (!total) return 0
  return Math.min(100, Math.round((used / total) * 100))
}

function loadLS(key, fallback) {
  try {
    const s = localStorage.getItem(key)
    return s ? JSON.parse(s) : fallback
  } catch (_) { return fallback }
}

function isToday(ts) {
  if (!ts) return false
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

const TODAY = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' })

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [poRecords, setPoRecords] = useState([])
  const [leads, setLeads] = useState([])

  useEffect(() => {
    setProjects(loadLS('sb_projects_v1', []))
    setPoRecords(loadLS('sb_po_records_v1', []))

    function onStorage(e) {
      if (e.key === 'sb_projects_v1') setProjects(loadLS('sb_projects_v1', []))
      if (e.key === 'sb_po_records_v1') setPoRecords(loadLS('sb_po_records_v1', []))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])

  const activeCount = projects.filter(p => p.status === 'กำลังดำเนินการ').length
  const poWaiting = poRecords.filter(r => r.status === 'รออนุมัติ').length
  const poWaitingTotal = poRecords
    .filter(r => r.status === 'รออนุมัติ')
    .reduce((s, r) => s + (parseFloat((r.total || '0').replace(/,/g, '')) || 0), 0)

  const todayLeads = leads.filter(l => isToday(l.createdAt))
  const todayPending = todayLeads.filter(l => l.status === 'ยังไม่ติดต่อ').length
  const todayContacted = todayLeads.filter(l => l.status === 'ติดต่อแล้ว').length

  const recent = [...projects].sort((a, b) => b.id - a.id).slice(0, 5)

  return (
    <main style={{ padding: '32px 40px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>DASHBOARD</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>ภาพรวมระบบ</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8,
            border: '1px solid #E4E8EE', background: '#FFF',
            color: '#0B1F3A', fontSize: 13, fontWeight: 500,
            textDecoration: 'none', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#F4F5F7'}
            onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
          >
            ← กลับหน้าหลัก
          </Link>
          <div className="mono" style={{ fontSize: 13, color: '#6B7891' }}>{TODAY}</div>
        </div>
      </div>

      {/* Stat widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <Widget
          label="โครงการกำลังดำเนินการ"
          value={String(activeCount)}
          sub={`ทั้งหมด ${projects.length} โครงการ`}
        />
        <Widget
          label="โครงการเสร็จแล้ว"
          value={String(projects.filter(p => p.status === 'เสร็จแล้ว').length)}
          sub={`หยุดพัก ${projects.filter(p => p.status === 'หยุดพัก').length} โครงการ`}
        />
        <Widget
          label="PO รออนุมัติ"
          value={String(poWaiting)}
          sub={poWaiting > 0 ? `รวม ${fmtBudget(poWaitingTotal)}` : 'ไม่มีรอดำเนินการ'}
        />
        <Widget
          label="LEAD ใหม่วันนี้"
          value={String(todayLeads.length)}
          sub={`ติดต่อแล้ว ${todayContacted} · รออีก ${todayPending}`}
          dark
        />
      </div>

      {/* Recent projects */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E4E8EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>โครงการล่าสุด</h2>
            <div style={{ fontSize: 13, color: '#6B7891', marginTop: 2 }}>{recent.length} รายการ</div>
          </div>
          <Link to="/projects" style={{ fontSize: 13, color: '#0B1F3A', fontWeight: 500, textDecoration: 'none' }}>ดูทั้งหมด →</Link>
        </div>

        {recent.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#6B7891', fontSize: 14 }}>
            ยังไม่มีโครงการ <Link to="/projects" style={{ color: '#0B1F3A', fontWeight: 500 }}>เพิ่มโครงการ →</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F4F5F7' }}>
                {['โครงการ', 'ลูกค้า', 'งบ', 'ความคืบหน้า', 'สถานะ'].map(h => (
                  <th key={h} className="mono" style={{ textAlign: 'left', padding: h === 'โครงการ' ? '12px 24px' : '12px 16px', fontSize: 11, fontWeight: 500, color: '#6B7891', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: 14 }}>
              {recent.map(p => {
                const progress = pct(p.budgetUsed, p.budgetTotal)
                const { stBg, stColor } = STATUS_STYLE[p.status] || STATUS_STYLE['กำลังดำเนินการ']
                return (
                  <tr key={p.id} style={{ borderTop: '1px solid #E4E8EE' }}>
                    <td style={{ padding: '14px 24px', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '14px 16px', color: '#38465E' }}>{p.client}</td>
                    <td className="mono" style={{ padding: '14px 16px' }}>{fmtBudget(p.budgetTotal)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 100, height: 6, background: '#E4E8EE', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${progress}%`, height: '100%', background: '#0B1F3A' }} />
                        </div>
                        <span className="mono" style={{ fontSize: 12 }}>{progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', background: stBg, color: stColor, fontSize: 12, borderRadius: 999 }}>{p.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}

function Widget({ label, value, sub, dark }) {
  return (
    <div style={{ background: dark ? '#0B1F3A' : '#FFF', color: dark ? '#FFF' : '#0B1F3A', border: dark ? 'none' : '1px solid #E4E8EE', borderRadius: 12, padding: 24 }}>
      <div className="mono" style={{ fontSize: 11, color: dark ? '#8FA0BD' : '#6B7891', letterSpacing: '0.1em', marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 12, color: dark ? '#B8C4DA' : '#6B7891' }}>{sub}</div>
    </div>
  )
}
