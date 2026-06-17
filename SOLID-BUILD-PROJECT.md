# SOLID BUILD — Web Application Project

> ระบบจัดการโครงการก่อสร้างและหน้าเว็บบริษัทสำหรับ SOLID BUILD

---

## 1. ภาพรวมโครงการ

SOLID BUILD Web Application คือระบบที่ประกอบด้วย 2 ส่วนหลัก

| ส่วน | คำอธิบาย |
|------|-----------|
| **หน้าเว็บบริษัท (Public)** | หน้าแรกสำหรับลูกค้าทั่วไป แสดงบริการ ผลงาน และฟอร์มขอรับคำปรึกษา |
| **ระบบ Admin (Private)** | หลังบ้านสำหรับทีมงาน จัดการโครงการ ใบสั่งซื้อ การเบิกจ่าย และ Lead ลูกค้า |

---

## 2. Tech Stack

| เทคโนโลยี | บทบาท |
|-----------|--------|
| **React 18** | Frontend framework |
| **Vite** | Build tool / Dev server (รันด้วย `npm run dev`) |
| **React Router v7** | จัดการ routing ระหว่างหน้า |
| **Firebase Authentication** | ระบบ Login / Register จริง เก็บข้อมูลบน cloud |
| **Git + GitHub** | Version control และ collaboration ของทีม |

---

## 3. โครงสร้างโปรเจกต์

```
work_project1_team/
├── src/
│   ├── firebase.js              ← Firebase config
│   ├── App.jsx                  ← Routing หลัก
│   ├── main.jsx                 ← Entry point
│   ├── index.css
│   ├── components/
│   │   ├── AdminShell.jsx       ← Sidebar navigation ของ Admin
│   │   └── PlaceholderPage.jsx
│   └── pages/
│       ├── Home.jsx             ← หน้าแรก (Public)
│       ├── AdminLogin.jsx       ← Login / Register Admin
│       ├── Dashboard.jsx        ← ภาพรวมระบบ
│       ├── Projects.jsx         ← จัดการโครงการ
│       ├── PurchaseOrders.jsx   ← ใบสั่งซื้อ (PO)
│       ├── Expenses.jsx         ← เบิกจ่าย
│       ├── Reports.jsx          ← รายงานสรุป
│       ├── History.jsx          ← ประวัติการทำรายการ
│       └── Leads.jsx            ← Lead ลูกค้า
├── package.json
├── vite.config.js
└── index.html
```

---

## 4. หน้าต่างๆ และ Route

### Public

| Route | หน้า | คำอธิบาย |
|-------|------|-----------|
| `/` | Home | หน้าแรกบริษัท แสดงบริการ ผลงาน และฟอร์มขอปรึกษา |
| `/admin` | AdminLogin | หน้า Login / Register สำหรับทีมงาน |

### Admin (ต้อง Login ก่อน)

| Route | หน้า | คำอธิบาย |
|-------|------|-----------|
| `/dashboard` | Dashboard | ภาพรวม — โครงการ, PO รออนุมัติ, เบิกจ่าย, Lead ใหม่ |
| `/projects` | Projects | รายการโครงการทั้งหมด พร้อมค้นหาและกรอง |
| `/po` | PurchaseOrders | ใบสั่งซื้อ |
| `/expenses` | Expenses | รายการเบิกจ่าย |
| `/reports` | Reports | รายงานสรุป |
| `/history` | History | ประวัติการทำรายการ |
| `/leads` | Leads | Lead ลูกค้าที่สนใจ |

---

## 5. ระบบ Authentication (Firebase)

### วิธีสมัครสมาชิก (ทีมงานใหม่ทำครั้งแรก)

1. เปิดเบราเซอร์ไปที่ `http://localhost:5173/admin`
2. เลือกแท็บ **"สมัครสมาชิก"**
3. กรอกข้อมูลให้ครบ:

   | ช่อง | ข้อมูลที่กรอก |
   |------|--------------|
   | อีเมล | อีเมลของคุณ เช่น `name@email.com` |
   | รหัสผ่าน | อย่างน้อย 6 ตัวอักษร |
   | ยืนยันรหัสผ่าน | กรอกรหัสผ่านซ้ำ |
   | Company ID | `SOLID171401` |

4. กด **"สมัครสมาชิก"** → ระบบจะสร้าง account และเข้า Dashboard ทันที
5. ครั้งถัดไปใช้ **"เข้าสู่ระบบ"** ด้วย email + password เดิมได้เลย

> สมัครได้จากทุกเครื่อง account จะถูกบันทึกบน Firebase Cloud

---

### วิธีเข้าสู่ระบบ

