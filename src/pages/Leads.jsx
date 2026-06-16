const STATS = [
  { label: 'ใหม่วันนี้', value: '3' },
  { label: 'สัปดาห์นี้', value: '14' },
  { label: 'รอติดต่อ', value: '7' },
  { label: 'ติดต่อแล้ว · เดือนนี้', value: '42' },
]

const LEADS = [
  { date: '15 มิ.ย. 10:24', name: 'ธนากร พัฒนกิจ', phone: '081-234-5678', type: 'สร้างใหม่', style: 'โมเดิร์น', budget: '3-5M', status: 'ยังไม่ติดต่อ', stBg: '#FFF4D6', stColor: '#8A6800' },
  { date: '15 มิ.ย. 09:11', name: 'สุทธิดา รุ่งโรจน์', phone: '089-876-5432', type: 'ต่อเติม', style: 'คลาสสิก', budget: '1-3M', status: 'ยังไม่ติดต่อ', stBg: '#FFF4D6', stColor: '#8A6800' },
  { date: '15 มิ.ย. 08:02', name: 'ภานุพงษ์ คงดี', phone: '092-111-2222', type: 'รีโนเวท', style: 'ลอฟท์', budget: '< 1M', status: 'ติดต่อแล้ว', stBg: '#DCEFE3', stColor: '#1B6B3F' },
  { date: '14 มิ.ย. 16:48', name: 'วรรณวิภา ตรีศรี', phone: '086-555-7878', type: 'สร้างใหม่', style: 'โมเดิร์น', budget: '5-10M', status: 'ติดต่อแล้ว', stBg: '#DCEFE3', stColor: '#1B6B3F' },
]

export default function Leads() {
  return (
    <main style={{ padding: '32px 40px' }}>
      <div className="mono" style={{ position: 'fixed', top: 16, right: 16, zIndex: 50, padding: '6px 12px', background: '#0B1F3A', color: '#FFF', fontSize: 11, letterSpacing: '0.1em', borderRadius: 999 }}>/leads</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>LEADS · FROM LANDING PAGE</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>Lead ลูกค้า</h1>
        </div>
        <button style={{ padding: '10px 16px', background: '#FFF', color: '#0B1F3A', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>↓ Export</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 10, padding: 16 }}>
            <div className="mono" style={{ fontSize: 11, color: '#6B7891' }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F5F7' }}>
              {['วันที่', 'ชื่อ-นามสกุล', 'เบอร์โทร', 'ประเภท', 'สไตล์', 'งบ', 'สถานะ'].map(h => (
                <th key={h} className="mono" style={{ textAlign: 'left', padding: h === 'วันที่' ? '12px 24px' : '12px 16px', fontSize: 11, fontWeight: 500, color: '#6B7891', letterSpacing: '0.1em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: 14 }}>
            {LEADS.map((l, i) => (
              <tr key={i} style={{ borderTop: '1px solid #E4E8EE' }}>
                <td className="mono" style={{ padding: '14px 24px', fontSize: 13 }}>{l.date}</td>
                <td style={{ padding: '14px 16px', fontWeight: 500 }}>{l.name}</td>
                <td className="mono" style={{ padding: '14px 16px', fontSize: 13 }}>{l.phone}</td>
                <td style={{ padding: '14px 16px' }}>{l.type}</td>
                <td style={{ padding: '14px 16px', color: '#38465E' }}>{l.style}</td>
                <td className="mono" style={{ padding: '14px 16px' }}>{l.budget}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '4px 10px', background: l.stBg, color: l.stColor, fontSize: 12, borderRadius: 999 }}>{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
