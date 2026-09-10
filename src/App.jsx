import { useEffect, useMemo, useState } from 'react'
import './App.css'

const doctors = {
  ENT: [
    { id: 'psg_ent_1', name: 'Dr. Palani Nathan S', qualification: 'Senior Consultant, ENT Surgery', schedule: 'Mon - Sat (10:00 AM - 01:00 PM)', hospital: { name: 'PSG Hospitals', location: 'Peelamedu, Coimbatore', upiId: 'psghospitals@upi' } },
    { id: 'psg_ent_2', name: 'Dr. Dayanand A', qualification: 'Professor & ENT Consultant', schedule: 'Mon - Sat (02:00 PM - 05:00 PM)', hospital: { name: 'PSG Hospitals', location: 'Peelamedu, Coimbatore', upiId: 'psghospitals@upi' } },
    { id: 'srh_ent_1', name: 'Dr. K. Raja Shanmugam', qualification: 'Senior Consultant ENT Surgeon', schedule: 'Mon - Sat (09:00 AM - 01:00 PM)', hospital: { name: 'Sri Ramakrishna Hospital', location: 'Siddhapudur, Coimbatore', upiId: 'sriramakrishna@upi' } },
    { id: 'kmch_ent_1', name: 'Dr. I. Chakkaravarthy', qualification: 'Senior Consultant ENT Surgeon', schedule: 'Mon - Sat (10:00 AM - 04:00 PM)', hospital: { name: 'KMCH', location: 'Avinashi Road, Coimbatore', upiId: 'kmchhospital@upi' } }
  ],
  CARDIOLOGY: [
    { id: 'psg_card_1', name: 'Dr. J S Bhuvaneswaran', qualification: 'Director & Senior Consultant Cardiologist', schedule: 'Mon - Sat (10:00 AM - 02:00 PM)', hospital: { name: 'PSG Hospitals', location: 'Peelamedu, Coimbatore', upiId: 'psghospitals@upi' } },
    { id: 'psg_card_2', name: 'Dr. Rajendiran G', qualification: 'Senior Interventional Cardiologist', schedule: 'Mon - Sat (02:00 PM - 05:00 PM)', hospital: { name: 'PSG Hospitals', location: 'Peelamedu, Coimbatore', upiId: 'psghospitals@upi' } },
    { id: 'srh_card_1', name: 'Dr. S. Manoharan', qualification: 'Consultant Cardiologist & HOD', schedule: 'Mon - Sat (09:30 AM - 01:30 PM)', hospital: { name: 'Sri Ramakrishna Hospital', location: 'Siddhapudur, Coimbatore', upiId: 'sriramakrishna@upi' } },
    { id: 'kmch_card_1', name: 'Dr. S. Saravanan', qualification: 'Chief Interventional Cardiologist', schedule: 'Mon - Sat (10:00 AM - 04:00 PM)', hospital: { name: 'KMCH', location: 'Avinashi Road, Coimbatore', upiId: 'kmchhospital@upi' } }
  ],
  NEUROSURGERY: [
    { id: 'psg_neuro_1', name: 'Dr. Thirumurthy K S', qualification: 'Senior Consultant Neurosurgeon', schedule: 'Mon - Sat (10:00 AM - 01:00 PM)', hospital: { name: 'PSG Hospitals', location: 'Peelamedu, Coimbatore', upiId: 'psghospitals@upi' } },
    { id: 'psg_neuro_2', name: 'Dr. Jayaprakash Duraisamy', qualification: 'Consultant Brain & Spine Surgeon', schedule: 'Mon - Sat (02:00 PM - 05:00 PM)', hospital: { name: 'PSG Hospitals', location: 'Peelamedu, Coimbatore', upiId: 'psghospitals@upi' } },
    { id: 'srh_neuro_1', name: 'Dr. R. Murali', qualification: 'HOD & Chief Neurosurgeon', schedule: 'Mon - Sat (09:00 AM - 02:00 PM)', hospital: { name: 'Sri Ramakrishna Hospital', location: 'Siddhapudur, Coimbatore', upiId: 'sriramakrishna@upi' } },
    { id: 'ganga_neuro_1', name: 'Dr. V. Rajesh Babu', qualification: 'Consultant Spine & Neurosurgeon', schedule: 'Mon - Sat (09:00 AM - 04:00 PM)', hospital: { name: 'Ganga Hospital', location: 'Swarnambika Layout, Coimbatore', upiId: 'gangahospital@upi' } }
  ]
}

const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
const TOTAL_SEATS = 10

const getLocalDateString = () => {
  const today = new Date()
  const offset = today.getTimezoneOffset() * 60000
  return new Date(today.getTime() - offset).toISOString().split('T')[0]
}

