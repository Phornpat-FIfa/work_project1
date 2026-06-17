import { useState, useEffect, useCallback } from 'react'

const INITIAL_RECORDS = [
  { id: 'EXP-2026-0018', project: 'บ้านคุณสมชาย ลาดพร้าว', description: 'ค่ามัดจำเหล็กเส้น', amount: '45,000', date: '14 มิ.ย. 2026', status: 'รออนุมัติ', note: '', imageSrc: null },
  { id: 'EXP-2026-0017', project: 'บ้านใหม่ ปทุมธานี', description: 'ค่ารถขนของ + ค่าแรงคนงาน', amount: '28,500', date: '13 มิ.ย. 2026', status: 'อนุมัติสำเร็จ', note: 'รอตรวจสอบใบเสร็จ', imageSrc: null },
  { id: 'EXP-2026-0016', project: 'รีโนเวทบ้าน บางนา', description: 'สีและอุปกรณ์ทาสีโปรเจค', amount: '18,400', date: '12 มิ.ย. 2026', status: 'เบิกจ่ายสำเร็จ', note: '', imageSrc: null },
  { id: 'EXP-2026-0015', project: 'บ้านคุณสมชาย ลาดพร้าว', description: 'ค่าประปาชั่วคราวหน้างาน', amount: '8,200', date: '11 มิ.ย. 2026', status: 'เบิกจ่ายสำเร็จ', note: '', imageSrc: null },
  { id: 'EXP-2026-0014', project: 'ต่อเติมครัว คุณวิภา', description: 'ค่าออกแบบและเขียนแบบ', amount: '12,000', date: '10 มิ.ย. 2026', status: 'รออนุมัติ', note: '', imageSrc: null },
]

const TABS = [
  { key: 'รออนุมัติ',    label: 'รออนุมัติ' },
  { key: 'อนุมัติสำเร็จ', label: 'อนุมัติสำเร็จ' },
  { key: 'เบิกจ่ายสำเร็จ', label: 'เบิกจ่ายสำเร็จ' },
  { key: 'all',          label: 'รายการทั้งหมด' },
]

function statusStyle(s) {
  if (s === 'รออนุมัติ')    return { bg: '#FFF4D6', color: '#8A6800' }
  if (s === 'อนุมัติสำเร็จ') return { bg: '#E8EDF5', color: '#0B1F3A' }
  return { bg: '#DCEFE3', color: '#1B6B3F' }
}

function parseAmt(s) { return parseFloat((s || '0').toString().replace(/,/g, '')) || 0 }

