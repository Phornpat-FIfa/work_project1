import { useState, useEffect, useCallback } from 'react'

const INITIAL_RECORDS = [
  {
    id: 'PO-2026-0042',
    project: 'บ้านคุณสมชาย ลาดพร้าว',
    vendor: 'โฮมโปร',
    date: '12 มิ.ย. 2026',
    total: '85,400',
    status: 'รออนุมัติ',
    note: '',
    imageSrc: null,
    items: [
      { name: 'ปูน TPI 50 kg', qty: '200', unit: 'ถุง', price: '185' },
      { name: 'เหล็กเส้น 12mm', qty: '50', unit: 'เส้น', price: '380' },
    ],
  },
  {
    id: 'PO-2026-0041',
    project: 'บ้านใหม่ ปทุมธานี',
    vendor: 'SCG Home',
    date: '12 มิ.ย. 2026',
    total: '245,000',
    status: 'อนุมัติแล้ว',
    note: 'กรุณาจัดส่งภายใน 3 วัน',
    imageSrc: null,
    items: [
      { name: 'อิฐมวลเบา AAC', qty: '5000', unit: 'ก้อน', price: '12' },
      { name: 'ปูนสำเร็จรูป', qty: '300', unit: 'ถุง', price: '300' },
    ],
  },
  {
    id: 'PO-2026-0040',
    project: 'ต่อเติมครัว คุณวิภา',
    vendor: 'ร้านวัสดุพี่นัท',
    date: '11 มิ.ย. 2026',
    total: '32,800',
    status: 'ได้รับของแล้ว',
    note: '',
    imageSrc: null,
    items: [
      { name: 'กระเบื้อง 60x60', qty: '80', unit: 'แผ่น', price: '220' },
      { name: 'กาวยาแนว', qty: '20', unit: 'ถุง', price: '280' },
    ],
  },
  {
    id: 'PO-2026-0039',
    project: 'บ้านคุณสมชาย ลาดพร้าว',
    vendor: 'ไทยวัสดุ',
    date: '10 มิ.ย. 2026',
    total: '128,500',
    status: 'รออนุมัติ',
    note: '',
    imageSrc: null,
    items: [
      { name: 'เหล็กรูปพรรณ HEA', qty: '20', unit: 'แท่ง', price: '2800' },
      { name: 'เหล็กแผ่น 6mm', qty: '10', unit: 'แผ่น', price: '5250' },
    ],
  },
]

function statusStyle(status) {
  if (status === 'รออนุมัติ') return { bg: '#FFF4D6', color: '#8A6800' }
  if (status === 'อนุมัติแล้ว') return { bg: '#E8EDF5', color: '#0B1F3A' }
  return { bg: '#DCEFE3', color: '#1B6B3F' }
}

const TABS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'รออนุมัติ', label: 'รออนุมัติ' },
  { key: 'อนุมัติแล้ว', label: 'อนุมัติแล้ว' },
  { key: 'ได้รับของแล้ว', label: 'ได้รับของแล้ว' },
]

function mkLineTotal(qty, price) {
  const q = parseFloat(qty) || 0
  const p = parseFloat((price || '0').replace(/,/g, '')) || 0
  return q * p
}

