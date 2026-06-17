import { useState } from 'react'
import { Link } from 'react-router-dom'

const SERVICES = [
  {
    icon: '🏠',
    title: 'สร้างบ้านใหม่',
    desc: 'รับสร้างบ้านพักอาศัยทุกแบบ ควบคุมคุณภาพทุกขั้นตอน ด้วยทีมช่างมืออาชีพ',
  },
  {
    icon: '🔨',
    title: 'ต่อเติม',
    desc: 'ต่อเติมห้อง ระเบียง ครัว หรือพื้นที่ใช้สอย ออกแบบให้กลมกลืนกับโครงสร้างเดิม',
  },
  {
    icon: '✨',
    title: 'รีโนเวท',
    desc: 'ปรับปรุงซ่อมแซมบ้านเก่าให้ดูใหม่ เปลี่ยนสไตล์ตามที่ต้องการ ราคาคุ้มค่า',
  },
]

const BUDGET_OPTIONS = [
  'ต่ำกว่า 500,000 บาท',
  '500,000 – 1,000,000 บาท',
  '1,000,000 – 3,000,000 บาท',
  '3,000,000 – 5,000,000 บาท',
  'มากกว่า 5,000,000 บาท',
]

const STYLE_OPTIONS = ['โมเดิร์น', 'คลาสสิก', 'ลอฟท์', 'อื่นๆ']
const WORK_OPTIONS = ['สร้างใหม่', 'ต่อเติม', 'รีโนเวท']

