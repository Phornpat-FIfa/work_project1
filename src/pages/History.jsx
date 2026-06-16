import { useState } from 'react'

const LOGS = [
  { ts: '15 มิ.ย. 14:32', action: 'อนุมัติ', actionBg: '#DCEFE3', actionColor: '#1B6B3F', text: <><strong>วิทย์</strong> อนุมัติ PO <span className="mono">PO-2026-0041</span> มูลค่า ฿245,000 ของโครงการ <em>บ้านใหม่ ปทุมธานี</em></> },
  { ts: '15 มิ.ย. 11:08', action: 'สร้าง', actionBg: '#E8EDF5', actionColor: '#0B1F3A', text: <><strong>เอก</strong> สร้าง PO <span className="mono">PO-2026-0042</span> ของโครงการ <em>บ้านคุณสมชาย ลาดพร้าว</em></> },
  { ts: '15 มิ.ย. 09:45', action: 'แก้ไข', actionBg: '#FFF4D6', actionColor: '#8A6800', text: <><strong>นัท</strong> แก้ไขโครงการ <em>รีโนเวทบ้าน บางนา</em> เปลี่ยนสถานะจาก "กำลังดำเนินการ" → "หยุดพัก"</> },
  { ts: '14 มิ.ย. 17:22', action: 'อนุมัติ', actionBg: '#DCEFE3', actionColor: '#1B6B3F', text: <><strong>วิทย์</strong> อนุมัติเบิกล่วงหน้า ฿28,500 ของโครงการ <em>บ้านใหม่ ปทุมธานี</em></> },
  { ts: '14 มิ.ย. 15:10', action: 'สร้าง', actionBg: '#E8EDF5', actionColor: '#0B1F3A', text: <><strong>เอก</strong> ขอเบิกล่วงหน้า ฿45,000 สำหรับ "ค่ามัดจำเหล็กเส้น" โครงการ <em>บ้านคุณสมชาย ลาดพร้าว</em></> },
]

export default function History() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('ทุก action')
  const [tableFilter, setTableFilter] = useState('ทุก table')

  return (
    <main style={{ padding: '32px 40px' }}>
      <div className="mono" style={{ position: 'fixed', top: 16, right: 16, zIndex: 50, padding: '6px 12px', background: '#0B1F3A', color: '#FFF', fontSize: 11, letterSpacing: '0.1em', borderRadius: 999 }}>/history</div>

      <div style={{ marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>AUDIT LOG</div>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>ประวัติการทำรายการ</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6B7891' }}>บันทึกทุก action — สร้าง / แก้ไข / อนุมัติ — เพื่อตรวจสอบย้อนหลัง</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input type="text" placeholder="ค้นหา user / รายละเอียด..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFF', outline: 'none' }} />
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFF', outline: 'none' }}>
          {['ทุก action', 'สร้าง', 'แก้ไข', 'อนุมัติ', 'ลบ'].map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={tableFilter} onChange={e => setTableFilter(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFF', outline: 'none' }}>
          {['ทุก table', 'projects', 'purchase_orders', 'expenses', 'leads'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Timeline */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, padding: 8 }}>
        {LOGS.map((log, i) => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: i < LOGS.length - 1 ? '1px solid #E4E8EE' : 'none', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="mono" style={{ fontSize: 12, color: '#6B7891', minWidth: 130 }}>{log.ts}</div>
            <div style={{ padding: '3px 10px', background: log.actionBg, color: log.actionColor, fontSize: 12, borderRadius: 4, fontWeight: 500, whiteSpace: 'nowrap' }}>{log.action}</div>
            <div style={{ flex: 1, fontSize: 14 }}>{log.text}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
