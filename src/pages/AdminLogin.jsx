import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const COMPANY_ID = 'SOLID171401'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')

  const [login, setLogin] = useState({ email: '', password: '' })
  const [register, setRegister] = useState({ email: '', password: '', confirm: '', companyId: '' })
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, login.email, login.password)
      navigate('/dashboard')
    } catch (err) {
      setLoginError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setRegisterError('')
    if (register.password !== register.confirm) {
      setRegisterError('รหัสผ่านไม่ตรงกัน')
      return
    }
    if (register.companyId !== COMPANY_ID) {
      setRegisterError('Company ID ไม่ถูกต้อง')
      return
    }
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, register.email, register.password)
      navigate('/dashboard')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setRegisterError('อีเมลนี้ถูกใช้งานแล้ว')
      } else if (err.code === 'auth/weak-password') {
        setRegisterError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      } else {
        setRegisterError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#060F1E',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'IBM Plex Sans Thai', system-ui, sans-serif",
      padding: 24,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#E0A800', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0B1F3A', fontWeight: 700, fontSize: 14,
          }}>SB</div>
          <span style={{ color: '#FFF', fontWeight: 700, fontSize: 18, letterSpacing: '0.05em' }}>SOLID BUILD</span>
        </Link>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 8,
          border: '1px solid #1F3358', background: 'transparent',
          color: '#8FA0BD', fontSize: 13,
          textDecoration: 'none', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1F3358'; e.currentTarget.style.color = '#FFF' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8FA0BD' }}
        >
          ← กลับหน้าหลัก
        </Link>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        background: '#0B1F3A', borderRadius: 16,
        border: '1px solid #1F3358',
        overflow: 'hidden',
      }}>
        {/* Tab switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #1F3358' }}>
          {[
            { key: 'login', label: 'เข้าสู่ระบบ' },
            { key: 'register', label: 'สมัครสมาชิก' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setLoginError(''); setRegisterError('') }}
              style={{
                padding: '16px',
                background: tab === t.key ? '#1F3358' : 'transparent',
                color: tab === t.key ? '#FFF' : '#8FA0BD',
                border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: tab === t.key ? 600 : 400,
                borderBottom: tab === t.key ? '2px solid #E0A800' : '2px solid transparent',
                transition: 'all 0.15s',
                fontFamily: "'IBM Plex Sans Thai', system-ui, sans-serif",
              }}
            >{t.label}</button>
          ))}
        </div>

        <div style={{ padding: 36 }}>
          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>ยินดีต้อนรับกลับ</div>
                <div style={{ fontSize: 13, color: '#8FA0BD' }}>เข้าสู่ระบบเพื่อจัดการโครงการและการเบิกจ่าย</div>
              </div>

              <Field label="อีเมล">
                <input
                  type="email" value={login.email} placeholder="admin@solidbuild.co.th"
                  onChange={e => setLogin(p => ({ ...p, email: e.target.value }))}
                  required style={inputStyle}
                />
              </Field>

              <Field label="รหัสผ่าน">
                <input
                  type="password" value={login.password} placeholder="••••••••"
                  onChange={e => setLogin(p => ({ ...p, password: e.target.value }))}
                  required style={inputStyle}
                />
              </Field>

              {loginError && (
                <div style={{ background: '#2D1515', border: '1px solid #5C2020', borderRadius: 8, padding: '10px 14px', color: '#F87171', fontSize: 13 }}>
                  {loginError}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#8FA0BD' }}>
                ยังไม่มีบัญชี?{' '}
                <button type="button" onClick={() => setTab('register')}
                  style={{ background: 'none', border: 'none', color: '#E0A800', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
                  สมัครสมาชิก
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>สมัครสมาชิก</div>
                <div style={{ fontSize: 13, color: '#8FA0BD' }}>ต้องมี Company ID จากบริษัทเพื่อสมัคร</div>
              </div>

              <Field label="อีเมล">
                <input
                  type="email" value={register.email} placeholder="email@example.com"
                  onChange={e => setRegister(p => ({ ...p, email: e.target.value }))}
                  required style={inputStyle}
                />
              </Field>

              <Field label="รหัสผ่าน">
                <input
                  type="password" value={register.password} placeholder="••••••••"
                  onChange={e => setRegister(p => ({ ...p, password: e.target.value }))}
                  required style={inputStyle}
                />
              </Field>

              <Field label="ยืนยันรหัสผ่าน">
                <input
                  type="password" value={register.confirm} placeholder="••••••••"
                  onChange={e => setRegister(p => ({ ...p, confirm: e.target.value }))}
                  required style={inputStyle}
                />
              </Field>

              <Field label="Company ID">
                <input
                  type="text" value={register.companyId} placeholder="รหัสจากบริษัท"
                  onChange={e => setRegister(p => ({ ...p, companyId: e.target.value }))}
                  required style={inputStyle}
                />
                <div style={{ fontSize: 11, color: '#6B7891', marginTop: 4 }}>
                  รหัสนี้ออกโดยบริษัท SOLID BUILD เท่านั้น
                </div>
              </Field>

              {registerError && (
                <div style={{ background: '#2D1515', border: '1px solid #5C2020', borderRadius: 8, padding: '10px 14px', color: '#F87171', fontSize: 13 }}>
                  {registerError}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
              </button>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#8FA0BD' }}>
                มีบัญชีแล้ว?{' '}
                <button type="button" onClick={() => setTab('login')}
                  style={{ background: 'none', border: 'none', color: '#E0A800', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
                  เข้าสู่ระบบ
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: '#3A537A' }}>
        Single Role · ทุก account มีสิทธิ์เท่ากัน
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, color: '#B8C4DA', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: '#060F1E', border: '1px solid #3A537A', borderRadius: 8,
  padding: '10px 14px', color: '#FFF', fontSize: 14, outline: 'none', width: '100%',
  fontFamily: "'IBM Plex Sans Thai', system-ui, sans-serif",
  boxSizing: 'border-box',
}

const btnStyle = {
  background: '#E0A800', color: '#0B1F3A', fontWeight: 700,
  padding: '12px', borderRadius: 8, fontSize: 15, border: 'none',
  cursor: 'pointer', marginTop: 4,
  fontFamily: "'IBM Plex Sans Thai', system-ui, sans-serif",
}
