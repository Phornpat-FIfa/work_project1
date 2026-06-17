import { useState } from 'react'

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
  if (!total || total === 0) return 0
  return Math.min(100, Math.round((used / total) * 100))
}

const INIT_PROJECTS = [
  {
    id: 1, name: 'บ้านคุณสมชาย ลาดพร้าว', client: 'สมชาย ใจดี', phone: '081-234-5678',
    address: '12/4 ซ.ลาดพร้าว 71 กรุงเทพฯ', type: 'สร้างใหม่',
    budgetTotal: 3200000, budgetUsed: 2080000,
    pm: 'วิทย์', status: 'กำลังดำเนินการ',
    startDate: '2026-01-10', endDate: '2026-09-30', note: 'ลูกค้าต้องการหน้าต่างบานใหญ่ทุกห้อง',
  },
  {
    id: 2, name: 'ต่อเติมครัว คุณวิภา', client: 'วิภา ศรีสุข', phone: '089-456-7890',
    address: '55 ม.3 ต.บางรัก จ.นนทบุรี', type: 'ต่อเติม',
    budgetTotal: 480000, budgetUsed: 432000,
    pm: 'เอก', status: 'กำลังดำเนินการ',
    startDate: '2026-03-01', endDate: '2026-06-30', note: '',
  },
  {
    id: 3, name: 'รีโนเวทบ้าน บางนา', client: 'ปิยะ มากสุข', phone: '092-111-2233',
    address: '8/8 ซ.บางนา-ตราด กม.5 กรุงเทพฯ', type: 'รีโนเวท',
    budgetTotal: 1750000, budgetUsed: 612500,
    pm: 'นัท', status: 'หยุดพัก',
    startDate: '2026-02-15', endDate: '2026-08-15', note: 'รอลูกค้าอนุมัติงบเพิ่มเติม',
  },
  {
    id: 4, name: 'บ้านใหม่ ปทุมธานี', client: 'ก้องเกียรติ', phone: '064-987-6543',
    address: '99/2 ม.6 ต.คลองหลวง จ.ปทุมธานี', type: 'สร้างใหม่',
    budgetTotal: 4800000, budgetUsed: 576000,
    pm: 'วิทย์', status: 'กำลังดำเนินการ',
    startDate: '2026-05-01', endDate: '2027-03-31', note: 'โครงการขนาดใหญ่ ต้องประสานงานกับเทศบาล',
  },
  {
    id: 5, name: 'ห้องนอนเพิ่ม ราชพฤกษ์', client: 'นภัส ดวงดี', phone: '098-765-4321',
    address: '34 ซ.ราชพฤกษ์ 14 จ.นนทบุรี', type: 'ต่อเติม',
    budgetTotal: 320000, budgetUsed: 320000,
    pm: 'เอก', status: 'เสร็จแล้ว',
    startDate: '2025-11-01', endDate: '2026-02-28', note: '',
  },
]

const EMPTY_FORM = {
  name: '', client: '', phone: '', address: '',
  type: 'สร้างใหม่', budgetTotal: '', budgetUsed: '',
  pm: '', status: 'กำลังดำเนินการ',
  startDate: '', endDate: '', note: '',
}