export default function PurchaseOrders() {
  const [tab, setTab] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [uploadedImages, setUploadedImages] = useState({})
  const [records, setRecords] = useState(INITIAL_RECORDS)

  // new PO form state
  const [nfProject, setNfProject] = useState('')
  const [nfVendor, setNfVendor] = useState('')
  const [nfDate, setNfDate] = useState('')
  const [nfNote, setNfNote] = useState('')
  const [nfImg, setNfImg] = useState(null)
  const [nfItems, setNfItems] = useState([{ id: 0, name: '', qty: '1', unit: 'ชิ้น', price: '0' }])

  useEffect(() => {
    try {
      const s = localStorage.getItem('sb_po_imgs_v3')
      if (s) setUploadedImages(JSON.parse(s))
    } catch (_) {}
  }, [])

  const saveImages = useCallback((imgs) => {
    try { localStorage.setItem('sb_po_imgs_v3', JSON.stringify(imgs)) } catch (_) {}
  }, [])

  const sel = records.find(r => r.id === selectedId) || null
  const selImg = sel ? (uploadedImages[sel.id] || sel.imageSrc) : null
  const selSt = sel ? statusStyle(sel.status) : { bg: '#F4F5F7', color: '#6B7891' }

  const counts = { all: records.length }
  records.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1 })

  const filtered = tab === 'all' ? records : records.filter(r => r.status === tab)

  const grandTotal = nfItems.reduce((s, it) => s + mkLineTotal(it.qty, it.price), 0)

  function resetNewForm() {
    setNfProject(''); setNfVendor(''); setNfDate(''); setNfNote('')
    setNfImg(null)
    setNfItems([{ id: 0, name: '', qty: '1', unit: 'ชิ้น', price: '0' }])
  }

  function handleExistUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !selectedId) return
    const reader = new FileReader()
    reader.onload = ev => {
      const imgs = { ...uploadedImages, [selectedId]: ev.target.result }
      saveImages(imgs)
      setUploadedImages(imgs)
    }
    reader.readAsDataURL(file)
  }

  function handleNewUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setNfImg(ev.target.result)
    reader.readAsDataURL(file)
  }

  function submitNew() {
    const total = nfItems.reduce((s, it) => s + mkLineTotal(it.qty, it.price), 0)
    const newId = 'PO-2026-' + String(Date.now()).slice(-4)
    const rec = {
      id: newId,
      project: nfProject || 'โครงการใหม่',
      vendor: nfVendor || 'ผู้ขาย',
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      total: total.toLocaleString(),
      status: 'รออนุมัติ',
      note: nfNote,
      imageSrc: null,
      items: nfItems.map(it => ({ name: it.name, qty: it.qty, unit: it.unit, price: it.price })),
    }
    const newImgs = { ...uploadedImages }
    if (nfImg) newImgs[newId] = nfImg
    saveImages(newImgs)
    setRecords(prev => [rec, ...prev])
    setUploadedImages(newImgs)
    setShowNew(false)
    setSelectedId(newId)
    setTab('all')
    resetNewForm()
  }

  function updateNfItem(idx, field, value) {
    setNfItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it))
  }

  function removeNfItem(idx) {
    setNfItems(prev => {
      const next = prev.filter((_, i) => i !== idx)
      return next.length ? next : [{ id: Date.now(), name: '', qty: '1', unit: 'ชิ้น', price: '0' }]
    })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ── Route badge ── */}
      <div className="mono" style={{
        position: 'fixed', top: 16, right: 16, zIndex: 50,
        padding: '6px 12px', background: '#0B1F3A', color: '#FFF',
        fontSize: 11, letterSpacing: '0.1em', borderRadius: 999,
      }}>/po</div>

      {/* ── Table section ── */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0, padding: '32px 40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>
              PURCHASE ORDERS
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>ใบสั่งซื้อ</h1>
          </div>
          <button
            onClick={() => setShowNew(true)}
            style={{
              padding: '12px 20px', background: '#0B1F3A', color: '#FFF',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >+ สร้าง PO ใหม่</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 16,
          background: '#FFF', padding: 4, borderRadius: 10,
          border: '1px solid #E4E8EE', width: 'fit-content',
        }}>
          {TABS.map(t => {
            const active = tab === t.key
            const cnt = t.key === 'all' ? counts.all : (counts[t.key] || 0)
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '8px 16px',
                  background: active ? '#0B1F3A' : 'transparent',
                  color: active ? '#FFF' : '#38465E',
                  fontWeight: active ? 600 : 400,
                  border: 'none', borderRadius: 6, fontSize: 13,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >{t.label} {cnt}</button>
            )
          })}
        </div>

        {/* Table */}
        <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '148px 1fr 130px 108px 120px 138px 28px',
            background: '#F4F5F7', borderBottom: '1px solid #E4E8EE',
          }}>
            {['เลขที่ PO', 'โครงการ', 'ผู้ขาย', 'วันที่', 'ยอดรวม', 'สถานะ', ''].map((h, i) => (
              <div key={i} className="mono" style={{
                padding: i === 0 ? '12px 20px' : '12px 16px',
                fontSize: 11, fontWeight: 500, color: '#6B7891', letterSpacing: '0.1em',
                textAlign: i === 4 ? 'right' : 'left',
              }}>{h}</div>
            ))}
          </div>

          {/* Data rows */}
          {filtered.map(r => {
            const st = statusStyle(r.status)
            const isSelected = r.id === selectedId
            const hasDoc = !!(uploadedImages[r.id] || r.imageSrc)
            return (
              <PoRow
                key={r.id}
                r={r}
                isSelected={isSelected}
                st={st}
                hasDoc={hasDoc}
                onClick={() => setSelectedId(prev => prev === r.id ? null : r.id)}
              />
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: 12, color: '#6B7891' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1B6B3F', display: 'inline-block' }} />
            มีเอกสารแนบ
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D9DEE6', display: 'inline-block' }} />
            ยังไม่มี
          </span>
          <span style={{ color: '#0B1F3A', marginLeft: 4 }}>· กดแถวเพื่อดูรายละเอียด</span>
        </div>
      </div>

      {/* ── Detail Panel ── */}
      {sel && (
        <div style={{
          width: 440, minWidth: 440, borderLeft: '1px solid #E4E8EE',
          background: '#FFF', overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          {/* Sticky header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px', borderBottom: '1px solid #E4E8EE',
            position: 'sticky', top: 0, background: '#FFF', zIndex: 10,
          }}>
            <div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{sel.id}</div>
              <span style={{
                padding: '4px 12px', background: selSt.bg, color: selSt.color,
                fontSize: 12, borderRadius: 999,
              }}>{sel.status}</span>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              style={{
                width: 30, height: 30, border: '1px solid #E4E8EE',
                background: '#FFF', borderRadius: 6, cursor: 'pointer',
                fontSize: 16, lineHeight: 1,
              }}
            >×</button>
          </div>

          {/* Info grid */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F4F5F7' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <InfoField label="โครงการ" value={sel.project} />
              <InfoField label="ผู้ขาย" value={sel.vendor} />
              <InfoField label="วันที่สั่งซื้อ" value={sel.date} />
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B7891', marginBottom: 4 }}>ยอดรวม</div>
                <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>฿{sel.total}</div>
              </div>
            </div>
            {sel.note && (
              <div style={{ marginTop: 12, padding: 12, background: '#F4F5F7', borderRadius: 8, fontSize: 13, color: '#38465E' }}>
                {sel.note}
              </div>
            )}
          </div>

          {/* Line items */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #F4F5F7' }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B7891', marginBottom: 10 }}>รายการสินค้า</div>
            {sel.items.map((it, i) => {
              const lt = mkLineTotal(it.qty, it.price)
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '8px 0', borderBottom: '1px dashed #F0F2F5',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: '#6B7891', marginTop: 2 }}>
                      {it.qty} {it.unit} × ฿{Number(it.price).toLocaleString()}
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', paddingLeft: 12 }}>
                    ฿{lt.toLocaleString()}
                  </div>
                </div>
              )
            })}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>รวมทั้งสิ้น</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>฿{sel.total}</div>
            </div>
          </div>

          {/* Document attachment */}
          <div style={{ padding: '16px 24px', flex: 1 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B7891', marginBottom: 12 }}>
              เอกสารแนบ · ใบสั่งซื้อ
            </div>
            {selImg ? (
              <div>
                <div
                  style={{ border: '1px solid #E4E8EE', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => setLightboxSrc(selImg)}
                >
                  <img src={selImg} alt="ใบสั่งซื้อ" style={{ width: '100%', display: 'block', maxHeight: 360, objectFit: 'contain', background: '#F8F9FC' }} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button
                    onClick={() => setLightboxSrc(selImg)}
                    style={{
                      flex: 1, padding: 9, background: '#0B1F3A', color: '#FFF',
                      border: 'none', borderRadius: 7, fontSize: 13,
                      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                    }}
                  >ดูเต็มจอ</button>
                  <label style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 9, background: '#F4F5F7', color: '#38465E',
                    border: '1px solid #E4E8EE', borderRadius: 7,
                    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    เปลี่ยนไฟล์
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleExistUpload} />
                  </label>
                </div>
              </div>
            ) : (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 10, padding: '36px 24px',
                background: '#F8F9FC', border: '2px dashed #D9DEE6',
                borderRadius: 10, cursor: 'pointer', textAlign: 'center',
              }}>
                <UploadIcon />
                <div style={{ fontSize: 14, fontWeight: 500, color: '#38465E' }}>แนบใบสั่งซื้อ</div>
                <div style={{ fontSize: 12, color: '#6B7891' }}>คลิกเพื่อเลือกไฟล์ · รองรับ JPG, PNG</div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleExistUpload} />
              </label>
            )}
          </div>
        </div>
      )}

      {/* ── New PO Modal ── */}
      {showNew && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(11,31,58,0.65)',
            zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
          onClick={() => { setShowNew(false); resetNewForm() }}
        >
          <div
            style={{
              background: '#FFF', borderRadius: 16, width: 740,
              maxHeight: '88vh', overflowY: 'auto',
              boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '24px 28px', borderBottom: '1px solid #E4E8EE',
              position: 'sticky', top: 0, background: '#FFF', zIndex: 10,
              borderRadius: '16px 16px 0 0',
            }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: '#6B7891', letterSpacing: '0.15em', marginBottom: 4 }}>
                  NEW PURCHASE ORDER
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>สร้างใบสั่งซื้อใหม่</h2>
              </div>
              <button
                onClick={() => { setShowNew(false); resetNewForm() }}
                style={{
                  width: 32, height: 32, border: '1px solid #E4E8EE',
                  background: '#FFF', borderRadius: 6, cursor: 'pointer', fontSize: 18, lineHeight: 1,
                }}
              >×</button>
            </div>

            <div style={{ padding: 28 }}>
              {/* Basic fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    โครงการ <span style={{ color: '#E05B4E' }}>*</span>
                  </label>
                  <input
                    type="text" placeholder="บ้านคุณ..."
                    value={nfProject} onChange={e => setNfProject(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    ชื่อผู้ขาย / ร้านค้า <span style={{ color: '#E05B4E' }}>*</span>
                  </label>
                  <input
                    type="text" placeholder="ร้านค้า..."
                    value={nfVendor} onChange={e => setNfVendor(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>วันที่สั่งซื้อ</label>
                  <input
                    type="date" value={nfDate} onChange={e => setNfDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>หมายเหตุ</label>
                  <input
                    type="text" placeholder="หมายเหตุ..."
                    value={nfNote} onChange={e => setNfNote(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Line items */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>รายการสินค้า</div>
                  <button
                    onClick={() => setNfItems(prev => [...prev, { id: Date.now(), name: '', qty: '1', unit: 'ชิ้น', price: '0' }])}
                    style={{
                      padding: '7px 14px', background: '#F4F5F7', color: '#0B1F3A',
                      border: '1px solid #E4E8EE', borderRadius: 6, fontSize: 13,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >+ เพิ่มรายการ</button>
                </div>

                {/* Column headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 1fr 68px 64px 88px 76px 24px',
                  gap: 6, paddingBottom: 8, borderBottom: '1px solid #E4E8EE', marginBottom: 6,
                }}>
                  {['#', 'ชื่อสินค้า', 'จำนวน', 'หน่วย', 'ราคา/หน่วย', 'รวม', ''].map((h, i) => (
                    <div key={i} style={{
                      fontSize: 11, color: '#6B7891',
                      textAlign: [2, 4, 5].includes(i) ? 'right' : 'left',
                    }}>{h}</div>
                  ))}
                </div>

                {nfItems.map((item, idx) => {
                  const lt = mkLineTotal(item.qty, item.price)
                  return (
                    <div key={item.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '24px 1fr 68px 64px 88px 76px 24px',
                      gap: 6, marginBottom: 6, alignItems: 'center',
                    }}>
                      <div style={{ fontSize: 12, color: '#6B7891', textAlign: 'center' }}>{idx + 1}</div>
                      <input type="text" placeholder="ชื่อสินค้า" value={item.name}
                        onChange={e => updateNfItem(idx, 'name', e.target.value)} style={cellInputStyle} />
                      <input type="text" placeholder="1" value={item.qty}
                        onChange={e => updateNfItem(idx, 'qty', e.target.value)}
                        style={{ ...cellInputStyle, textAlign: 'right' }} />
                      <input type="text" placeholder="ชิ้น" value={item.unit}
                        onChange={e => updateNfItem(idx, 'unit', e.target.value)} style={cellInputStyle} />
                      <input type="text" placeholder="0" value={item.price}
                        onChange={e => updateNfItem(idx, 'price', e.target.value)}
                        style={{ ...cellInputStyle, textAlign: 'right' }} />
                      <div className="mono" style={{ fontSize: 13, fontWeight: 500, textAlign: 'right', color: '#0B1F3A' }}>
                        {lt ? '฿' + lt.toLocaleString() : '฿0'}
                      </div>
                      <button
                        onClick={() => removeNfItem(idx)}
                        style={{
                          width: 24, height: 24, border: '1px solid #E4E8EE',
                          background: '#FFF', borderRadius: 4, cursor: 'pointer',
                          fontSize: 14, color: '#6B7891', padding: 0,
                        }}
                      >×</button>
                    </div>
                  )
                })}

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #E4E8EE', marginTop: 6 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#6B7891', marginBottom: 2 }}>ยอดรวมทั้งสิ้น</div>
                    <div className="mono" style={{ fontSize: 26, fontWeight: 700 }}>
                      ฿{grandTotal ? grandTotal.toLocaleString() : '0'}
                    </div>
                  </div>
                </div>
              </div>

              {/* File upload */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  แนบใบสั่งซื้อ{' '}
                  <span style={{ fontSize: 12, color: '#6B7891', fontWeight: 400 }}>รองรับ JPG, PNG</span>
                </div>
                {nfImg ? (
                  <div>
                    <div style={{ border: '1px solid #E4E8EE', borderRadius: 8, overflow: 'hidden' }}>
                      <img src={nfImg} alt="preview" style={{ width: '100%', maxHeight: 280, objectFit: 'contain', background: '#F8F9FC', display: 'block' }} />
                    </div>
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      marginTop: 8, padding: '8px 14px', background: '#F4F5F7',
                      border: '1px solid #E4E8EE', borderRadius: 6,
                      fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#38465E',
                    }}>
                      เปลี่ยนไฟล์
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewUpload} />
                    </label>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: 10, padding: '32px 24px',
                    background: '#F8F9FC', border: '2px dashed #D9DEE6',
                    borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                  }}>
                    <UploadIconLg />
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#38465E' }}>คลิกเพื่อแนบใบสั่งซื้อ</div>
                    <div style={{ fontSize: 12, color: '#6B7891' }}>ลากวางไฟล์หรือกดเพื่อเลือก · JPG, PNG</div>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewUpload} />
                  </label>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setShowNew(false); resetNewForm() }}
                  style={{
                    padding: '12px 24px', background: '#FFF', color: '#38465E',
                    border: '1px solid #E4E8EE', borderRadius: 8,
                    fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >ยกเลิก</button>
                <button
                  onClick={submitNew}
                  style={{
                    padding: '12px 28px', background: '#0B1F3A', color: '#FFF',
                    border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >สร้าง PO →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxSrc && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt="ใบสั่งซื้อเต็มจอ"
            style={{
              maxWidth: '92vw', maxHeight: '92vh', objectFit: 'contain',
              borderRadius: 8, boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            }}
          />
          <button
            style={{
              position: 'absolute', top: 20, right: 20,
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#FFF', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setLightboxSrc(null)}
          >×</button>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──

function PoRow({ r, isSelected, st, hasDoc, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="row-hover"
      style={{
        display: 'grid',
        gridTemplateColumns: '148px 1fr 130px 108px 120px 138px 28px',
        borderTop: '1px solid #E4E8EE',
        cursor: 'pointer',
        background: isSelected ? '#EEF2FA' : hovered ? '#F8F9FC' : '#FFF',
        minWidth: 0,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mono" style={{ padding: '14px 20px', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.id}</div>
      <div style={{ padding: '14px 16px', fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.project}</div>
      <div style={{ padding: '14px 16px', fontSize: 13, color: '#38465E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.vendor}</div>
      <div className="mono" style={{ padding: '14px 16px', fontSize: 12, color: '#6B7891', whiteSpace: 'nowrap' }}>{r.date}</div>
      <div className="mono" style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, textAlign: 'right' }}>฿{r.total}</div>
      <div style={{ padding: '14px 16px' }}>
        <span style={{
          padding: '4px 10px', background: st.bg, color: st.color,
          fontSize: 12, borderRadius: 999, whiteSpace: 'nowrap',
        }}>{r.status}</span>
      </div>
      <div style={{ padding: '14px 4px', display: 'flex', alignItems: 'center' }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: hasDoc ? '#1B6B3F' : '#D9DEE6',
          display: 'inline-block',
        }} />
      </div>
    </div>
  )
}

function InfoField({ label, value }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B7891', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{value}</div>
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#E4E8EE" />
      <path d="M20 12v12M14 18l6-6 6 6" stroke="#6B7891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 28h16" stroke="#6B7891" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function UploadIconLg() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="10" fill="#E4E8EE" />
      <path d="M22 13v13M16 19l6-6 6 6" stroke="#6B7891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 31h18" stroke="#6B7891" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1px solid #E4E8EE', borderRadius: 8,
  fontSize: 14, fontFamily: 'inherit',
  outline: 'none',
}

const cellInputStyle = {
  padding: '8px 8px', border: '1px solid #E4E8EE',
  borderRadius: 6, fontSize: 13, fontFamily: 'inherit', width: '100%',
  outline: 'none',
}