export default function Expenses() {
  const [tab, setTab] = useState('รออนุมัติ')
  const [selectedId, setSelectedId] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [uploadedImages, setUploadedImages] = useState({})
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('sb_exp_records_v1')
      return saved ? JSON.parse(saved) : INITIAL_RECORDS
    } catch (_) { return INITIAL_RECORDS }
  })

  const [nfProject, setNfProject] = useState('')
  const [nfDesc, setNfDesc] = useState('')
  const [nfAmount, setNfAmount] = useState('')
  const [nfDate, setNfDate] = useState('')
  const [nfNote, setNfNote] = useState('')
  const [nfImg, setNfImg] = useState(null)

  useEffect(() => {
    try { const s = localStorage.getItem('sb_exp_imgs_v2'); if (s) setUploadedImages(JSON.parse(s)) } catch (_) {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('sb_exp_records_v1', JSON.stringify(records)) } catch (_) {}
  }, [records])

  const saveImages = useCallback(imgs => { try { localStorage.setItem('sb_exp_imgs_v2', JSON.stringify(imgs)) } catch (_) {} }, [])

  const sel = records.find(r => r.id === selectedId) || null
  const selImg = sel ? (uploadedImages[sel.id] || sel.imageSrc) : null
  const selSt = sel ? statusStyle(sel.status) : { bg: '#F4F5F7', color: '#6B7891' }

  const pending = records.filter(r => r.status === 'รออนุมัติ')
  const approved = records.filter(r => r.status === 'อนุมัติสำเร็จ')
  const paid = records.filter(r => r.status === 'เบิกจ่ายสำเร็จ')
  const sumOf = arr => '฿' + arr.reduce((s, r) => s + parseAmt(r.amount), 0).toLocaleString()

  const filtered = tab === 'all' ? records : records.filter(r => r.status === tab)

  function resetForm() { setNfProject(''); setNfDesc(''); setNfAmount(''); setNfDate(''); setNfNote(''); setNfImg(null) }

  function handleExistUpload(e) {
    const file = e.target.files?.[0]; if (!file || !selectedId) return
    const r = new FileReader()
    r.onload = ev => { const imgs = { ...uploadedImages, [selectedId]: ev.target.result }; saveImages(imgs); setUploadedImages(imgs) }
    r.readAsDataURL(file)
  }

  function handleNewUpload(e) {
    const file = e.target.files?.[0]; if (!file) return
    const r = new FileReader(); r.onload = ev => setNfImg(ev.target.result); r.readAsDataURL(file)
  }

  function submitNew() {
    const newId = 'EXP-2026-' + String(Date.now()).slice(-4)
    const rec = { id: newId, project: nfProject || 'โครงการใหม่', description: nfDesc || 'รายการใหม่', amount: (parseFloat(nfAmount) || 0).toLocaleString(), date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }), status: 'รออนุมัติ', note: nfNote, imageSrc: null }
    const newImgs = { ...uploadedImages }
    if (nfImg) newImgs[newId] = nfImg
    saveImages(newImgs)
    setRecords(prev => [rec, ...prev]); setUploadedImages(newImgs)
    setShowNew(false); setSelectedId(newId); setTab('all'); resetForm()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0, padding: '32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>ADVANCE EXPENSES</div>
            <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>เบิกจ่ายล่วงหน้า</h1>
          </div>
          <button onClick={() => setShowNew(true)} style={{ padding: '12px 20px', background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>+ ขอเบิกล่วงหน้า</button>
        </div>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6B7891' }}>ขอเงินก่อนไปซื้อ — รอการอนุมัติจากผู้มีอำนาจ</p>

        {/* Summary widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
          <SummaryCard label="รออนุมัติ" value={sumOf(pending)} sub={`${pending.length} รายการ`} />
          <SummaryCard label="อนุมัติสำเร็จ (รอจ่าย)" value={sumOf(approved)} sub={`${approved.length} รายการ`} />
          <SummaryCard label="เบิกจ่ายสำเร็จ · เดือนนี้" value={sumOf(paid)} sub={`${paid.length} รายการ`} dark />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: '#FFF', padding: 4, borderRadius: 10, border: '1px solid #E4E8EE', width: 'fit-content' }}>
          {TABS.map(t => {
            const active = tab === t.key
            const cnt = t.key === 'all' ? records.length : records.filter(r => r.status === t.key).length
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 16px', background: active ? '#0B1F3A' : 'transparent', color: active ? '#FFF' : '#38465E', fontWeight: active ? 600 : 400, border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t.label} {cnt}</button>
            )
          })}
        </div>

        {/* Table grid */}
        <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '108px 1fr 200px 120px 138px 28px', background: '#F4F5F7', borderBottom: '1px solid #E4E8EE' }}>
            {['วันที่ขอ', 'โครงการ', 'รายการ / วัตถุประสงค์', 'จำนวนเงิน', 'สถานะ', ''].map((h, i) => (
              <div key={i} className="mono" style={{ padding: i === 0 ? '12px 20px' : '12px 16px', fontSize: 11, fontWeight: 500, color: '#6B7891', letterSpacing: '0.1em', textAlign: i === 3 ? 'right' : 'left' }}>{h}</div>
            ))}
          </div>
          {filtered.map(r => {
            const st = statusStyle(r.status)
            const isSelected = r.id === selectedId
            const hasDoc = !!(uploadedImages[r.id] || r.imageSrc)
            return (
              <ExpRow key={r.id} r={r} isSelected={isSelected} st={st} hasDoc={hasDoc} onClick={() => setSelectedId(prev => prev === r.id ? null : r.id)} />
            )
          })}
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: 12, color: '#6B7891' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1B6B3F', display: 'inline-block' }} />มีใบเบิกเงินแนบ</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D9DEE6', display: 'inline-block' }} />ยังไม่มี</span>
          <span style={{ color: '#0B1F3A', marginLeft: 4 }}>· กดแถวเพื่อดูรายละเอียด</span>
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div style={{ width: 440, minWidth: 440, borderLeft: '1px solid #E4E8EE', background: '#FFF', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #E4E8EE', position: 'sticky', top: 0, background: '#FFF', zIndex: 10 }}>
            <div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{sel.id}</div>
              <span style={{ padding: '4px 12px', background: selSt.bg, color: selSt.color, fontSize: 12, borderRadius: 999 }}>{sel.status}</span>
            </div>
            <button onClick={() => setSelectedId(null)} style={{ width: 30, height: 30, border: '1px solid #E4E8EE', background: '#FFF', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>

          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F4F5F7' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B7891', marginBottom: 4 }}>รายการ / วัตถุประสงค์</div>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{sel.description}</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B7891', marginBottom: 4 }}>โครงการ</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{sel.project}</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B7891', marginBottom: 4 }}>วันที่ขอ</div>
                <div style={{ fontSize: 14 }}>{sel.date}</div>
              </div>
            </div>
            <div style={{ background: '#F4F5F7', borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="mono" style={{ fontSize: 11, color: '#6B7891' }}>จำนวนเงินที่ขอเบิก</div>
              <div className="mono" style={{ fontSize: 28, fontWeight: 700 }}>฿{sel.amount}</div>
            </div>
            {sel.note && <div style={{ marginTop: 12, padding: 12, background: '#FFFBEC', border: '1px solid #F0E0A0', borderRadius: 8, fontSize: 13, color: '#5A4200' }}>{sel.note}</div>}

            {/* Action buttons */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sel.status === 'รออนุมัติ' && (
                <button
                  onClick={() => setRecords(prev => prev.map(r => r.id === sel.id ? { ...r, status: 'อนุมัติสำเร็จ' } : r))}
                  style={{ width: '100%', padding: '11px', background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  อนุมัติรายการนี้ →
                </button>
              )}
              {sel.status === 'อนุมัติสำเร็จ' && (
                <button
                  onClick={() => setRecords(prev => prev.map(r => r.id === sel.id ? { ...r, status: 'เบิกจ่ายสำเร็จ' } : r))}
                  style={{ width: '100%', padding: '11px', background: '#1B6B3F', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ยืนยันเบิกจ่ายสำเร็จ →
                </button>
              )}
              {sel.status === 'เบิกจ่ายสำเร็จ' && (
                <div style={{ textAlign: 'center', padding: '10px', background: '#DCEFE3', borderRadius: 8, fontSize: 13, color: '#1B6B3F', fontWeight: 600 }}>
                  เบิกจ่ายสำเร็จแล้ว
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '16px 24px', flex: 1 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B7891', marginBottom: 12 }}>เอกสารแนบ · ใบเบิกเงิน</div>
            {selImg ? (
              <div>
                <div style={{ border: '1px solid #E4E8EE', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLightboxSrc(selImg)}>
                  <img src={selImg} alt="ใบเบิก" style={{ width: '100%', display: 'block', maxHeight: 380, objectFit: 'contain', background: '#F8F9FC' }} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => setLightboxSrc(selImg)} style={{ flex: 1, padding: 9, background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>ดูเต็มจอ</button>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 9, background: '#F4F5F7', color: '#38465E', border: '1px solid #E4E8EE', borderRadius: 7, fontSize: 13, cursor: 'pointer' }}>
                    เปลี่ยนไฟล์<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleExistUpload} />
                  </label>
                </div>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '36px 24px', background: '#F8F9FC', border: '2px dashed #D9DEE6', borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}>
                <UploadIcon />
                <div style={{ fontSize: 14, fontWeight: 500, color: '#38465E' }}>แนบใบเบิกเงิน</div>
                <div style={{ fontSize: 12, color: '#6B7891' }}>คลิกเพื่อเลือกไฟล์ · รองรับ JPG, PNG</div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleExistUpload} />
              </label>
            )}
          </div>
        </div>
      )}

      {/* New Expense Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,31,58,0.65)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => { setShowNew(false); resetForm() }}>
          <div style={{ background: '#FFF', borderRadius: 16, width: 620, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #E4E8EE', position: 'sticky', top: 0, background: '#FFF', borderRadius: '16px 16px 0 0' }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: '#6B7891', letterSpacing: '0.15em', marginBottom: 4 }}>NEW ADVANCE REQUEST</div>
                <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>ขอเบิกจ่ายล่วงหน้า</h2>
              </div>
              <button onClick={() => { setShowNew(false); resetForm() }} style={{ width: 32, height: 32, border: '1px solid #E4E8EE', background: '#FFF', borderRadius: 6, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <Field label="โครงการ" required><input type="text" placeholder="บ้านคุณ..." value={nfProject} onChange={e => setNfProject(e.target.value)} style={iStyle} /></Field>
                <Field label="รายการที่จะซื้อ / วัตถุประสงค์" required><input type="text" placeholder="ค่ามัดจำเหล็กเส้น..." value={nfDesc} onChange={e => setNfDesc(e.target.value)} style={iStyle} /></Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="จำนวนเงินที่ขอเบิก (บาท)" required><input type="number" placeholder="0" value={nfAmount} onChange={e => setNfAmount(e.target.value)} style={{ ...iStyle, fontFamily: "'IBM Plex Mono', monospace" }} /></Field>
                  <Field label="วันที่ขอเบิก"><input type="date" value={nfDate} onChange={e => setNfDate(e.target.value)} style={iStyle} /></Field>
                </div>
                <Field label="หมายเหตุเพิ่มเติม"><textarea rows={2} placeholder="รายละเอียดเพิ่มเติม..." value={nfNote} onChange={e => setNfNote(e.target.value)} style={{ ...iStyle, resize: 'vertical' }} /></Field>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>แนบใบเบิกเงิน <span style={{ fontSize: 12, color: '#6B7891', fontWeight: 400 }}>รองรับ JPG, PNG</span></div>
                {nfImg ? (
                  <div>
                    <div style={{ border: '1px solid #E4E8EE', borderRadius: 8, overflow: 'hidden' }}><img src={nfImg} alt="preview" style={{ width: '100%', maxHeight: 280, objectFit: 'contain', background: '#F8F9FC', display: 'block' }} /></div>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '8px 14px', background: '#F4F5F7', border: '1px solid #E4E8EE', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#38465E' }}>เปลี่ยนไฟล์<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewUpload} /></label>
                  </div>
                ) : (
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '32px 24px', background: '#F8F9FC', border: '2px dashed #D9DEE6', borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}>
                    <UploadIconLg />
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#38465E' }}>คลิกเพื่อแนบใบเบิกเงิน</div>
                    <div style={{ fontSize: 12, color: '#6B7891' }}>ลากวางหรือกดเพื่อเลือกไฟล์ · JPG, PNG</div>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewUpload} />
                  </label>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => { setShowNew(false); resetForm() }} style={{ padding: '12px 24px', background: '#FFF', color: '#38465E', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>ยกเลิก</button>
                <button onClick={submitNew} style={{ padding: '12px 28px', background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>ส่งคำขอ →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }} onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="" style={{ maxWidth: '92vw', maxHeight: '92vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }} />
          <button style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFF', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxSrc(null)}>×</button>
        </div>
      )}
    </div>
  )
}

function ExpRow({ r, isSelected, st, hasDoc, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '108px 1fr 200px 120px 138px 28px', borderTop: '1px solid #E4E8EE', cursor: 'pointer', background: isSelected ? '#EEF2FA' : hovered ? '#F8F9FC' : '#FFF' }} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="mono" style={{ padding: '14px 20px', fontSize: 12, color: '#6B7891' }}>{r.date}</div>
      <div style={{ padding: '14px 16px', fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.project}</div>
      <div style={{ padding: '14px 16px', fontSize: 13, color: '#38465E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</div>
      <div className="mono" style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>฿{r.amount}</div>
      <div style={{ padding: '14px 16px' }}><span style={{ padding: '4px 10px', background: st.bg, color: st.color, fontSize: 12, borderRadius: 999, whiteSpace: 'nowrap' }}>{r.status}</span></div>
      <div style={{ padding: '14px 4px', display: 'flex', alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: hasDoc ? '#1B6B3F' : '#D9DEE6', display: 'inline-block' }} /></div>
    </div>
  )
}

function SummaryCard({ label, value, sub, dark }) {
  return (
    <div style={{ background: dark ? '#0B1F3A' : '#FFF', color: dark ? '#FFF' : '#0B1F3A', border: dark ? 'none' : '1px solid #E4E8EE', borderRadius: 10, padding: '18px 20px' }}>
      <div className="mono" style={{ fontSize: 10, color: dark ? '#8FA0BD' : '#6B7891', letterSpacing: '0.12em', marginBottom: 8 }}>{label}</div>
      <div className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: dark ? '#B8C4DA' : '#6B7891', marginTop: 4 }}>{sub}</div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}{required && <span style={{ color: '#E05B4E' }}> *</span>}</label>
      {children}
    </div>
  )
}

function UploadIcon() {
  return <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#E4E8EE"/><path d="M20 12v12M14 18l6-6 6 6" stroke="#6B7891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 28h16" stroke="#6B7891" strokeWidth="2" strokeLinecap="round"/></svg>
}
function UploadIconLg() {
  return <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><rect width="44" height="44" rx="10" fill="#E4E8EE"/><path d="M22 13v13M16 19l6-6 6 6" stroke="#6B7891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 31h18" stroke="#6B7891" strokeWidth="2" strokeLinecap="round"/></svg>
}

const iStyle = { width: '100%', padding: '11px 14px', border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none' }