1. เปิด `http://localhost:5173/admin`
2. เลือกแท็บ **"เข้าสู่ระบบ"**
3. กรอก Email และ Password ที่สมัครไว้
4. กด **"เข้าสู่ระบบ"**
   - ถูกต้อง → เข้า Dashboard
   - ผิด → ขึ้น error "อีเมลหรือรหัสผ่านไม่ถูกต้อง"

---

### ID สำคัญของระบบ

| ID / รหัส | ค่า | ใช้ตรงไหน |
|-----------|-----|-----------|
| **Company ID** | `SOLID171401` | กรอกตอนสมัครสมาชิกครั้งแรก |
| **Firebase Project ID** | `solid-build-105e0` | ใช้ในการตั้งค่า Firebase |
| **Firebase Region** | `asia-southeast1` (Singapore) | ที่เก็บข้อมูล |
| **GitHub Repository** | `Phornpat-FIfa/work_project1` | source code ของทีม |

---

### หมายเหตุ Company ID
- ใช้สำหรับกรองให้เฉพาะทีมงานสมัครได้ คนนอกที่ไม่รู้ ID จะสมัครไม่ได้
- กำหนดไว้ใน `src/pages/AdminLogin.jsx` → `const COMPANY_ID = 'SOLID171401'`
- ถ้าต้องการเปลี่ยน ID ในอนาคต แก้ค่านี้แล้ว push ขึ้น GitHub

---

