import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function isToday(ts) {
  if (!ts) return false
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

function isThisWeek(ts) {
  if (!ts) return false
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return d >= startOfWeek
}

function DetailModal({ lead, onClose, onMarkContacted }) {
  if (!lead) return null
  const isPending = lead.status === 'ยังไม่ติดต่อ'
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(11,31,58,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFF', borderRadius: 16, padding: 40, maxWidth: 560, width: '100%',
          boxShadow: '0 24px 64px rgba(11,31,58,0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: '#6B7891', letterSpacing: '0.15em', marginBottom: 4 }}>LEAD DETAIL</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#0B1F3A' }}>{lead.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6B7891', padding: 4 }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'เบอร์โทร', value: lead.phone },
            { label: 'วันที่ส่ง', value: formatDate(lead.createdAt) },
            { label: 'ประเภทงาน', value: lead.workType || '—' },
            { label: 'สไตล์บ้าน', value: lead.style || '—' },
            { label: 'งบประมาณ', value: lead.budget || '—' },
            { label: 'สถานะ', value: lead.status },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#F4F5F7', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: '#6B7891', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1F3A' }}>{value}</div>
            </div>
          ))}
        </div>

        {lead.detail && (
          <div style={{ background: '#F4F5F7', borderRadius: 10, padding: '16px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: '#6B7891', marginBottom: 8 }}>รายละเอียดเพิ่มเติม</div>
            <p style={{ fontSize: 14, color: '#0B1F3A', lineHeight: 1.7, margin: 0 }}>{lead.detail}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          {isPending && (
            <button
              onClick={() => { onMarkContacted(lead); onClose() }}
              style={{
                flex: 1, background: '#0B1F3A', color: '#FFF', fontWeight: 600,
                padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14,
              }}
            >
              ✓ ติดต่อแล้ว — ย้ายไปสำเร็จ
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              flex: isPending ? 0 : 1, padding: '12px 24px', background: '#F4F5F7',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#38465E', fontWeight: 500,
            }}
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  async function markContacted(lead) {
    await updateDoc(doc(db, 'leads', lead.id), { status: 'ติดต่อแล้ว' })
  }

  const pending = leads.filter(l => l.status === 'ยังไม่ติดต่อ')
  const contacted = leads.filter(l => l.status === 'ติดต่อแล้ว')

  const STATS = [
    { label: 'ใหม่วันนี้', value: leads.filter(l => isToday(l.createdAt)).length },
    { label: 'รอติดต่อ', value: pending.length },
  ]

  const rows = tab === 'pending' ? pending : contacted

  return (
    <main style={{ padding: '32px 40px' }}>
      {selected && (
        <DetailModal
          lead={selected}
          onClose={() => setSelected(null)}
          onMarkContacted={markContacted}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>LEADS · FROM LANDING PAGE</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>Lead ลูกค้า</h1>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 24 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 10, padding: 16 }}>
            <div className="mono" style={{ fontSize: 11, color: '#6B7891' }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#F4F5F7', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {[
          { key: 'pending', label: `รอติดต่อ (${pending.length})` },
          { key: 'contacted', label: `สำเร็จ (${contacted.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
              background: tab === t.key ? '#FFF' : 'transparent',
              color: tab === t.key ? '#0B1F3A' : '#6B7891',
              boxShadow: tab === t.key ? '0 1px 4px rgba(11,31,58,0.1)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6B7891' }}>กำลังโหลด...</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6B7891' }}>
            {tab === 'pending' ? 'ไม่มี Lead ที่รอติดต่อ' : 'ยังไม่มี Lead ที่สำเร็จ'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F4F5F7' }}>
                {['วันที่', 'ชื่อ-นามสกุล', 'เบอร์โทร', 'ประเภท', 'สไตล์', 'งบประมาณ', 'รายละเอียด', tab === 'pending' ? 'จัดการ' : 'สถานะ'].map(h => (
                  <th key={h} className="mono" style={{ textAlign: 'left', padding: h === 'วันที่' ? '12px 24px' : '12px 16px', fontSize: 11, fontWeight: 500, color: '#6B7891', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: 14 }}>
              {rows.map(l => (
                <tr
                  key={l.id}
                  onClick={() => setSelected(l)}
                  style={{ borderTop: '1px solid #E4E8EE', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FB'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td className="mono" style={{ padding: '14px 24px', fontSize: 13 }}>{formatDate(l.createdAt)}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{l.name}</td>
                  <td className="mono" style={{ padding: '14px 16px', fontSize: 13 }}>{l.phone}</td>
                  <td style={{ padding: '14px 16px' }}>{l.workType}</td>
                  <td style={{ padding: '14px 16px', color: '#38465E' }}>{l.style || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{l.budget || '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#6B7891', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {l.detail ? l.detail : <span style={{ color: '#C4CBD8' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                    {tab === 'pending' ? (
                      <button
                        onClick={() => markContacted(l)}
                        style={{
                          padding: '5px 12px', fontSize: 12, borderRadius: 6, border: 'none', cursor: 'pointer',
                          background: '#0B1F3A', color: '#FFF', fontWeight: 500,
                        }}
                      >
                        ✓ ติดต่อแล้ว
                      </button>
                    ) : (
                      <span style={{ padding: '4px 10px', fontSize: 12, borderRadius: 999, background: '#DCEFE3', color: '#1B6B3F' }}>
                        สำเร็จ
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