export default function Projects() {
  const [projects, setProjects] = useState(INIT_PROJECTS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ทุกประเภทงาน')
  const [statusFilter, setStatusFilter] = useState('ทุกสถานะ')
  const [selected, setSelected] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.name.includes(search) || p.client.includes(search)
    const matchType = typeFilter === 'ทุกประเภทงาน' || p.type === typeFilter
    const matchStatus = statusFilter === 'ทุกสถานะ' || p.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormOpen(true)
  }

  function openEdit(p) {
    setSelected(null)
    setEditTarget(p)
    setForm({ ...p, budgetTotal: String(p.budgetTotal), budgetUsed: String(p.budgetUsed) })
    setFormOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const data = {
      ...form,
      budgetTotal: Number(form.budgetTotal),
      budgetUsed: Number(form.budgetUsed),
    }
    if (editTarget) {
      setProjects(prev => prev.map(p => p.id === editTarget.id ? { ...data, id: editTarget.id } : p))
    } else {
      setProjects(prev => [...prev, { ...data, id: Date.now() }])
    }
    setFormOpen(false)
  }

  return (
    <main style={{ padding: '32px 40px' }}>
      <div className="mono" style={{ position: 'fixed', top: 16, right: 16, zIndex: 50, padding: '6px 12px', background: '#0B1F3A', color: '#FFF', fontSize: 11, letterSpacing: '0.1em', borderRadius: 999 }}>/projects</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>PROJECTS</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>จัดการโครงการ</h1>
        </div>
        <button onClick={openAdd} style={{ padding: '12px 20px', background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          + เพิ่มโครงการใหม่
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="text" placeholder="ค้นหาโครงการ / ลูกค้า..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFF', outline: 'none' }}>
          <option>ทุกประเภทงาน</option>
          <option>สร้างใหม่</option><option>ต่อเติม</option><option>รีโนเวท</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFF', outline: 'none' }}>
          <option>ทุกสถานะ</option>
          <option>กำลังดำเนินการ</option><option>เสร็จแล้ว</option><option>หยุดพัก</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F5F7' }}>
              {['โครงการ', 'ลูกค้า', 'ประเภท', 'งบทั้งหมด', 'ใช้ไปแล้ว', 'PM', 'ความคืบหน้า', 'สถานะ', ''].map(h => (
                <th key={h} className="mono" style={{ textAlign: 'left', padding: h === 'โครงการ' ? '12px 24px' : '12px 16px', fontSize: 11, fontWeight: 500, color: '#6B7891', letterSpacing: '0.1em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: 14 }}>
            {filtered.map(p => {
              const progress = pct(p.budgetUsed, p.budgetTotal)
              const { stBg, stColor } = STATUS_STYLE[p.status] || STATUS_STYLE['กำลังดำเนินการ']
              return (
                <tr key={p.id} style={{ borderTop: '1px solid #E4E8EE' }}>
                  <td style={{ padding: '14px 24px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '14px 16px', color: '#38465E' }}>{p.client}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 8px', background: '#F4F5F7', fontSize: 12, borderRadius: 4 }}>{p.type}</span>
                  </td>
                  <td className="mono" style={{ padding: '14px 16px' }}>{fmtBudget(p.budgetTotal)}</td>
                  <td className="mono" style={{ padding: '14px 16px', color: '#38465E' }}>{fmtBudget(p.budgetUsed)}</td>
                  <td style={{ padding: '14px 16px', color: '#38465E' }}>{p.pm}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 6, background: '#E4E8EE', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: progress >= 100 ? '#1B6B3F' : '#0B1F3A' }} />
                      </div>
                      <span className="mono" style={{ fontSize: 12 }}>{progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', background: stBg, color: stColor, fontSize: 12, borderRadius: 999 }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => setSelected(p)}
                      style={{ padding: '6px 14px', background: '#F4F5F7', border: '1px solid #E4E8EE', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#0B1F3A', fontWeight: 500 }}>
                      รายละเอียด
                    </button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '32px 24px', textAlign: 'center', color: '#6B7891', fontSize: 14 }}>ไม่พบโครงการที่ตรงกับเงื่อนไข</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (() => {
        const progress = pct(selected.budgetUsed, selected.budgetTotal)
        const remaining = selected.budgetTotal - selected.budgetUsed
        const { stBg, stColor } = STATUS_STYLE[selected.status] || STATUS_STYLE['กำลังดำเนินการ']
        return (
          <div onClick={() => setSelected(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(6,15,30,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div onClick={e => e.stopPropagation()}
              style={{ background: '#FFF', borderRadius: 16, width: '100%', maxWidth: 560, padding: 36, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
              <button onClick={() => setSelected(null)}
                style={{ position: 'absolute', top: 16, right: 16, background: '#F4F5F7', border: 'none', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>

              <div className="mono" style={{ fontSize: 11, color: '#6B7891', letterSpacing: '0.15em', marginBottom: 6 }}>PROJECT DETAIL</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: '#0B1F3A' }}>{selected.name}</h2>
              <span style={{ padding: '4px 10px', background: stBg, color: stColor, fontSize: 12, borderRadius: 999 }}>{selected.status}</span>

              <div style={{ height: 1, background: '#E4E8EE', margin: '20px 0' }} />

              {/* Budget summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                <BudgetCard label="งบทั้งหมด" value={fmtBudget(selected.budgetTotal)} color="#0B1F3A" />
                <BudgetCard label="ใช้ไปแล้ว" value={fmtBudget(selected.budgetUsed)} color="#E0A800" />
                <BudgetCard label="คงเหลือ" value={fmtBudget(remaining)} color={remaining < 0 ? '#DC2626' : '#1B6B3F'} />
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B7891', marginBottom: 6 }}>
                  <span>ความคืบหน้า (จากงบที่ใช้)</span>
                  <span className="mono">{progress}%</span>
                </div>
                <div style={{ height: 10, background: '#E4E8EE', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: progress >= 100 ? '#1B6B3F' : '#0B1F3A', borderRadius: 999, transition: 'width 0.3s' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <DetailRow label="ลูกค้า" value={selected.client} />
                <DetailRow label="เบอร์โทร" value={selected.phone} />
                <DetailRow label="ประเภทงาน" value={selected.type} />
                <DetailRow label="PM" value={selected.pm} />
                <DetailRow label="วันเริ่มต้น" value={selected.startDate} />
                <DetailRow label="วันกำหนดเสร็จ" value={selected.endDate} />
              </div>
              <div style={{ marginTop: 16 }}><DetailRow label="ที่อยู่/สถานที่" value={selected.address} /></div>
              {selected.note && <div style={{ marginTop: 16 }}><DetailRow label="หมายเหตุ" value={selected.note} /></div>}

              <button onClick={() => openEdit(selected)}
                style={{ marginTop: 24, width: '100%', padding: '12px', background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                แก้ไขโครงการ
              </button>
            </div>
          </div>
        )
      })()}

      {/* Add / Edit Form Modal */}
      {formOpen && (
        <div onClick={() => setFormOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(6,15,30,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#FFF', borderRadius: 16, width: '100%', maxWidth: 580, padding: 36, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setFormOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: '#F4F5F7', border: 'none', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>

            <div className="mono" style={{ fontSize: 11, color: '#6B7891', letterSpacing: '0.15em', marginBottom: 6 }}>
              {editTarget ? 'EDIT PROJECT' : 'NEW PROJECT'}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 24px', color: '#0B1F3A' }}>
              {editTarget ? 'แก้ไขโครงการ' : 'เพิ่มโครงการใหม่'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="ชื่อโครงการ *" style={{ gridColumn: '1 / -1' }}>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="เช่น บ้านคุณสมชาย ลาดพร้าว" style={inputSt} />
                </FormField>
                <FormField label="ชื่อลูกค้า *">
                  <input required value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
                    placeholder="ชื่อ-นามสกุล" style={inputSt} />
                </FormField>
                <FormField label="เบอร์โทรลูกค้า">
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="08X-XXX-XXXX" style={inputSt} />
                </FormField>
                <FormField label="ที่อยู่/สถานที่ก่อสร้าง" style={{ gridColumn: '1 / -1' }}>
                  <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="บ้านเลขที่ ซอย ถนน จังหวัด" style={inputSt} />
                </FormField>
                <FormField label="ประเภทงาน *">
                  <select required value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputSt}>
                    <option>สร้างใหม่</option><option>ต่อเติม</option><option>รีโนเวท</option>
                  </select>
                </FormField>
                <FormField label="PM (ผู้รับผิดชอบ)">
                  <input value={form.pm} onChange={e => setForm(p => ({ ...p, pm: e.target.value }))}
                    placeholder="ชื่อ PM" style={inputSt} />
                </FormField>
                <FormField label="งบประมาณทั้งหมด (บาท) *">
                  <input required type="number" min="0" value={form.budgetTotal}
                    onChange={e => setForm(p => ({ ...p, budgetTotal: e.target.value }))}
                    placeholder="3200000" style={inputSt} />
                </FormField>
                <FormField label="งบที่ใช้ไปแล้ว (บาท)">
                  <input type="number" min="0" value={form.budgetUsed}
                    onChange={e => setForm(p => ({ ...p, budgetUsed: e.target.value }))}
                    placeholder="0" style={inputSt} />
                </FormField>
                <FormField label="วันเริ่มต้น">
                  <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} style={inputSt} />
                </FormField>
                <FormField label="วันกำหนดเสร็จ">
                  <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} style={inputSt} />
                </FormField>
                <FormField label="สถานะ" style={{ gridColumn: '1 / -1' }}>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputSt}>
                    <option>กำลังดำเนินการ</option><option>หยุดพัก</option><option>เสร็จแล้ว</option>
                  </select>
                </FormField>
                <FormField label="หมายเหตุ" style={{ gridColumn: '1 / -1' }}>
                  <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                    placeholder="รายละเอียดเพิ่มเติม..." rows={3}
                    style={{ ...inputSt, resize: 'vertical' }} />
                </FormField>
              </div>

              {/* Preview progress */}
              {form.budgetTotal > 0 && (
                <div style={{ background: '#F4F5F7', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 12, color: '#6B7891', marginBottom: 6 }}>ความคืบหน้าที่จะบันทึก</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 8, background: '#E4E8EE', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${pct(form.budgetUsed, form.budgetTotal)}%`, height: '100%', background: '#0B1F3A', borderRadius: 999 }} />
                    </div>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{pct(form.budgetUsed, form.budgetTotal)}%</span>
                  </div>
                </div>
              )}

              <button type="submit"
                style={{ padding: '12px', background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
                {editTarget ? 'บันทึกการแก้ไข' : 'เพิ่มโครงการ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

function BudgetCard({ label, value, color }) {
  return (
    <div style={{ background: '#F4F5F7', borderRadius: 10, padding: '12px 16px' }}>
      <div style={{ fontSize: 11, color: '#6B7891', marginBottom: 4 }}>{label}</div>
      <div className="mono" style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#6B7891', marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 14, color: '#0B1F3A', fontWeight: 500 }}>{value || '—'}</div>
    </div>
  )
}

function FormField({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ fontSize: 13, color: '#38465E', fontWeight: 500, display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

const inputSt = {
  width: '100%', padding: '10px 14px', border: '1px solid #E4E8EE',
  borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none',
  background: '#FFF', boxSizing: 'border-box', color: '#0B1F3A',
}