### Firebase Project
- Project: `solid-build-105e0`
- Region: `asia-southeast1` (Singapore)
- Service ที่ใช้: **Authentication (Email/Password)**
- จัดการ user ได้ที่: [console.firebase.google.com](https://console.firebase.google.com) → Authentication → Users

---

## 6. การทำงานเป็นทีม (Git Workflow)

### Repository
```
https://github.com/Phornpat-FIfa/work_project1.git
```

### ขั้นตอนทำงานร่วมกัน

```
1. ดึงโค้ดล่าสุดจากทีม
   git pull

2. แก้ไขโค้ด

3. บันทึกและส่งขึ้น
   git add .
   git commit -m "อธิบายสิ่งที่เปลี่ยน"
   git push

4. ทีมคนอื่น pull มาใช้ต่อ
   git pull
```

> Vite มี Hot Reload — ไฟล์ที่แก้จะอัปเดตในเบราเซอร์อัตโนมัติ **แต่เฉพาะในเครื่องตัวเอง** ทีมต้องทำ `git pull` เสมอเพื่อรับโค้ดใหม่

---

## 7. วิธีรันโปรเจกต์

```bash
# ติดตั้ง dependencies (ครั้งแรกหรือหลัง pull)
npm install

# รัน dev server
npm run dev
```

เปิดเบราเซอร์ที่ **http://localhost:5173**

---

## 8. กระบวนการพัฒนา (สิ่งที่ทำในโปรเจกต์นี้)

### Phase 1 — Setup
- ตั้งโปรเจกต์ด้วย **Vite + React**
- ติดตั้ง `react-router-dom` สำหรับ routing
- กำหนดโครงสร้างโฟลเดอร์และ routing หลักใน `App.jsx`

### Phase 2 — หน้าเว็บบริษัท (Home)
- ออกแบบหน้าแรกสำหรับลูกค้าทั่วไป
- ส่วน Hero, บริการ, ผลงาน
- ฟอร์มขอรับคำปรึกษาฟรี (ประเภทงาน, สไตล์บ้าน, งบประมาณ)

### Phase 3 — Admin System
- สร้าง `AdminShell` — Sidebar navigation แสดง email ผู้ใช้จริงจาก Firebase (format: `ชื่อ@admin`)
- สร้างหน้า Dashboard แสดงภาพรวม (โครงการ, PO, เบิกจ่าย, Lead)
- สร้างหน้า Projects พร้อมระบบค้นหาและกรอง
- สร้างหน้า PurchaseOrders, Expenses, Reports, History, Leads

### Phase 4 — Authentication ด้วย Firebase
- สมัคร Firebase และเปิดใช้ Email/Password Authentication
- สร้าง `src/firebase.js` เชื่อมต่อ Firebase
- อัปเดต `AdminLogin.jsx`
  - Register: ตรวจ Company ID → `createUserWithEmailAndPassword`
  - Login: `signInWithEmailAndPassword` → เช็ครหัสผ่านจริง
  - เพิ่ม loading state และ error handling ครบถ้วน
- อัปเดต `AdminShell.jsx` — ดึง email ผู้ใช้จาก Firebase `onAuthStateChanged` แสดงแบบ dynamic

### Phase 5 — Projects: ระบบจัดการโครงการเต็มรูปแบบ
- **วัดความคืบหน้าด้วยงบประมาณ** — `งบที่ใช้ไป ÷ งบทั้งหมด × 100` คำนวณอัตโนมัติ
- **ตารางโครงการ** แสดง งบทั้งหมด / ใช้ไปแล้ว / ความคืบหน้า / สถานะ
- **Modal รายละเอียด** — กดปุ่ม "รายละเอียด" ดูข้อมูลครบ พร้อมกล่องสรุปงบ 3 ช่อง (งบทั้งหมด / ใช้ไปแล้ว / คงเหลือ)
- **เพิ่มโครงการใหม่** — form ครบทุก field พร้อม preview progress ก่อนบันทึก
- **แก้ไขโครงการ** — เปิดจาก modal รายละเอียด form โหลดข้อมูลเดิมมาให้แก้

### Phase 6 — Expenses: ระบบเบิกจ่ายล่วงหน้า
- **แท็บกรองสถานะ** (ตามลำดับ): รออนุมัติ → อนุมัติสำเร็จ → เบิกจ่ายสำเร็จ → รายการทั้งหมด
- **Default tab** เมื่อเข้าหน้าจะแสดง "รออนุมัติ" ก่อนเสมอ
- **ปุ่มอัปเดตสถานะ** ใน detail panel ฝั่งขวา:
  - รออนุมัติ → กด "อนุมัติรายการนี้" → เปลี่ยนเป็น อนุมัติสำเร็จ
  - อนุมัติสำเร็จ → กด "ยืนยันเบิกจ่ายสำเร็จ" → เปลี่ยนเป็น เบิกจ่ายสำเร็จ
  - เบิกจ่ายสำเร็จ → แสดงกล่องสีเขียว (ไม่มีปุ่มเพิ่ม)

### Phase 7 — PurchaseOrders: ระบบใบสั่งซื้อ
- **แท็บกรองสถานะ** (ตามลำดับ): รออนุมัติ → อนุมัติสำเร็จ → รับของสำเร็จ → ทั้งหมด
- **Default tab** เมื่อเข้าหน้าจะแสดง "รออนุมัติ" ก่อนเสมอ
- **ปุ่มอัปเดตสถานะ** ใน detail panel ฝั่งขวา:
  - รออนุมัติ → กด "อนุมัติ PO นี้" → เปลี่ยนเป็น อนุมัติสำเร็จ
  - อนุมัติสำเร็จ → กด "ยืนยันรับของสำเร็จ" → เปลี่ยนเป็น รับของสำเร็จ
  - รับของสำเร็จ → แสดงกล่องสีเขียว (ไม่มีปุ่มเพิ่ม)

> **ความต่างระหว่าง PO กับ Expenses:**
> - **PO** = สั่งซื้อวัสดุจากซัพพลายเออร์ (สั่งก่อน จ่ายทีหลัง)
> - **Expenses** = พนักงานขอเงินสดล่วงหน้าเพื่อซื้อของเอง

### Phase 8 — Team Collaboration
- ใช้ Git + GitHub ทำงานร่วมกันเป็นทีม
- ทดสอบ workflow: push / pull / hot reload

---

## 9. Dependencies

```json
{
  "dependencies": {
    "firebase": "^11.x",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.17.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2"
  }
}
```

---

## 10. หน้า Projects — field ที่เก็บต่อโครงการ

| Field | ประเภท | คำอธิบาย |
|-------|--------|-----------|
| `name` | text | ชื่อโครงการ |
| `client` | text | ชื่อลูกค้า |
| `phone` | text | เบอร์โทรลูกค้า |
| `address` | text | ที่อยู่/สถานที่ก่อสร้าง |
| `type` | select | สร้างใหม่ / ต่อเติม / รีโนเวท |
| `budgetTotal` | number | งบประมาณทั้งหมด (บาท) |
| `budgetUsed` | number | งบที่ใช้ไปแล้ว (บาท) |
| `pm` | text | ชื่อ PM ผู้รับผิดชอบ |
| `status` | select | กำลังดำเนินการ / หยุดพัก / เสร็จแล้ว |
| `startDate` | date | วันเริ่มต้น |
| `endDate` | date | วันกำหนดเสร็จ |
| `note` | text | หมายเหตุเพิ่มเติม |
| `pct` (คำนวณ) | auto | `budgetUsed ÷ budgetTotal × 100` |

---

## 11. สิ่งที่ยังพัฒนาต่อได้

- [ ] Route Guard — ป้องกัน `/dashboard` ไม่ให้เข้าได้โดยไม่ Login
- [ ] Logout button ในหน้า Admin
- [ ] เชื่อม Firestore เก็บข้อมูล Project, PO, Expenses จริง (ตอนนี้เก็บใน memory)
- [ ] Responsive design สำหรับมือถือ
- [ ] ระบบแจ้งเตือน (Notification)
- [ ] ลบโครงการ
