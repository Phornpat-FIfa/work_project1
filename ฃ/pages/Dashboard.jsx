import { Link } from 'react-router-dom'

const PROJECTS = [
  { name: 'บ้านคุณสมชาย ลาดพร้าว', client: 'สมชาย ใจดี', budget: '฿3,200,000', pct: 65, status: 'กำลังดำเนินการ', stBg: '#E8EDF5', stColor: '#0B1F3A' },
  { name: 'ต่อเติมครัว คุณวิภา', client: 'วิภา ศรีสุข', budget: '฿480,000', pct: 90, status: 'กำลังดำเนินการ', stBg: '#E8EDF5', stColor: '#0B1F3A' },
  { name: 'รีโนเวทบ้าน บางนา', client: 'ปิยะ มากสุข', budget: '฿1,750,000', pct: 35, status: 'หยุดพัก', stBg: '#FFF4D6', stColor: '#8A6800' },
  { name: 'บ้านใหม่ ปทุมธานี', client: 'ก้องเกียรติ', budget: '฿4,800,000', pct: 12, status: 'กำลังดำเนินการ', stBg: '#E8EDF5', stColor: '#0B1F3A' },
  { name: 'ห้องนอนเพิ่ม ราชพฤกษ์', client: 'นภัส ดวงดี', budget: '฿320,000', pct: 100, status: 'เสร็จแล้ว', stBg: '#DCEFE3', stColor: '#1B6B3F' },
]

export default function Dashboard() {
  return (
    <main style={{ padding: '32px 40px' }}>
      <div className="mono" style={{ position: 'fixed', top: 16, right: 16, zIndex: 50, padding: '6px 12px', background: '#0B1F3A', color: '#FFF', fontSize: 11, letterSpacing: '0.1em', borderRadius: 999 }}>/dashboard</div>

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
          <div className="mono" style={{ fontSize: 13, color: '#6B7891' }}>16 มิ.ย. 2026 · อังคาร</div>
        </div>
      </div>

      {/* Stat widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <Widget label="โครงการกำลังดำเนินการ" value="8" sub="+2 จากเดือนที่แล้ว" />
        <Widget label="เบิกจ่ายรอดำเนินการ" value="฿245,800" sub="5 รายการ" />
        <Widget label="PO รออนุมัติ" value="12" sub="รวม ฿1.2M" />
        <Widget label="LEAD ใหม่วันนี้" value="3" sub="ติดต่อแล้ว 1 · รออีก 2" dark />
      </div>

      {/* Recent projects */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E4E8EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>โครงการล่าสุด</h2>
            <div style={{ fontSize: 13, color: '#6B7891', marginTop: 2 }}>5 รายการ</div>
          </div>
          <Link to="/projects" style={{ fontSize: 13, color: '#0B1F3A', fontWeight: 500, textDecoration: 'none' }}>ดูทั้งหมด →</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F5F7' }}>
              {['โครงการ', 'ลูกค้า', 'งบ', 'ความคืบหน้า', 'สถานะ'].map(h => (
                <th key={h} className="mono" style={{ textAlign: 'left', padding: h === 'โครงการ' ? '12px 24px' : '12px 16px', fontSize: 11, fontWeight: 500, color: '#6B7891', letterSpacing: '0.1em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: 14 }}>
            {PROJECTS.map(p => (
              <tr key={p.name} style={{ borderTop: '1px solid #E4E8EE' }}>
                <td style={{ padding: '14px 24px', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '14px 16px', color: '#38465E' }}>{p.client}</td>
                <td className="mono" style={{ padding: '14px 16px' }}>{p.budget}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 100, height: 6, background: '#E4E8EE', borderRadius: 999, overflow: 'hidden' }}>
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
          </tbody>
        </table>
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