export default function Home() {
  const [form, setForm] = useState({
    name: '', phone: '', workType: '', style: '', budget: '', detail: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Thai', system-ui, sans-serif", color: '#0B1F3A' }}>
      {/* Navbar */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(11,31,58,0.95)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: '#E0A800', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0B1F3A', fontWeight: 700, fontSize: 13,
          }}>SB</div>
          <span style={{ color: '#FFF', fontWeight: 700, fontSize: 16, letterSpacing: '0.05em' }}>SOLID BUILD</span>
        </div>
        {/* <nav style={{ display: 'flex', gap: 32 }}>
          {['บริการ', 'ผลงาน', 'ติดต่อเรา'].map(item => (
            <a key={item} href={`#${item}`} style={{
              color: '#B8C4DA', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#FFF'}
              onMouseLeave={e => e.target.style.color = '#B8C4DA'}
            >{item}</a>
          ))}
        </nav> */}
        <Link to="/admin" style={{
          background: '#E0A800', color: '#0B1F3A', fontWeight: 600,
          padding: '8px 20px', borderRadius: 6, fontSize: 14, textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span>🔐</span> เข้าสู่ระบบ Admin
        </Link>
      </header>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0B1F3A 0%, #1F3358 40%, #162840 70%, #0A1828 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative grid lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(#FFF 1px, transparent 1px), linear-gradient(90deg, #FFF 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* accent bar */}
        <div style={{
          position: 'absolute', left: 0, top: '20%', width: 4, height: '60%',
          background: 'linear-gradient(180deg, transparent, #E0A800, transparent)',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 48px 80px', position: 'relative' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11, letterSpacing: '0.25em', color: '#E0A800', marginBottom: 20,
          }}>SOLID BUILD · รับเหมาก่อสร้าง</div>

          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 700, color: '#FFF',
            lineHeight: 1.15, margin: '0 0 24px', letterSpacing: '-0.02em',
          }}>
            สร้างด้วยมาตรฐาน<br />
            <span style={{ color: '#E0A800' }}>มั่นคงทุกงาน</span>
          </h1>

          <p style={{
            fontSize: 18, color: '#B8C4DA', maxWidth: 520,
            lineHeight: 1.7, margin: '0 0 40px',
          }}>
            บริษัทรับเหมาก่อสร้างมืออาชีพ ครอบคลุมทุกบริการ ตั้งแต่สร้างบ้านใหม่
            ต่อเติม จนถึงรีโนเวท ด้วยทีมช่างที่มีประสบการณ์มากกว่า 15 ปี
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#contact" style={{
              background: '#E0A800', color: '#0B1F3A', fontWeight: 700,
              padding: '14px 32px', borderRadius: 8, fontSize: 16, textDecoration: 'none',
              display: 'inline-block',
            }}>ปรึกษาฟรี ไม่มีค่าใช้จ่าย</a>
            <a href="#services" style={{
              border: '1px solid #3A537A', color: '#B8C4DA',
              padding: '14px 32px', borderRadius: 8, fontSize: 16, textDecoration: 'none',
              display: 'inline-block',
            }}>ดูบริการของเรา</a>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 48, marginTop: 64, paddingTop: 40, borderTop: '1px solid #1F3358' }}>
            {[
              { num: '200+', label: 'โครงการที่เสร็จสมบูรณ์' },
              { num: '15+', label: 'ปีประสบการณ์' },
              { num: '98%', label: 'ลูกค้าพึงพอใจ' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#FFF' }}>{s.num}</div>
                <div style={{ fontSize: 13, color: '#8FA0BD', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="บริการ" style={{ padding: '80px 48px', background: '#F4F5F7' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, letterSpacing: '0.2em', color: '#6B7891', marginBottom: 12,
            }}>SERVICES</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>บริการของเรา</h2>
            <p style={{ color: '#6B7891', marginTop: 12, fontSize: 16 }}>
              ครอบคลุมทุกความต้องการด้านการก่อสร้าง
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{
                background: '#FFF', borderRadius: 16, padding: 32,
                border: '1px solid #E4E8EE',
                transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(11,31,58,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{
                  width: 52, height: 52, background: '#0B1F3A', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 20,
                }}>{s.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 12px' }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: '#6B7891', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                <div style={{
                  marginTop: 24, height: 3, width: 40, borderRadius: 999,
                  background: '#E0A800',
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company intro */}
      <section id="ผลงาน" style={{ padding: '80px 48px', background: '#FFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, letterSpacing: '0.2em', color: '#6B7891', marginBottom: 12,
            }}>ABOUT US</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 20px' }}>
              ทำไมต้องเลือก<br />SOLID BUILD?
            </h2>
            <p style={{ fontSize: 16, color: '#38465E', lineHeight: 1.8, margin: '0 0 32px' }}>
              เราคือบริษัทรับเหมาก่อสร้างที่มุ่งเน้นคุณภาพและความซื่อสัตย์
              ทุกโครงการดำเนินการด้วยวัสดุคุณภาพสูง ทีมช่างมืออาชีพ
              และการควบคุมงานอย่างเข้มงวด เพื่อให้บ้านของคุณ
              มั่นคงและสวยงามอย่างที่ใจต้องการ
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'ประเมินราคาฟรี ไม่มีค่าใช้จ่าย',
                'วัสดุคุณภาพ พร้อมรับประกัน',
                'ทีมช่างประสบการณ์มากกว่า 15 ปี',
                'ส่งมอบงานตรงเวลา มีสัญญาชัดเจน',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, background: '#E0A800', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: '#0B1F3A', fontWeight: 700, flexShrink: 0,
                  }}>✓</div>
                  <span style={{ fontSize: 15, color: '#38465E' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual placeholder for project images */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'สร้างบ้านใหม่', bg: '#0B1F3A' },
              { label: 'ต่อเติม', bg: '#1F3358' },
              { label: 'รีโนเวท', bg: '#162840' },
              { label: 'ครบจบที่เดียว', bg: '#243C63' },
            ].map((item, i) => (
              <div key={i} style={{
                background: item.bg, borderRadius: 12,
                aspectRatio: '4/3', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <div style={{ fontSize: 28 }}>🏗️</div>
                <div style={{ fontSize: 12, color: '#8FA0BD' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section id="contact" style={{ padding: '80px 48px', background: '#0B1F3A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, letterSpacing: '0.2em', color: '#E0A800', marginBottom: 12,
            }}>ติดต่อเรา</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#FFF', margin: '0 0 12px' }}>
              ปรึกษาฟรี ไม่มีข้อผูกมัด
            </h2>
            <p style={{ color: '#8FA0BD', fontSize: 16, margin: 0 }}>
              กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
            </p>
          </div>

          {submitted ? (
            <div style={{
              background: '#1F3358', borderRadius: 16, padding: 48, textAlign: 'center',
              border: '1px solid #3A537A',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ color: '#FFF', fontSize: 22, margin: '0 0 12px' }}>ส่งข้อมูลเรียบร้อยแล้ว!</h3>
              <p style={{ color: '#8FA0BD', margin: 0, fontSize: 15 }}>
                ทีมงานจะติดต่อกลับคุณภายใน 24 ชั่วโมง
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              background: '#1F3358', borderRadius: 16, padding: 40,
              border: '1px solid #3A537A', display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <FormField label="ชื่อ-นามสกุล" required>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="สมชาย ใจดี" required
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="เบอร์โทรศัพท์" required>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="08x-xxx-xxxx" required
                    style={inputStyle}
                  />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <FormField label="ประเภทงาน" required>
                  <select name="workType" value={form.workType} onChange={handleChange} required style={inputStyle}>
                    <option value="">เลือกประเภทงาน</option>
                    {WORK_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </FormField>
                <FormField label="สไตล์บ้าน">
                  <select name="style" value={form.style} onChange={handleChange} style={inputStyle}>
                    <option value="">เลือกสไตล์</option>
                    {STYLE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </FormField>
              </div>

              <FormField label="งบประมาณโดยประมาณ">
                <select name="budget" value={form.budget} onChange={handleChange} style={inputStyle}>
                  <option value="">เลือกช่วงงบประมาณ</option>
                  {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="รายละเอียดเพิ่มเติม">
                <textarea
                  name="detail" value={form.detail} onChange={handleChange}
                  placeholder="บอกเล่าความต้องการของคุณ เช่น ขนาดพื้นที่ รายละเอียดงาน..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                />
              </FormField>

              <button type="submit" style={{
                background: '#E0A800', color: '#0B1F3A', fontWeight: 700,
                padding: '14px', borderRadius: 8, fontSize: 16, border: 'none',
                cursor: 'pointer', marginTop: 4,
              }}>
                ส่งข้อมูล ขอรับการติดต่อ
              </button>

              <p style={{ color: '#8FA0BD', fontSize: 12, textAlign: 'center', margin: 0 }}>
                ข้อมูลของคุณจะถูกเก็บเป็นความลับ ไม่มีการนำไปใช้เพื่อวัตถุประสงค์อื่น
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="ติดต่อเรา" style={{
        background: '#060F1E', color: '#8FA0BD',
        padding: '48px', borderTop: '1px solid #1F3358',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, background: '#E0A800', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0B1F3A', fontWeight: 700, fontSize: 13,
              }}>SB</div>
              <span style={{ color: '#FFF', fontWeight: 700, fontSize: 16 }}>SOLID BUILD</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 300 }}>
              บริษัทรับเหมาก่อสร้างมืออาชีพ ด้วยประสบการณ์มากกว่า 15 ปี
              ครอบคลุมทุกบริการก่อสร้าง ตั้งแต่สร้างบ้านใหม่จนถึงรีโนเวท
            </p>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div>📞 062-xxx-xxxx</div>
              <div>📍 กรุงเทพมหานคร ประเทศไทย</div>
              <div>✉️ info@solidbuild.co.th</div>
            </div>
          </div>

          <div>
            <div style={{ color: '#FFF', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>บริการ</div>
            {['สร้างบ้านใหม่', 'ต่อเติม', 'รีโนเวท', 'ประเมินราคาฟรี'].map(item => (
              <div key={item} style={{ fontSize: 14, marginBottom: 8 }}>{item}</div>
            ))}
          </div>

          <div>
            <div style={{ color: '#FFF', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>ติดตามเรา</div>
            {['Facebook: SOLID BUILD', 'LINE: @solidbuild', 'YouTube: SOLID BUILD'].map(item => (
              <div key={item} style={{ fontSize: 14, marginBottom: 8 }}>{item}</div>
            ))}
          </div>
        </div>

        <div style={{
          maxWidth: 1200, margin: '32px auto 0',
          paddingTop: 24, borderTop: '1px solid #1F3358',
          display: 'flex', justifyContent: 'space-between', fontSize: 12,
        }}>
          <span>© 2026 SOLID BUILD. สงวนลิขสิทธิ์ทุกประการ</span>
          <Link to="/admin" style={{ color: '#3A537A', textDecoration: 'none' }}>เข้าสู่ระบบ Admin</Link>
        </div>
      </footer>
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, color: '#B8C4DA', fontWeight: 500 }}>
        {label}{required && <span style={{ color: '#E0A800', marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: '#0B1F3A', border: '1px solid #3A537A', borderRadius: 8,
  padding: '10px 14px', color: '#FFF', fontSize: 14, outline: 'none',
  width: '100%',
}
