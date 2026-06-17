export default function PlaceholderPage({ badge, title, route }) {
  return (
    <div style={{ padding: '32px 40px', flex: 1 }}>
      <div className="mono" style={{
        position: 'fixed', top: 16, right: 16, zIndex: 50,
        padding: '6px 12px', background: '#0B1F3A', color: '#FFF',
        fontSize: 11, letterSpacing: '0.1em', borderRadius: 999,
      }}>{route}</div>

      <div style={{ marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>
          {badge}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>{title}</h1>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 300, background: '#FFF', border: '1px solid #E4E8EE',
        borderRadius: 12, color: '#6B7891', fontSize: 14,
        flexDirection: 'column', gap: 8,
      }}>
        <div style={{ fontSize: 32 }}>🚧</div>
        <div>หน้านี้ยังไม่ได้ implement</div>
      </div>
    </div>
  )
}
