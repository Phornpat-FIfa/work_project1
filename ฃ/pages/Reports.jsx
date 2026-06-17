const CHART_DATA = [
  { name: 'บ้านคุณสมชาย ลาดพร้าว', used: '฿2.08M', budget: '฿3.20M', pct: 65 },
  { name: 'บ้านใหม่ ปทุมธานี', used: '฿0.58M', budget: '฿4.80M', pct: 12 },
  { name: 'รีโนเวทบ้าน บางนา', used: '฿0.61M', budget: '฿1.75M', pct: 35 },
  { name: 'ต่อเติมครัว คุณวิภา', used: '฿0.43M', budget: '฿0.48M', pct: 90 },
  { name: 'ห้องนอนเพิ่ม ราชพฤกษ์', used: '฿0.32M', budget: '฿0.32M', pct: 100 },
]

export default function Reports() {
  return (
    <main style={{ padding: '32px 40px' }}>
      <div className="mono" style={{ position: 'fixed', top: 16, right: 16, zIndex: 50, padding: '6px 12px', background: '#0B1F3A', color: '#FFF', fontSize: 11, letterSpacing: '0.1em', borderRadius: 999 }}>/reports</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>REPORTS</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>รายงานสรุปค่าใช้จ่าย</h1>
        </div>
        <button style={{ padding: '12px 20px', background: '#FFF', color: '#0B1F3A', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>↓ Export CSV</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <SummaryCard label="งบประมาณรวมทั้งหมด" value="฿18.5M" sub="8 โครงการ active" />
        <SummaryCard label="ใช้จริงแล้ว" value="฿9.2M" sub="49.7% ของงบทั้งหมด" />
        <SummaryCard label="เหลือใช้ได้" value="฿9.3M" sub="PO + เบิกจ่าย รวมกัน" dark />
      </div>

      {/* Bar chart */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, padding: 28, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>งบประมาณ vs ใช้จริง · แต่ละโครงการ</h2>
            <div style={{ fontSize: 13, color: '#6B7891', marginTop: 2 }}>PO + เบิกจ่ายล่วงหน้า รวมกัน</div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#E4E8EE', borderRadius: 2, display: 'inline-block' }} />งบประมาณ</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#0B1F3A', borderRadius: 2, display: 'inline-block' }} />ใช้จริง</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CHART_DATA.map(d => (
            <div key={d.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ fontWeight: 500 }}>{d.name}</span>
                <span className="mono" style={{ color: '#6B7891' }}>{d.used} / {d.budget}</span>
              </div>
              <div style={{ position: 'relative', height: 24, background: '#F4F5F7', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, width: '100%', background: '#E4E8EE' }} />
                <div style={{ position: 'absolute', inset: 0, width: `${d.pct}%`, background: '#0B1F3A', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function SummaryCard({ label, value, sub, dark }) {
  return (
    <div style={{ background: dark ? '#0B1F3A' : '#FFF', color: dark ? '#FFF' : '#0B1F3A', border: dark ? 'none' : '1px solid #E4E8EE', borderRadius: 12, padding: 24 }}>
      <div className="mono" style={{ fontSize: 11, color: dark ? '#8FA0BD' : '#6B7891', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
      <div className="mono" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: dark ? '#B8C4DA' : '#6B7891', marginTop: 6 }}>{sub}</div>
    </div>
  )
}