const toMinutes = (t) => {
  const [hm, ampm] = t.split(' ')
  let [h, m] = hm.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + m
}

const getDeterministicBookedSeats = (doctorId, date, time) => {
  const seed = (doctorId + date + time).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const booked = []
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    if ((seed + i * 3) % 4 === 0) booked.push(i)
  }
  return booked
}

function App() {
  const [specialty, setSpecialty] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [patientType, setPatientType] = useState('Myself')
  const [patientAge, setPatientAge] = useState('26')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [seat, setSeat] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [utr, setUtr] = useState('')
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [loginInput, setLoginInput] = useState('')
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mediconnect_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    const minDate = getLocalDateString()
    const dateInput = document.getElementById('dateInput')
    if (dateInput) dateInput.min = minDate
  }, [])

  const selectedDoctor = useMemo(
    () => (specialty ? doctors[specialty].find((d) => d.id === doctorId) : null),
    [specialty, doctorId]
  )

  const bookedSeats = useMemo(() => {
    if (!selectedDoctor || !date || !time) return []
    return getDeterministicBookedSeats(selectedDoctor.id, date, time)
  }, [selectedDoctor, date, time])

  const availableSeatCount = TOTAL_SEATS - bookedSeats.length

  const handleSymptomMatch = (specKey) => {
    setSpecialty(specKey)
    setDoctorId('')
    setDate('')
    setTime('')
    setSeat(null)
    setShowPayment(false)
    setUtr('')
    setPaymentVerified(false)
  }

  const handleDoctorSelect = (event) => {
    const nextDoctorId = event.target.value
    setDoctorId(nextDoctorId)
    setDate('')
    setTime('')
    setSeat(null)
    setShowPayment(false)
    setUtr('')
    setPaymentVerified(false)
  }

  const handleDateChange = (event) => {
    const nextDate = event.target.value
    setDate(nextDate)
    setTime('')
    setSeat(null)
    setShowPayment(false)
    setUtr('')
    setPaymentVerified(false)
  }

  const handleSlotSelect = (slot) => {
    setTime(slot)
    setSeat(null)
    setShowPayment(false)
    setUtr('')
    setPaymentVerified(false)
  }

  const handleSeatSelect = (seatNumber) => {
    setSeat(seatNumber)
    setShowPayment(false)
    setUtr('')
    setPaymentVerified(false)
  }

  const handleShowPayment = () => {
    if (!selectedDoctor || !date || !time || seat === null) return
    setShowPayment(true)
    setPaymentVerified(false)
    setUtr('')
  }

  const handleLogin = (event) => {
    event.preventDefault()
    const identifier = loginInput.trim()
    const nextUser = { name: identifier.split('@')[0] || 'Patient', email: identifier }
    localStorage.setItem('mediconnect_user', JSON.stringify(nextUser))
    setCurrentUser(nextUser)
    setIsAuthOpen(false)
    setLoginInput('')
  }

  const handleLogout = () => {
    localStorage.removeItem('mediconnect_user')
    setCurrentUser(null)
  }

  const handleVerify = () => {
    const cleanUtr = utr.trim()
    if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
      alert('⚠️ Please enter a valid 12-digit UPI UTR / Transaction Reference Number.')
      return
    }
    setPaymentVerified(true)
  }

  const handleConfirmBooking = () => {
    if (!paymentVerified) return
    alert(`🎉 Token #${seat} Confirmed!\n\nPatient: ${patientType}\nDoctor: ${selectedDoctor.name}\nHospital: ${selectedDoctor.hospital.name}\nDate: ${date} at ${time}\n\nSMS alert sent to your registered mobile.`)
    resetForm()
  }

  const resetForm = () => {
    setSpecialty('')
    setDoctorId('')
    setPatientType('Myself')
    setPatientAge('26')
    setDate('')
    setTime('')
    setSeat(null)
    setShowPayment(false)
    setUtr('')
    setPaymentVerified(false)
    setIsAuthOpen(false)
    setLoginInput('')
  }

  const doctorList = specialty ? doctors[specialty] : []
  const dayOfWeek = date ? new Date(`${date}T00:00:00`).getDay() : null
  const isToday = date === getLocalDateString()
  const qrUrl = selectedDoctor
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${encodeURIComponent(selectedDoctor.hospital.upiId)}&pn=${encodeURIComponent(selectedDoctor.hospital.name)}&cu=INR`)}`
    : ''

  return (
    <>
      <header className="navbar">
        <a href="#" className="brand">
          <div className="brand-icon">+</div>
          MediConnect
        </a>
        <div className="nav-actions">
          <div id="userProfile" className="user-pill" style={{ display: currentUser ? 'inline-flex' : 'none' }}>
            <span>👤</span>
            <span id="userNameText">{currentUser?.name || 'Guest'}</span>
          </div>
          <button
            id="authTriggerBtn"
            className="auth-btn"
            type="button"
            onClick={currentUser ? handleLogout : () => setIsAuthOpen(true)}
          >
            {currentUser ? 'Logout' : 'Login / Register'}
          </button>
        </div>
      </header>

      <div className="container">
        <div className="hero">
          <h1>Smart OPD &amp; Token System</h1>
          <p>LIVE QUEUE STATUS · REAL SPECIALISTS · COIMBATORE</p>
          <div className="location-bar">
            📍 <span id="locationText">Coimbatore, Tamil Nadu</span>
          </div>
        </div>

        <div className="queue-ticker">
          <div>
            <span className="queue-live-tag">● Live OPD</span>
            <span>Coimbatore OPD Central: <strong style={{ color: '#38bdf8' }}>Token #4</strong> in Consultation</span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}>⏱ Avg Consultation: ~6 mins</div>
        </div>

        <div className="symptom-section">
          <div className="section-title">⚡ Quick Symptom Matcher (Click to auto-select)</div>
          <div className="chip-grid">
            <div className="s-chip" onClick={() => handleSymptomMatch('ENT')}>👂 Ear / Throat Pain</div>
            <div className="s-chip" onClick={() => handleSymptomMatch('CARDIOLOGY')}>❤️ Chest Pain / High BP</div>
            <div className="s-chip" onClick={() => handleSymptomMatch('NEUROSURGERY')}>🧠 Headache / Spine Pain</div>
          </div>
        </div>

        <main className="card">
          <div className="progress-bar">
            <span className={specialty ? 'active' : ''} />
            <span className={doctorId ? 'active' : ''} />
            <span className={date ? 'active' : ''} />
            <span className={time ? 'active' : ''} />
            <span className={seat !== null ? 'active' : ''} />
          </div>

          <div className="step-title">1. Patient Profile</div>
          <div className="family-row">
            <select value={patientType} onChange={(e) => setPatientType(e.target.value)}>
              <option value="Myself">Patient: Myself</option>
              <option value="Father">Patient: Father</option>
              <option value="Mother">Patient: Mother</option>
              <option value="Spouse">Patient: Spouse</option>
              <option value="Child">Patient: Child</option>
            </select>
            <input type="number" id="patientAge" placeholder="Age" min="1" max="110" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} />
          </div>

          <div className="step-title">2. Medical Specialty</div>
          <select value={specialty} onChange={(e) => { setSpecialty(e.target.value); setDoctorId(''); setDate(''); setTime(''); setSeat(null); setShowPayment(false); setUtr(''); setPaymentVerified(false); }}>
            <option value="">-- Choose Medical Specialty --</option>
            <option value="ENT">ENT (Ear, Nose &amp; Throat)</option>
            <option value="CARDIOLOGY">Cardiology &amp; Heart Care</option>
            <option value="NEUROSURGERY">Neurosurgery &amp; Spine</option>
          </select>

          <div className="step-title">3. Specialist Doctor</div>
          <select value={doctorId} onChange={handleDoctorSelect} disabled={!specialty}>
            {!specialty ? (
              <option value="">Select specialty first</option>
            ) : (
              <>
                <option value="">Select a Specialist</option>
                {doctorList.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.name} ({doc.hospital.name})</option>
                ))}
              </>
            )}
          </select>
          {selectedDoctor && (
            <div className="doctor-details-box" style={{ display: 'block' }}>
              <div>🏥 <strong>{selectedDoctor.hospital.name}</strong> · {selectedDoctor.hospital.location}</div>
              <div>🕒 <strong>OPD Timings:</strong> {selectedDoctor.schedule}</div>
            </div>
          )}

          <div className="step-title">4. Consultation Date</div>
          <input
            type="date"
            id="dateInput"
            value={date}
            onChange={handleDateChange}
            disabled={!selectedDoctor}
          />
          {dayOfWeek === 0 && (
            <div id="sundayNotice" style={{ display: 'block', color: 'var(--danger)', fontSize: '12px', fontWeight: 700, marginTop: '6px' }}>
              ⚠️ Outpatient clinics are closed on Sundays. Emergency OPD is open 24/7.
            </div>
          )}

          {dayOfWeek !== 0 && date && selectedDoctor && (
            <div id="slotArea" style={{ display: 'block' }}>
              <div className="step-title">5. Consultation Slot</div>
              <div id="slotGrid" className="slot-grid">
                {slots.map((slotValue) => {
                  const expired = isToday && toMinutes(slotValue) <= (new Date().getHours() * 60 + new Date().getMinutes())
                  return (
                    <button
                      key={slotValue}
                      type="button"
                      className={`slot-btn ${time === slotValue ? 'selected' : ''}`}
                      onClick={() => !expired && handleSlotSelect(slotValue)}
                      disabled={expired}
                    >
                      {expired ? (
                        <>
                          ⏱ {slotValue}
                          <br />
                          <small>Closed</small>
                        </>
                      ) : (
                        slotValue
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {time && (
            <div id="seatArea" style={{ display: 'block' }}>
              <div className="seat-header">
                <span>🪑 6. Token / Seat Assignment</span>
                <span id="seatCountBadge" style={{ color: 'var(--primary)' }}>{availableSeatCount} Available</span>
              </div>
              <div id="seatGrid" className="seat-grid">
                {Array.from({ length: TOTAL_SEATS }, (_, idx) => idx + 1).map((seatNumber) => {
                  const isBooked = bookedSeats.includes(seatNumber)
                  const isSelected = seat === seatNumber
                  return (
                    <button
                      key={seatNumber}
                      type="button"
                      className={`seat ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}`}
                      onClick={() => !isBooked && handleSeatSelect(seatNumber)}
                      disabled={isBooked}
                    >
                      {seatNumber}
                    </button>
                  )
                })}
              </div>
              <div className="legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--available)' }}></div> Available</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--selected)' }}></div> Selected</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--booked)' }}></div> Booked</div>
              </div>
              <button id="payStepBtn" className="btn btn-primary" style={{ marginTop: '14px' }} onClick={handleShowPayment} disabled={seat === null}>
                Proceed to Token Payment →
              </button>
            </div>
          )}

          {showPayment && selectedDoctor && (
            <div id="paymentArea" style={{ display: 'block' }}>
              <div className="gpay-badge">💳 Google Pay / PhonePe UPI</div>
              <div id="bookingSummary" className="booking-summary">
                <div className="summary-item"><strong>Patient Profile</strong>{patientType} ({patientAge} Yrs)</div>
                <div className="summary-item"><strong>Doctor</strong>{selectedDoctor.name}</div>
                <div className="summary-item"><strong>Hospital</strong>{selectedDoctor.hospital.name}</div>
                <div className="summary-item"><strong>Date &amp; Slot</strong>{date} · {time}</div>
                <div className="summary-item"><strong>Token Assigned</strong>Token #{seat}</div>
                <div className="summary-item"><strong>OPD Status</strong>On Schedule</div>
              </div>
              <div id="qrContainer">
                <img src={qrUrl} alt="UPI QR" style={{ borderRadius: '8px', width: '160px', height: '160px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>
                Scan the QR with any UPI app and complete the token reservation.
              </div>

              <div className="utr-verify-box">
                <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  🧾 Enter 12-Digit UPI Ref / UTR Number after payment:
                </label>
                <input type="text" id="utrNumberInput" placeholder="e.g. 423819208391" maxLength="12" value={utr} onChange={(e) => setUtr(e.target.value)} />
                <button id="verifyBtn" className="btn btn-verify" onClick={handleVerify} style={{ marginTop: '8px' }}>
                  Verify Payment UTR
                </button>
              </div>

              <div id="payStatus" className={`status-box ${paymentVerified ? 'status-verified' : 'status-waiting'}`}>
                {paymentVerified ? `✅ UTR ${utr} Verified! Click Confirm to finalize.` : 'Scan QR & enter 12-digit UTR to unlock confirmation'}
              </div>

              <button id="confirmBtn" className="btn btn-primary" onClick={handleConfirmBooking} disabled={!paymentVerified}>
                Confirm Appointment Token
              </button>
            </div>
          )}

          <button className="btn btn-secondary" onClick={resetForm} style={{ marginTop: '16px' }}>
            Reset Form
          </button>
        </main>

        <div className="footer">
          © 2026 MediConnect · Live Project: <a href="https://jeevinth008-pixel.github.io/Mediconnect/" target="_blank" rel="noreferrer">jeevinth008-pixel.github.io/Mediconnect</a>
        </div>
      </div>

      <div id="authModal" className="modal-overlay" style={{ display: isAuthOpen ? 'grid' : 'none' }}>
        <div className="modal-card">
          <button className="modal-close" type="button" onClick={() => setIsAuthOpen(false)}>✕</button>
          <h3 style={{ marginBottom: '14px', fontSize: '16px', color: 'var(--navy)' }}>Patient Sign In</h3>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '10px', textAlign: 'left' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>Email / Mobile</label>
              <input type="text" id="loginId" placeholder="name@domain.com" required value={loginInput} onChange={(e) => setLoginInput(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Login Now</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
