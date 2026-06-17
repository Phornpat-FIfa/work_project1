import { useState } from 'react'

const ALL_PROJECTS = [
  { name: 'บ้านคุณสมชาย ลาดพร้าว', client: 'สมชาย ใจดี', type: 'สร้างใหม่', budget: '฿3.2M', pm: 'วิทย์', pct: 65, status: 'กำลังดำเนินการ', stBg: '#E8EDF5', stColor: '#0B1F3A' },
  { name: 'ต่อเติมครัว คุณวิภา', client: 'วิภา ศรีสุข', type: 'ต่อเติม', budget: '฿480K', pm: 'เอก', pct: 90, status: 'กำลังดำเนินการ', stBg: '#E8EDF5', stColor: '#0B1F3A' },
  { name: 'รีโนเวทบ้าน บางนา', client: 'ปิยะ มากสุข', type: 'รีโนเวท', budget: '฿1.75M', pm: 'นัท', pct: 35, status: 'หยุดพัก', stBg: '#FFF4D6', stColor: '#8A6800' },
  { name: 'บ้านใหม่ ปทุมธานี', client: 'ก้องเกียรติ', type: 'สร้างใหม่', budget: '฿4.8M', pm: 'วิทย์', pct: 12, status: 'กำลังดำเนินการ', stBg: '#E8EDF5', stColor: '#0B1F3A' },
  { name: 'ห้องนอนเพิ่ม ราชพฤกษ์', client: 'นภัส ดวงดี', type: 'ต่อเติม', budget: '฿320K', pm: 'เอก', pct: 100, status: 'เสร็จแล้ว', stBg: '#DCEFE3', stColor: '#1B6B3F' },
]

export default function Projects() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ทุกประเภทงาน')
  const [statusFilter, setStatusFilter] = useState('ทุกสถานะ')

  const filtered = ALL_PROJECTS.filter(p => {
    const matchSearch = !search || p.name.includes(search) || p.client.includes(search)
    const matchType = typeFilter === 'ทุกประเภทงาน' || p.type === typeFilter
    const matchStatus = statusFilter === 'ทุกสถานะ' || p.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  return (
    <main style={{ padding: '32px 40px' }}>
      <div className="mono" style={{ position: 'fixed', top: 16, right: 16, zIndex: 50, padding: '6px 12px', background: '#0B1F3A', color: '#FFF', fontSize: 11, letterSpacing: '0.1em', borderRadius: 999 }}>/projects</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>PROJECTS</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>จัดการโครงการ</h1>
        </div>
        <button style={{ padding: '12px 20px', background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          + เพิ่มโครงการใหม่
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          type="text" placeholder="ค้นหาโครงการ / ลูกค้า..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFF', outline: 'none' }}>
          <option>ทุกประเภทงาน</option>
          <option>สร้างใหม่</option>
          <option>ต่อเติม</option>
          <option>รีโนเวท</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFF', outline: 'none' }}>
          <option>ทุกสถานะ</option>
          <option>กำลังดำเนินการ</option>
          <option>เสร็จแล้ว</option>
          <option>หยุดพัก</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F5F7' }}>
              {['โครงการ', 'ลูกค้า', 'ประเภท', 'งบ', 'PM', 'ความคืบหน้า', 'สถานะ'].map(h => (
                <th key={h} className="mono" style={{ textAlign: 'left', padding: h === 'โครงการ' ? '12px 24px' : '12px 16px', fontSize: 11, fontWeight: 500, color: '#6B7891', letterSpacing: '0.1em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: 14 }}>
            {filtered.map(p => (
              <tr key={p.name} style={{ borderTop: '1px solid #E4E8EE' }}>
                <td style={{ padding: '14px 24px', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '14px 16px', color: '#38465E' }}>{p.client}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '3px 8px', background: '#F4F5F7', fontSize: 12, borderRadius: 4 }}>{p.type}</span>
                </td>
                <td className="mono" style={{ padding: '14px 16px' }}>{p.budget}</td>
                <td style={{ padding: '14px 16px', color: '#38465E' }}>{p.pm}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80, height: 6, background: '#E4E8EE', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${p.pct}%`, height: '100%', background: '#0B1F3A' }} />
                    </div>
                    <span className="mono" style={{ fontSize: 12 }}>{p.pct}%</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '4px 10px', background: p.stBg, color: p.stColor, fontSize: 12, borderRadius: 999 }}>{p.status}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '32px 24px', textAlign: 'center', color: '#6B7891', fontSize: 14 }}>ไม่พบโครงการที่ตรงกับเงื่อนไข</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
