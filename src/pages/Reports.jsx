import { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  serverTimestamp, orderBy, query,
} from 'firebase/firestore'

export default function Reports() {
  const [projects, setProjects] = useState([])
  const [showAddProject, setShowAddProject] = useState(false)
  const [spendModal, setSpendModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [newProject, setNewProject] = useState({ name: '', budget: '' })
  const [spendAmount, setSpendAmount] = useState('')
  const [spendNote, setSpendNote] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  async function handleAddProject(e) {
    e.preventDefault()
    if (!newProject.name || !newProject.budget) return
    const data = { name: newProject.name, budget: Number(newProject.budget), spent: 0, createdAt: serverTimestamp() }
    setNewProject({ name: '', budget: '' })
    setShowAddProject(false)
    await addDoc(collection(db, 'projects'), data)
  }

  async function handleAddSpend(e) {
    e.preventDefault()
    if (!spendAmount || !spendModal) return
    const proj = projects.find(p => p.id === spendModal)
    const newSpent = (proj.spent || 0) + Number(spendAmount)
    const id = spendModal
    setSpendAmount('')
    setSpendNote('')
    setSpendModal(null)
    await updateDoc(doc(db, 'projects', id), { spent: newSpent })
  }

  async function handleDelete() {
    if (!deleteModal) return
    const id = deleteModal
    setDeleteModal(null)
    await deleteDoc(doc(db, 'projects', id))
  }

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0)
  const totalSpent = projects.reduce((s, p) => s + (p.spent || 0), 0)
  const totalRemain = totalBudget - totalSpent

  return (
    <main style={{ padding: '32px 40px', fontFamily: "'IBM Plex Sans Thai', system-ui, sans-serif" }}>

<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#6B7891', marginBottom: 4 }}>REPORTS</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>รายงานสรุปค่าใช้จ่าย</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7891', fontSize: 14 }} />
            <input
              type="text" value={search} placeholder="ค้นหาโครงการ..."
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', width: 220 }}
            />
          </div>
          <button
            onClick={() => setShowAddProject(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#0B1F3A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            + เพิ่มโครงการ
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <SummaryCard label="งบประมาณรวมทั้งหมด" value={`฿${(totalBudget / 1e6).toFixed(2)}M`} sub={`${projects.length} โครงการ`} />
        <SummaryCard label="ใช้จริงแล้ว" value={`฿${(totalSpent / 1e6).toFixed(2)}M`} sub={totalBudget ? `${((totalSpent / totalBudget) * 100).toFixed(1)}% ของงบทั้งหมด` : '-'} />
        <SummaryCard label="เหลือใช้ได้" value={`฿${(totalRemain / 1e6).toFixed(2)}M`} sub="งบคงเหลือรวม" dark />
      </div>

      {/* Bar chart */}
      <div style={{ background: '#FFF', border: '1px solid #E4E8EE', borderRadius: 12, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>งบประมาณ vs ใช้จริง · แต่ละโครงการ</h2>
            <div style={{ fontSize: 13, color: '#6B7891', marginTop: 2 }}>อัพเดทแบบ real-time</div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, background: '#E4E8EE', borderRadius: 2, display: 'inline-block' }} />งบประมาณ
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, background: '#0B1F3A', borderRadius: 2, display: 'inline-block' }} />ใช้จริง
            </span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7891', fontSize: 14 }}>
            ยังไม่มีโครงการ กด "เพิ่มโครงการ" เพื่อเริ่มต้น
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7891', fontSize: 14 }}>
            ไม่พบโครงการที่ค้นหา
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {filtered.map(p => {
              const pct = p.budget > 0 ? Math.min((p.spent / p.budget) * 100, 100) : 0
              const over = p.spent > p.budget
              return (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ fontSize: 13, color: over ? '#EF4444' : '#6B7891' }}>
                        ฿{(p.spent || 0).toLocaleString()} / ฿{(p.budget || 0).toLocaleString()}
                      </span>
                      <button
                        onClick={() => setSpendModal(p.id)}
                        style={{ padding: '4px 12px', background: '#F4F5F7', border: '1px solid #E4E8EE', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#0B1F3A' }}
                      >
                        + บันทึกค่าใช้จ่าย
                      </button>
                      <button
                        onClick={() => setDeleteModal(p.id)}
                        style={{ padding: '4px 10px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#EF4444' }}
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: 24, background: '#F4F5F7', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#E4E8EE' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      width: `${pct}%`,
                      background: over ? '#EF4444' : '#0B1F3A',
                      transition: 'width 0.4s ease',
                    }} />
                    <span className="mono" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#6B7891' }}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal: เพิ่มโครงการ */}
      {showAddProject && (
        <Modal title="เพิ่มโครงการใหม่" onClose={() => setShowAddProject(false)}>
          <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ModalField label="ชื่อโครงการ">
              <input
                type="text" value={newProject.name} placeholder="เช่น บ้านคุณสมชาย ลาดพร้าว"
                onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
                required style={inputStyle}
              />
            </ModalField>
            <ModalField label="งบประมาณ (บาท)">
              <input
                type="number" value={newProject.budget} placeholder="เช่น 3200000"
                onChange={e => setNewProject(p => ({ ...p, budget: e.target.value }))}
                required min="1" style={inputStyle}
              />
            </ModalField>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" onClick={() => setShowAddProject(false)} style={btnSecondary}>ยกเลิก</button>
              <button type="submit" style={btnPrimary}>เพิ่มโครงการ</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: ยืนยันลบ */}
      {deleteModal && (
        <Modal title="ลบโครงการ" onClose={() => setDeleteModal(null)}>
          <p style={{ fontSize: 14, color: '#38465E', margin: '0 0 24px' }}>
            ต้องการลบ <strong>"{projects.find(p => p.id === deleteModal)?.name}"</strong> ใช่หรือไม่?<br />
            <span style={{ color: '#EF4444', fontSize: 13 }}>การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteModal(null)} style={btnSecondary}>ยกเลิก</button>
            <button onClick={handleDelete} style={{ ...btnPrimary, background: '#EF4444' }}>ลบโครงการ</button>
          </div>
        </Modal>
      )}

      {/* Modal: บันทึกค่าใช้จ่าย */}
      {spendModal && (
        <Modal
          title={`บันทึกค่าใช้จ่าย · ${projects.find(p => p.id === spendModal)?.name}`}
          onClose={() => setSpendModal(null)}
        >
          <form onSubmit={handleAddSpend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ModalField label="จำนวนเงิน (บาท)">
              <input
                type="number" value={spendAmount} placeholder="เช่น 50000"
                onChange={e => setSpendAmount(e.target.value)}
                required min="1" style={inputStyle}
              />
            </ModalField>
            <ModalField label="หมายเหตุ (ไม่บังคับ)">
              <input
                type="text" value={spendNote} placeholder="เช่น ค่าวัสดุงวดที่ 2"
                onChange={e => setSpendNote(e.target.value)}
                style={inputStyle}
              />
            </ModalField>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" onClick={() => setSpendModal(null)} style={btnSecondary}>ยกเลิก</button>
              <button type="submit" style={btnPrimary}>บันทึก</button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#FFF', borderRadius: 16, padding: 32, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6B7891', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ModalField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#38465E' }}>{label}</label>
      {children}
    </div>
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

const inputStyle = {
  padding: '10px 14px', border: '1px solid #E4E8EE', borderRadius: 8,
  fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box',
  fontFamily: "'IBM Plex Sans Thai', system-ui, sans-serif",
}

const btnPrimary = {
  padding: '10px 20px', background: '#0B1F3A', color: '#FFF',
  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500,
  cursor: 'pointer', fontFamily: 'inherit',
}

const btnSecondary = {
  padding: '10px 20px', background: '#FFF', color: '#0B1F3A',
  border: '1px solid #E4E8EE', borderRadius: 8, fontSize: 14,
  cursor: 'pointer', fontFamily: 'inherit',
}
