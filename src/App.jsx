import { useEffect, useMemo, useRef, useState } from 'react'
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
const ADMIN_CREDENTIALS = { email: 'admin@mediconnect.com', password: 'Admin@123' }
const PRESCRIPTION_DB_NAME = 'mediconnect-prescriptions'
const PRESCRIPTION_STORE_NAME = 'attachments'
const hospitalBranches = [
  { name: 'PSG Hospitals', location: 'Peelamedu, Coimbatore' },
  { name: 'Sri Ramakrishna Hospital', location: 'Siddhapudur, Coimbatore' },
  { name: 'KMCH', location: 'Avinashi Road, Coimbatore' },
  { name: 'Ganga Hospital', location: 'Swarnambika Layout, Coimbatore' }
]

const hospitalStorageKey = (hospitalName) => `mediconnect_appointments_${normalizeHospitalName(hospitalName)}`

const readHospitalAppointments = (hospitalName) => {
  if (!hospitalName) return []
  try {
    return JSON.parse(localStorage.getItem(hospitalStorageKey(hospitalName)) || '[]')
  } catch {
    return []
  }
}

const readAmbulanceDriver = () => {
  try {
    return JSON.parse(localStorage.getItem('mediconnect_ambulance_driver') || 'null')
  } catch {
    return null
  }
}

const readSharedAmbulances = () => {
  try {
    return JSON.parse(localStorage.getItem('mediconnect_shared_ambulances') || '[]')
  } catch {
    return []
  }
}

const readAmbulanceRequests = () => {
  try {
    return JSON.parse(localStorage.getItem('mediconnect_ambulance_requests') || '[]')
  } catch {
    return []
  }
}

const nearbyHospitals = [
  { name: 'PSG Hospitals', location: 'Peelamedu, Coimbatore', latitude: 11.0236, longitude: 76.9345 },
  { name: 'Sri Ramakrishna Hospital', location: 'Siddhapudur, Coimbatore', latitude: 11.0183, longitude: 76.9714 },
  { name: 'KMCH', location: 'Avinashi Road, Coimbatore', latitude: 11.051, longitude: 76.9947 },
  { name: 'Ganga Hospital', location: 'Swarnambika Layout, Coimbatore', latitude: 11.0074, longitude: 76.9504 }
]

const normalizeHospitalName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

const distanceBetweenCoordinates = (firstLatitude, firstLongitude, secondLatitude, secondLongitude) => {
  const earthRadiusKm = 6371
  const latitudeDelta = (secondLatitude - firstLatitude) * Math.PI / 180
  const longitudeDelta = (secondLongitude - firstLongitude) * Math.PI / 180
  const firstLatitudeRadians = firstLatitude * Math.PI / 180
  const secondLatitudeRadians = secondLatitude * Math.PI / 180
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.sin(longitudeDelta / 2) ** 2 * Math.cos(firstLatitudeRadians) * Math.cos(secondLatitudeRadians)
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

const openPrescriptionDatabase = () => new Promise((resolve, reject) => {
  if (!window.indexedDB) {
    reject(new Error('Prescription storage is not available in this browser.'))
    return
  }

  const request = window.indexedDB.open(PRESCRIPTION_DB_NAME, 1)
  request.onupgradeneeded = () => {
    const database = request.result
    if (!database.objectStoreNames.contains(PRESCRIPTION_STORE_NAME)) {
      database.createObjectStore(PRESCRIPTION_STORE_NAME, { keyPath: 'id', autoIncrement: true })
    }
  }
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error || new Error('Could not open prescription storage.'))
  request.onblocked = () => reject(new Error('Prescription storage is blocked by another open page.'))
})

const loadPrescriptionAttachments = async () => {
  const database = await openPrescriptionDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(PRESCRIPTION_STORE_NAME, 'readonly')
      const request = transaction.objectStore(PRESCRIPTION_STORE_NAME).getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error || new Error('Could not load saved prescriptions.'))
      transaction.onerror = () => reject(transaction.error || new Error('Could not load saved prescriptions.'))
    })
  } finally {
    database.close()
  }
}

const savePrescriptionAttachment = async (file) => {
  const database = await openPrescriptionDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(PRESCRIPTION_STORE_NAME, 'readwrite')
      const attachment = {
        name: file.name,
        type: file.type,
        blob: file,
        addedAt: Date.now()
      }
      const request = transaction.objectStore(PRESCRIPTION_STORE_NAME).add(attachment)
      transaction.oncomplete = () => resolve({
        id: request.result,
        ...attachment
      })
      transaction.onerror = () => reject(transaction.error || new Error('Could not save this prescription.'))
      transaction.onabort = () => reject(transaction.error || new Error('Saving this prescription was cancelled.'))
    })
  } finally {
    database.close()
  }
}

const deletePrescriptionAttachment = async (id) => {
  const database = await openPrescriptionDatabase()
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(PRESCRIPTION_STORE_NAME, 'readwrite')
      transaction.objectStore(PRESCRIPTION_STORE_NAME).delete(id)
      transaction.oncomplete = resolve
      transaction.onerror = () => reject(transaction.error || new Error('Could not remove this prescription.'))
      transaction.onabort = () => reject(transaction.error || new Error('Removing this prescription was cancelled.'))
    })
  } finally {
    database.close()
  }
}

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

function useBlobUrl(blob) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob)
    const frame = window.requestAnimationFrame(() => setUrl(objectUrl))
    return () => {
      window.cancelAnimationFrame(frame)
      URL.revokeObjectURL(objectUrl)
    }
  }, [blob])
  return url
}

function PrescriptionThumbnail({ attachment }) {
  const thumbnailUrl = useBlobUrl(attachment.blob)

  return <img src={thumbnailUrl} alt="" />
}

function PrescriptionPreview({ attachment, onClose }) {
  const previewUrl = useBlobUrl(attachment.blob)

  return (
    <div className="prescription-preview-overlay" role="presentation" onClick={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="prescription-preview-dialog" role="dialog" aria-modal="true" aria-label={`Preview ${attachment.name}`}>
        <div className="prescription-preview-header">
          <strong>{attachment.name}</strong>
          <button type="button" className="prescription-remove-button" onClick={onClose} aria-label="Close prescription preview"></button>
        </div>
        {attachment.type.startsWith('image/') ? (
          <img className="prescription-full-preview" src={previewUrl} alt={attachment.name} />
        ) : (
          <iframe className="prescription-pdf-preview" src={previewUrl} title={`Prescription: ${attachment.name}`} />
        )}
      </section>
    </div>
  )
}

function PrescriptionAttachments() {
  const [attachments, setAttachments] = useState([])
  const [storageError, setStorageError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [previewAttachment, setPreviewAttachment] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    loadPrescriptionAttachments()
      .then((savedAttachments) => {
        if (isMounted) setAttachments(savedAttachments.sort((a, b) => b.addedAt - a.addedAt))
      })
      .catch((error) => {
        if (isMounted) setStorageError(error.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const handleFilesSelected = async (event) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    setStorageError('')
    for (const file of files) {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setStorageError(`${file.name} is not a supported image or PDF.`)
        continue
      }
      try {
        const savedAttachment = await savePrescriptionAttachment(file)
        setAttachments((current) => [savedAttachment, ...current])
      } catch (error) {
        setStorageError(`Could not save ${file.name}: ${error.message}`)
      }
    }
  }

  const handleDelete = async (id) => {
    setStorageError('')
    try {
      await deletePrescriptionAttachment(id)
      setAttachments((current) => current.filter((attachment) => attachment.id !== id))
      if (previewAttachment?.id === id) setPreviewAttachment(null)
    } catch (error) {
      setStorageError(error.message)
    }
  }

  return (
    <aside className="prescriptions-panel" aria-label="Prescription attachments">
      <div className="prescriptions-heading">
        <span className="prescriptions-icon" aria-hidden="true"></span>
        <div>
          <h2>Prescriptions</h2>
          <p>Keep your medical documents handy.</p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        className="prescription-file-input"
        type="file"
        accept="image/*,application/pdf,.pdf"
        multiple
        onChange={handleFilesSelected}
        aria-label="Choose prescription images or PDF files"
      />
      <button type="button" className="prescription-add-button" onClick={() => fileInputRef.current?.click()}>
        <span aria-hidden="true">+</span> Add prescriptions
      </button>
      <p className="prescriptions-storage-note">Images and PDFs are saved on this device.</p>
      {storageError && <p className="prescriptions-error" role="alert">{storageError}</p>}
      {isLoading ? (
        <p className="prescriptions-empty" role="status">Loading saved prescriptions...</p>
      ) : attachments.length ? (
        <ul className="prescription-list">
          {attachments.map((attachment) => (
            <li className="prescription-item" key={attachment.id}>
              <button type="button" className="prescription-preview-button" onClick={() => setPreviewAttachment(attachment)}>
                {attachment.type.startsWith('image/') ? (
                  <PrescriptionThumbnail attachment={attachment} />
                ) : (
                  <span className="prescription-pdf-icon" aria-hidden="true">PDF</span>
                )}
                <span className="prescription-file-name">{attachment.name}</span>
              </button>
              <button type="button" className="prescription-remove-button" onClick={() => handleDelete(attachment.id)} aria-label={`Remove ${attachment.name}`}></button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="prescriptions-empty">No prescriptions attached yet.</p>
      )}
      {previewAttachment && <PrescriptionPreview key={previewAttachment.id} attachment={previewAttachment} onClose={() => setPreviewAttachment(null)} />}
    </aside>
  )
}

function App() {
  const [hospitalName, setHospitalName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [patientType, setPatientType] = useState('Myself')
  const [patientName, setPatientName] = useState(() => {
    const saved = localStorage.getItem('mediconnect_user')
    return saved ? JSON.parse(saved).name : ''
  })
  const [patientAge, setPatientAge] = useState('26')
  const [patientGender, setPatientGender] = useState('')
  const [patientAddress, setPatientAddress] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [seat, setSeat] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [utr, setUtr] = useState('')
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [loginInput, setLoginInput] = useState('')
  const [appointments, setAppointments] = useState(() => readHospitalAppointments(localStorage.getItem('mediconnect_admin_hospital') || ''))
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('mediconnect_admin') === 'true')
  const [adminHospital, setAdminHospital] = useState(() => localStorage.getItem('mediconnect_admin_hospital') || '')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminLoginError, setAdminLoginError] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [ambulanceDriver, setAmbulanceDriver] = useState(readAmbulanceDriver)
  const [ambulancePhone, setAmbulancePhone] = useState('')
  const [ambulanceHospital, setAmbulanceHospital] = useState('')
  const [ambulanceError, setAmbulanceError] = useState('')
  const [sharedAmbulances, setSharedAmbulances] = useState(readSharedAmbulances)
  const [ambulanceRequests, setAmbulanceRequests] = useState(readAmbulanceRequests)
  const [isSharingLocation, setIsSharingLocation] = useState(() => readSharedAmbulances().length > 0)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [isLocatingUser, setIsLocatingUser] = useState(false)
  const [showAmbulanceDetails, setShowAmbulanceDetails] = useState(false)
  const [visibleAmbulancePhone, setVisibleAmbulancePhone] = useState('')
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mediconnect_user')
    return saved ? JSON.parse(saved) : null
  })
  const patientLocationWatchRef = useRef(null)
  const activeAmbulanceRequestIdRef = useRef(null)

  useEffect(() => {
    const minDate = getLocalDateString()
    const dateInput = document.getElementById('dateInput')
    if (dateInput) dateInput.min = minDate
  }, [])

  useEffect(() => {
    const syncAmbulanceData = () => {
      setSharedAmbulances(readSharedAmbulances())
      const nextRequests = readAmbulanceRequests()
      setAmbulanceRequests(nextRequests)
      const activeRequest = nextRequests.find((request) => request.id === activeAmbulanceRequestIdRef.current)
      if (activeAmbulanceRequestIdRef.current && (!activeRequest || activeRequest.status === 'completed')) {
        if (patientLocationWatchRef.current !== null && navigator.geolocation) {
          navigator.geolocation.clearWatch(patientLocationWatchRef.current)
        }
        patientLocationWatchRef.current = null
        activeAmbulanceRequestIdRef.current = null
      }
    }
    window.addEventListener('storage', syncAmbulanceData)
    const refreshTimer = window.setInterval(syncAmbulanceData, 3000)
    return () => {
      window.removeEventListener('storage', syncAmbulanceData)
      window.clearInterval(refreshTimer)
    }
  }, [])

  useEffect(() => () => {
    if (patientLocationWatchRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(patientLocationWatchRef.current)
    }
  }, [])

  const selectedDoctor = useMemo(
    () => (specialty ? doctors[specialty].find((d) => d.id === doctorId && d.hospital.name === hospitalName) : null),
    [specialty, doctorId, hospitalName]
  )

  const bookedSeats = useMemo(() => {
    if (!selectedDoctor || !date || !time) return []
    const storedSeats = appointments
      .filter((appointment) => appointment.hospital === hospitalName && appointment.doctorId === selectedDoctor.id && appointment.date === date && appointment.time === time)
      .map((appointment) => appointment.seat)
    return [...new Set([...getDeterministicBookedSeats(selectedDoctor.id, date, time), ...storedSeats])]
  }, [selectedDoctor, hospitalName, date, time, appointments])

  const availableSeatCount = TOTAL_SEATS - bookedSeats.length
  const canSubmitAppointment = paymentMethod === 'hospital' || (paymentMethod === 'online' && paymentVerified)

  const handleSymptomMatch = (specKey) => {
    if (!hospitalName) {
      alert('Please select a hospital branch first.')
      return
    }
    setSpecialty(specKey)
    setDoctorId('')
    setDate('')
    setTime('')
    setSeat(null)
    setShowPayment(false)
    setPaymentMethod('')
    setUtr('')
    setPaymentVerified(false)
  }

  const handleHospitalChange = (event) => {
    const nextHospitalName = event.target.value
    setHospitalName(nextHospitalName)
    setAppointments(readHospitalAppointments(nextHospitalName))
    setSpecialty('')
    setDoctorId('')
    setDate('')
    setTime('')
    setSeat(null)
    setShowPayment(false)
    setPaymentMethod('')
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
    setPaymentMethod('')
    setUtr('')
    setPaymentVerified(false)
  }

  const handleDateChange = (event) => {
    const nextDate = event.target.value
    setDate(nextDate)
    setTime('')
    setSeat(null)
    setShowPayment(false)
    setPaymentMethod('')
    setUtr('')
    setPaymentVerified(false)
  }

  const handleSlotSelect = (slot) => {
    setTime(slot)
    setSeat(null)
    setShowPayment(false)
    setPaymentMethod('')
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
    setPaymentMethod('')
    setPaymentVerified(false)
    setUtr('')
  }

  const handleLogin = (event) => {
    event.preventDefault()
    const identifier = loginInput.trim()
    const password = loginPassword.trim()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
    const isMobile = /^\+?[0-9\s-]{10,}$/.test(identifier)

    if (!isEmail && !isMobile) {
      setLoginError('Enter a valid email address or mobile number.')
      return
    }
    if (password.length < 6) {
      setLoginError('Password must be at least 6 characters.')
      return
    }

    if (!patientName.trim()) { setLoginError('Enter patient name.'); return }
    if (!patientAge || Number(patientAge) < 1 || Number(patientAge) > 120) { setLoginError('Enter a valid age.'); return }
    if (!patientGender || !patientAddress.trim()) { setLoginError('Complete all patient details.'); return }
    const nextUser = { name: patientName.trim(), age: Number(patientAge), gender: patientGender, address: patientAddress.trim(), photo: profilePhoto, email: identifier }
    localStorage.setItem('mediconnect_user', JSON.stringify(nextUser))
    setCurrentUser(nextUser)
    setPatientName(nextUser.name)
    setIsAuthOpen(false)
    setLoginInput('')
    setLoginPassword('')
    setLoginError('')
  }

  const handleLogout = () => {
    localStorage.removeItem('mediconnect_user')
    setCurrentUser(null)
  }

  const handleVerify = () => {
    const cleanUtr = utr.trim()
    if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
      alert('Please enter a valid 12-digit UPI UTR / Transaction Reference Number.')
      return
    }
    setPaymentVerified(true)
  }

  const handleConfirmBooking = () => {
    if (!canSubmitAppointment) return
    const appointment = {
      id: `${selectedDoctor.id}-${date}-${time}-${seat}-${appointments.length + 1}`,
      patientName: patientName.trim() || patientType,
      patientAge,
      patientType,
      patientEmail: currentUser?.email || '',
      specialty,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      hospital: selectedDoctor.hospital.name,
      hospitalLocation: selectedDoctor.hospital.location,
      date,
      time,
      seat,
      paymentMethod: paymentMethod === 'online' ? 'Online UPI' : 'Pay at hospital',
      paymentStatus: paymentMethod === 'online' ? 'UTR format checked (demo)' : 'Due at hospital',
      paymentReference: paymentMethod === 'online' ? utr.trim() : '',
      createdAt: new Date().toISOString()
    }
    const nextAppointments = [...appointments, appointment]
    localStorage.setItem(hospitalStorageKey(hospitalName), JSON.stringify(nextAppointments))
    setAppointments(nextAppointments)
    alert(`Booking Confirmed! Token #${seat}\n\nPatient: ${patientType}\nDoctor: ${selectedDoctor.name}\nHospital: ${selectedDoctor.hospital.name}\nDate: ${date} at ${time}\n\nSMS alert sent to your registered mobile.`)
    resetForm()
  }

  const handleAdminLogin = (event) => {
    event.preventDefault()
    const matchedHospital = hospitalBranches.find((hospital) => normalizeHospitalName(hospital.name) === normalizeHospitalName(adminEmail.trim()))
    if (!matchedHospital || adminPassword !== ADMIN_CREDENTIALS.password) {
      setAdminLoginError('Enter a hospital name from the booking list and the correct admin password.')
      return
    }
    localStorage.setItem('mediconnect_admin', 'true')
    localStorage.setItem('mediconnect_admin_hospital', matchedHospital.name)
    setAdminUser(true)
    setAdminHospital(matchedHospital.name)
    setAppointments(readHospitalAppointments(matchedHospital.name))
    setAdminLoginError('')
    setAdminEmail('')
    setAdminPassword('')
    setCurrentPage('admin-dashboard')
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('mediconnect_admin')
    localStorage.removeItem('mediconnect_admin_hospital')
    setAdminUser(false)
    setAdminHospital('')
    setAppointments([])
    setCurrentPage('home')
  }

  const handleAmbulanceLogin = (event) => {
    event.preventDefault()
    const phone = ambulancePhone.replace(/\D/g, '')
    if (phone.length < 10) {
      setAmbulanceError('Enter a valid 10-digit phone number.')
      return
    }
    if (!ambulanceHospital.trim()) {
      setAmbulanceError('Enter the hospital you work for.')
      return
    }
    const driver = { phone, hospital: ambulanceHospital.trim(), loggedInAt: new Date().toISOString() }
    localStorage.setItem('mediconnect_ambulance_driver', JSON.stringify(driver))
    setAmbulanceDriver(driver)
    setAmbulancePhone('')
    setAmbulanceHospital('')
    setAmbulanceError('')
  }

  const handleShareLocation = () => {
    if (!ambulanceDriver) return
    if (!navigator.geolocation) {
      setAmbulanceError('Location sharing is not supported by this browser.')
      return
    }
    setAmbulanceError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const shared = {
          ...ambulanceDriver,
          latitude: coords.latitude,
          longitude: coords.longitude,
          sharedAt: new Date().toISOString()
        }
        const nextAmbulances = [shared]
        localStorage.setItem('mediconnect_shared_ambulances', JSON.stringify(nextAmbulances))
        setSharedAmbulances(nextAmbulances)
        setIsSharingLocation(true)
      },
      () => setAmbulanceError('Location permission was not granted. Please allow location access and try again.'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleStopSharingLocation = () => {
    localStorage.removeItem('mediconnect_shared_ambulances')
    setSharedAmbulances([])
    setIsSharingLocation(false)
  }

  const updateAmbulanceRequestLocation = (requestId, latitude, longitude) => {
    const requests = readAmbulanceRequests()
    const nextRequests = requests.map((request) => request.id === requestId
      ? { ...request, latitude, longitude, updatedAt: new Date().toISOString() }
      : request)
    localStorage.setItem('mediconnect_ambulance_requests', JSON.stringify(nextRequests))
    setAmbulanceRequests(nextRequests)
  }

  const handleCallAmbulance = (ambulance) => {
    if (!navigator.geolocation) {
      setLocationError('Location access is not supported by this browser. Please call the ambulance directly.')
      setVisibleAmbulancePhone(ambulance.phone)
      return
    }
    setLocationError('')
    setVisibleAmbulancePhone(ambulance.phone)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const request = {
          id: `${Date.now()}-${ambulance.phone}`,
          ambulancePhone: ambulance.phone,
          hospital: ambulance.hospital,
          patientName: currentUser?.name || patientName.trim() || 'Patient',
          patientPhone: currentUser?.email || 'Not provided',
          latitude: coords.latitude,
          longitude: coords.longitude,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        const nextRequests = [...readAmbulanceRequests(), request]
        localStorage.setItem('mediconnect_ambulance_requests', JSON.stringify(nextRequests))
        setAmbulanceRequests(nextRequests)
        setUserLocation({ latitude: coords.latitude, longitude: coords.longitude })
        activeAmbulanceRequestIdRef.current = request.id
        if (patientLocationWatchRef.current === null && navigator.geolocation.watchPosition) {
          patientLocationWatchRef.current = navigator.geolocation.watchPosition(
            ({ coords: updatedCoords }) => {
              setUserLocation({ latitude: updatedCoords.latitude, longitude: updatedCoords.longitude })
              updateAmbulanceRequestLocation(request.id, updatedCoords.latitude, updatedCoords.longitude)
            },
            () => setLocationError('Live tracking was interrupted. The driver can still use your last shared location.'),
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
          )
        }
      },
      () => setLocationError('Location permission was not granted. Please allow access so the driver can find you, then try again.'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleAmbulanceRequestStatus = (requestId, status) => {
    const nextRequests = readAmbulanceRequests().map((request) => request.id === requestId
      ? { ...request, status, updatedAt: new Date().toISOString() }
      : request)
    localStorage.setItem('mediconnect_ambulance_requests', JSON.stringify(nextRequests))
    setAmbulanceRequests(nextRequests)
  }

  const handleAmbulanceLogout = () => {
    handleStopSharingLocation()
    localStorage.removeItem('mediconnect_ambulance_driver')
    setAmbulanceDriver(null)
  }

  const handleFindNearestHospital = () => {
    if (!navigator.geolocation) {
      setLocationError('Location access is not supported by this browser. Please open MediConnect in a current browser.')
      return
    }
    setLocationError('')
    setIsLocatingUser(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ latitude: coords.latitude, longitude: coords.longitude })
        setIsLocatingUser(false)
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location access is off. Turn on Location Services in your phone or computer settings, allow this site in your browser, then try again.')
        } else if (error.code === error.TIMEOUT) {
          setLocationError('We could not get your location in time. Check that Location Services are on and try again.')
        } else {
          setLocationError('We could not determine your location. Turn on Location Services and try again.')
        }
        setIsLocatingUser(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const resetForm = () => {
    setSpecialty('')
    setDoctorId('')
    setPatientType('Myself')
    setPatientName(currentUser?.name || '')
    setPatientAge('26')
    setDate('')
    setTime('')
    setSeat(null)
    setShowPayment(false)
    setPaymentMethod('')
    setUtr('')
    setPaymentVerified(false)
    setIsAuthOpen(false)
    setLoginInput('')
    setLoginPassword('')
    setLoginError('')
  }

  const doctorList = specialty ? doctors[specialty].filter((doctor) => doctor.hospital.name === hospitalName) : []
  const dayOfWeek = date ? new Date(`${date}T00:00:00`).getDay() : null
  const isToday = date === getLocalDateString()
  const qrImage = `${import.meta.env.BASE_URL}payment-qr.svg`
  const nearestHospital = userLocation
    ? nearbyHospitals
      .map((hospital) => ({
        ...hospital,
        distance: distanceBetweenCoordinates(userLocation.latitude, userLocation.longitude, hospital.latitude, hospital.longitude)
      }))
      .sort((first, second) => first.distance - second.distance)[0]
    : null
  const closestHospitals = userLocation
    ? nearbyHospitals
      .map((hospital) => ({
        ...hospital,
        distance: distanceBetweenCoordinates(userLocation.latitude, userLocation.longitude, hospital.latitude, hospital.longitude)
      }))
      .sort((first, second) => first.distance - second.distance)
      .slice(0, 3)
    : []
  const hospitalMapUrl = userLocation
    ? `https://www.google.com/maps?q=hospitals+near+${userLocation.latitude},${userLocation.longitude}&output=embed`
    : 'https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d31330.61570071956!2d76.9745064!3d11.0140768!3m2!1i1024!2i768!4f13.1!2m1!1shospitals%20in%20coimbatore!5e0!3m2!1sen!2sin!4v1792769761565!5m2!1sen!2sin'
  const ambulanceMapUrl = sharedAmbulances.length
    ? `https://www.google.com/maps?q=${sharedAmbulances[0].latitude},${sharedAmbulances[0].longitude}&output=embed`
    : ''
  const driverRequests = ambulanceDriver
    ? ambulanceRequests.filter((request) => normalizeHospitalName(request.hospital) === normalizeHospitalName(ambulanceDriver.hospital) && request.status !== 'completed')
    : []

  return (
    <>
      <header className="navbar">
        <button type="button" className="brand" onClick={() => setCurrentPage('home')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <div className="brand-icon">+</div>
          MediConnect
        </button>
        <nav className="nav-links" aria-label="Primary navigation">
          <button type="button" className="nav-link-button" onClick={() => setCurrentPage('home')}>
            Why MediConnect
          </button>
          <button type="button" className="nav-link-button" onClick={() => setCurrentPage('booking')}>
            Book a visit
          </button>
          <button type="button" className="nav-link-button" onClick={() => setCurrentPage(adminUser ? 'admin-dashboard' : 'admin-login')}>
            {adminUser ? 'Admin dashboard' : 'Admin'}
          </button>
          <button type="button" className="nav-link-button ambulance-nav-link" onClick={() => setCurrentPage('ambulance')}>
            Ambulance
          </button>
        </nav>
        <div className="nav-actions">
          <button type="button" className="admin-mobile-link" onClick={() => setCurrentPage(adminUser ? 'admin-dashboard' : 'admin-login')}>
            {adminUser ? 'Admin' : 'Admin login'}
          </button>
          <button type="button" className="ambulance-mobile-link" onClick={() => setCurrentPage('ambulance')}>
            Ambulance
          </button>
          <div id="userProfile" className="user-pill" style={{ display: currentUser ? 'inline-flex' : 'none' }}>
            <span></span>
            <span id="userNameText">{currentUser?.name || 'Guest'}</span>
          </div>
          <button
            id="authTriggerBtn"
            className="auth-btn"
            type="button"
            onClick={currentPage === 'admin-dashboard' ? handleAdminLogout : currentUser ? handleLogout : () => setIsAuthOpen(true)}
          >
            {currentPage === 'admin-dashboard' ? 'Admin logout' : currentUser ? 'Logout' : 'Login / Register'}
          </button>
        </div>
      </header>

      {currentPage === 'hospitals' ? (
        <main className="map-page">
          <div className="map-heading">
            <div>
              <p className="booking-kicker">Find care nearby</p>
              <h1>Find the nearest hospital</h1>
              <p className="map-description">Share your location to see hospitals near you and get directions faster.</p>
            </div>
            <button type="button" className="map-back-button" onClick={() => setCurrentPage('home')}>Back to MediConnect</button>
          </div>
          <section className="location-finder-card" aria-label="Find nearest hospital">
            <div className="location-finder-copy">
              <span className="location-pin-icon" aria-hidden="true"></span>
              <div>
                <strong>{nearestHospital ? 'Your nearest hospital' : 'Use your location'}</strong>
                <p>{nearestHospital ? `${nearestHospital.name} is approximately ${nearestHospital.distance.toFixed(1)} km away.` : 'Turn on Location Services, allow browser access, and share your current location.'}</p>
              </div>
            </div>
            <button type="button" className="location-share-button" onClick={handleFindNearestHospital} disabled={isLocatingUser}>
              {isLocatingUser ? 'Finding hospitals...' : userLocation ? 'Update my location' : 'Share my location'}
            </button>
          </section>
          {!userLocation && !locationError && (
            <ol className="location-steps">
              <li><strong>Turn on Location</strong> in your phone or computer settings.</li>
              <li><strong>Allow location access</strong> when your browser asks.</li>
              <li>Select <strong>Share my location</strong> to find the nearest hospital.</li>
            </ol>
          )}
          {locationError && <p className="location-error" role="alert">{locationError}</p>}
          {nearestHospital && (
            <section className="nearest-hospital-card" aria-label="Nearest hospital">
              <div>
                <p className="booking-kicker">Recommended for you</p>
                <h2>{nearestHospital.name}</h2>
                <p>{nearestHospital.location} | {nearestHospital.distance.toFixed(1)} km away</p>
              </div>
              <a className="directions-button" href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${nearestHospital.latitude},${nearestHospital.longitude}`} target="_blank" rel="noopener noreferrer">Get directions </a>
            </section>
          )}
          <section className="closest-hospitals-card" aria-label="Three closest hospitals">
            <div className="closest-hospitals-heading">
              <div>
                <p className="booking-kicker">Emergency care shortlist</p>
                <h2>Three closest hospitals</h2>
                <p>Hospitals are ranked from your shared live location.</p>
              </div>
              <span className="hospital-count-badge">{closestHospitals.length || 0} nearby</span>
            </div>
            {closestHospitals.length ? (
              <div className="closest-hospital-list">
                {closestHospitals.map((hospital, index) => {
                  const sharedAmbulance = sharedAmbulances.find((ambulance) => normalizeHospitalName(ambulance.hospital) === normalizeHospitalName(hospital.name))
                  return (
                    <article className="closest-hospital-item" key={hospital.name}>
                      <span className="hospital-rank">{index + 1}</span>
                      <div className="closest-hospital-info">
                        <strong>{hospital.name}</strong>
                        <p>{hospital.location}  {hospital.distance.toFixed(1)} km away</p>
                        <span className={sharedAmbulance ? 'ambulance-availability available' : 'ambulance-availability'}>
                          {sharedAmbulance ? 'Ambulance available now' : 'No shared ambulance currently'}
                        </span>
                      </div>
                      <div className="closest-hospital-actions">
                        <a className="directions-button" href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${hospital.latitude},${hospital.longitude}`} target="_blank" rel="noopener noreferrer">Directions</a>
                        {sharedAmbulance && (
                          <button type="button" className="emergency-call-button" onClick={() => handleCallAmbulance(sharedAmbulance)}>
                            Call ambulance
                          </button>
                        )}
                      </div>
                      {visibleAmbulancePhone === sharedAmbulance?.phone && (
                        <div className="ambulance-number-reveal" role="status">
                          <span>Registered ambulance number</span>
                          <strong>+91 {sharedAmbulance.phone}</strong>
                          {ambulanceRequests.some((request) => request.ambulancePhone === sharedAmbulance.phone && request.status !== 'completed') && (
                            <small className="ambulance-request-status">Your location is shared with this driver. Live tracking is active.</small>
                          )}
                          <a href={`tel:+91${sharedAmbulance.phone}`}>Call now</a>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="closest-hospitals-empty">Share your location above to see the three closest hospitals and emergency ambulance actions.</div>
            )}
          </section>
          <section className="ambulance-nearby-card" aria-label="Ambulance details near hospitals">
            <div className="ambulance-nearby-heading">
              <div>
                <p className="booking-kicker">Emergency support</p>
                <h2>Ambulances near hospitals</h2>
                <p>See available ambulance details and the location shared by a driver.</p>
              </div>
              <button type="button" className="ambulance-details-button" onClick={() => setShowAmbulanceDetails((visible) => !visible)}>
                {showAmbulanceDetails ? 'Hide ambulance details' : 'View ambulance details'}
              </button>
            </div>
            {showAmbulanceDetails && (
              sharedAmbulances.length ? (
                <div className="ambulance-details-content">
                  <div className="shared-ambulance-list">
                    {sharedAmbulances.map((ambulance) => (
                      <article className="shared-ambulance" key={ambulance.phone}>
                        <div className="shared-ambulance-icon">+</div>
                        <div>
                          <strong>{ambulance.hospital} ambulance</strong>
                          <p>Driver ID  +91 {ambulance.phone}  Location shared now</p>
                          <p>{ambulance.latitude.toFixed(5)}, {ambulance.longitude.toFixed(5)}</p>
                        </div>
                        <a className="location-link" href={`https://www.google.com/maps/dir/?api=1&destination=${ambulance.latitude},${ambulance.longitude}`} target="_blank" rel="noopener noreferrer">Open ambulance location </a>
                      </article>
                    ))}
                  </div>
                  <iframe
                    className="ambulance-location-map"
                    src={ambulanceMapUrl}
                    title="Shared ambulance location map"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : (
                <div className="ambulance-details-empty">No ambulance driver is sharing a location right now. Drivers can share their location from the Ambulance portal.</div>
              )
            )}
          </section>
          <iframe
            className="hospital-map"
            src={hospitalMapUrl}
            title={userLocation ? 'Hospitals near your location' : 'Hospitals in Coimbatore on Google Maps'}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </main>
      ) : currentPage === 'ambulance' ? (
        <main className="ambulance-page">
          <section className="ambulance-hero">
            <div>
              <p className="booking-kicker">Emergency response network</p>
              <h1>Ambulance driver portal</h1>
              <p className="admin-description">Sign in with your phone number, add your hospital, and share your live location with nearby users.</p>
            </div>
            <div className="ambulance-hero-icon" aria-hidden="true">+</div>
          </section>
          {!ambulanceDriver ? (
            <section className="ambulance-card ambulance-login-card">
              <p className="ambulance-card-kicker">Driver access</p>
              <h2>Sign in to share your ambulance</h2>
              <form onSubmit={handleAmbulanceLogin}>
                <label htmlFor="ambulancePhone">Phone number</label>
                <input id="ambulancePhone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" required value={ambulancePhone} onChange={(event) => setAmbulancePhone(event.target.value)} />
                <label htmlFor="ambulanceHospital">Hospital you work for</label>
                <input id="ambulanceHospital" type="text" placeholder="e.g. PSG Hospitals" required value={ambulanceHospital} onChange={(event) => setAmbulanceHospital(event.target.value)} />
                {ambulanceError && <p className="ambulance-error" role="alert">{ambulanceError}</p>}
                <button type="submit" className="btn btn-primary">Continue as ambulance driver</button>
              </form>
              <p className="ambulance-note">Your phone number is used as your driver ID in this browser.</p>
            </section>
          ) : (
            <section className="ambulance-dashboard-card">
              <div className="ambulance-driver-heading">
                <div>
                  <p className="ambulance-card-kicker">Driver signed in</p>
                  <h2>{ambulanceDriver.hospital}</h2>
                  <p className="admin-description">Driver ID  +91 {ambulanceDriver.phone}</p>
                </div>
                <button type="button" className="auth-btn" onClick={handleAmbulanceLogout}>Sign out</button>
              </div>
              <div className={`location-status ${isSharingLocation ? 'location-status-active' : ''}`}>
                <span className="location-status-dot" />
                <div>
                  <strong>{isSharingLocation ? 'Location is being shared' : 'Location sharing is off'}</strong>
                  <p>{isSharingLocation ? 'Users can see this ambulance location on MediConnect.' : 'Share your current position so users can find help nearby.'}</p>
                </div>
              </div>
              {ambulanceError && <p className="ambulance-error" role="alert">{ambulanceError}</p>}
              {isSharingLocation ? (
                <button type="button" className="btn btn-secondary" onClick={handleStopSharingLocation}>Stop sharing location</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleShareLocation}>Share my current location</button>
              )}
              <section className="driver-request-panel" aria-label="Patient ambulance requests">
                <div className="ambulance-panel-heading">
                  <div>
                    <p className="ambulance-card-kicker">Incoming requests</p>
                    <h2>{driverRequests.length ? `${driverRequests.length} patient${driverRequests.length === 1 ? '' : 's'} need help` : 'No active patient requests'}</h2>
                  </div>
                  <span className="live-badge"><span /> AUTO-REFRESH</span>
                </div>
                {driverRequests.length ? (
                  <div className="driver-request-list">
                    {driverRequests.map((request) => (
                      <article className="driver-request" key={request.id}>
                        <div>
                          <strong>{request.patientName}</strong>
                          <p>{request.patientPhone}  {request.status === 'accepted' ? 'Accepted' : 'Waiting for response'}</p>
                          <p className="request-coordinates">Live location: {request.latitude.toFixed(5)}, {request.longitude.toFixed(5)}</p>
                          <small>Updated {new Date(request.updatedAt).toLocaleTimeString()}</small>
                        </div>
                        <div className="driver-request-actions">
                          <a className="location-link" href={`https://www.google.com/maps/dir/?api=1&destination=${request.latitude},${request.longitude}`} target="_blank" rel="noopener noreferrer">Navigate </a>
                          {request.status !== 'accepted' && (
                            <button type="button" className="btn btn-primary" onClick={() => handleAmbulanceRequestStatus(request.id, 'accepted')}>Accept request</button>
                          )}
                          <button type="button" className="btn btn-secondary" onClick={() => handleAmbulanceRequestStatus(request.id, 'completed')}>Complete</button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="ambulance-details-empty">Patient requests for {ambulanceDriver.hospital} will appear here with a live location.</p>
                )}
              </section>
            </section>
          )}
          <section className="ambulance-card ambulance-user-panel">
            <div className="ambulance-panel-heading">
              <div>
                <p className="ambulance-card-kicker">For patients and hospitals</p>
                <h2>Available ambulances</h2>
              </div>
              <span className="live-badge"><span /> LIVE</span>
            </div>
            {sharedAmbulances.length ? (
              <div className="shared-ambulance-list">
                {sharedAmbulances.map((ambulance) => {
                  const patientRequest = ambulanceRequests.find((request) => request.ambulancePhone === ambulance.phone && request.status !== 'completed')
                  const patientMapUrl = patientRequest
                    ? `https://www.google.com/maps?q=${patientRequest.latitude},${patientRequest.longitude}&output=embed`
                    : ''
                  return (
                    <article className={`shared-ambulance ${patientRequest ? 'shared-ambulance-tracking' : ''}`} key={ambulance.phone}>
                      {patientRequest ? (
                        <>
                          <div className="shared-ambulance-tracking-heading">
                            <div className="shared-ambulance-icon">+</div>
                            <div>
                              <strong>Patient location shared</strong>
                              <p>{patientRequest.patientName}  Live location updates enabled</p>
                            </div>
                            <span className="live-badge"><span /> TRACKING</span>
                          </div>
                          <iframe
                            className="patient-location-map"
                            src={patientMapUrl}
                            title={`Live location for ${patientRequest.patientName}`}
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                          <div className="shared-ambulance-location-footer">
                            <span>{patientRequest.latitude.toFixed(5)}, {patientRequest.longitude.toFixed(5)}</span>
                            <a className="location-link" href={`https://www.google.com/maps/dir/?api=1&destination=${patientRequest.latitude},${patientRequest.longitude}`} target="_blank" rel="noopener noreferrer">Navigate to patient </a>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="shared-ambulance-icon">+</div>
                          <div>
                            <strong>{ambulance.hospital} ambulance</strong>
                            <p>Driver available  Location shared just now</p>
                          </div>
                          <a className="location-link" href={`https://www.google.com/maps?q=${ambulance.latitude},${ambulance.longitude}`} target="_blank" rel="noopener noreferrer">Open map </a>
                        </>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="ambulance-empty-state"><span aria-hidden="true"></span><p>No ambulance locations are being shared right now.</p></div>
            )}
          </section>
        </main>
      ) : currentPage === 'admin-login' ? (
        <main className="admin-page">
          <section className="admin-login-panel">
            <p className="booking-kicker">MediConnect administration</p>
            <h1>Admin sign in</h1>
            <p className="admin-description">Sign in to review confirmed patient appointments.</p>
            <form onSubmit={handleAdminLogin}>
              <label htmlFor="adminEmail">Hospital admin username</label>
              <input id="adminEmail" type="text" autoComplete="username" placeholder="Enter the exact hospital name" required value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} />
              <label htmlFor="adminPassword">Password</label>
              <input id="adminPassword" type="password" autoComplete="current-password" required value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} />
              {adminLoginError && <p className="admin-login-error" role="alert">{adminLoginError}</p>}
              <button type="submit" className="btn btn-primary">Sign in to admin</button>
            </form>
            <p className="admin-demo-note">Username: exact hospital name (for example, PSG Hospitals)<br />Password: Admin@123</p>
          </section>
        </main>
      ) : currentPage === 'admin-dashboard' && adminUser ? (
        <main className="admin-page admin-dashboard">
          <div className="admin-heading">
            <div>
              <p className="booking-kicker">MediConnect administration</p>
              <h1>{adminHospital} appointments</h1>
              <p className="admin-description">Patient and visit details for confirmed bookings at this hospital.</p>
            </div>
            <div className="admin-total"><strong>{appointments.length}</strong><span>Total bookings</span></div>
          </div>
          {appointments.length ? (
            <div className="appointments-table-wrap">
              <table className="appointments-table">
                <thead><tr><th>Patient</th><th>Contact</th><th>Doctor &amp; hospital</th><th>Visit</th><th>Token</th><th>Payment</th></tr></thead>
                <tbody>
                  {[...appointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)).map((appointment) => (
                    <tr key={appointment.id}>
                      <td><strong>{appointment.patientName}</strong><span>{appointment.patientAge} years  For {appointment.patientType}</span></td>
                      <td>{appointment.patientEmail || 'Not provided'}</td>
                      <td><strong>{appointment.doctorName}</strong><span>{appointment.hospital}</span></td>
                      <td><strong>{appointment.date}</strong><span>{appointment.time}</span></td>
                      <td><span className="appointment-token">#{appointment.seat}</span></td>
                      <td><strong>{appointment.paymentMethod || 'Not recorded'}</strong><span>{appointment.paymentStatus || 'Status unavailable'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-state"><strong>No appointments yet</strong><p>Confirmed bookings will appear here.</p></div>
          )}
        </main>
      ) : currentPage === 'home' ? (
        <>
          <main id="top">
            <section className="landing-hero">
              <div className="landing-copy">
                <div className="eyebrow"><span className="eyebrow-dot" /> Healthcare, made easier</div>
                <h1>Better care starts with a <em>simpler visit.</em></h1>
                <p className="landing-lede">Find trusted specialists, choose a convenient OPD slot, and reserve your token before you arrive.</p>
                <div className="landing-actions">
                  <button type="button" className="landing-cta" onClick={() => setCurrentPage('booking')}>Book an appointment <span aria-hidden="true"></span></button>
                  <a className="landing-secondary" href="#services">Explore the experience <span aria-hidden="true"></span></a>
                </div>
                <div className="landing-proof">
                  <div className="proof-avatars" aria-hidden="true"><span>PN</span><span>RM</span><span>SK</span></div>
                  <p><strong>Trusted by patients across Coimbatore</strong><br /><span>Real specialists  Live OPD availability</span></p>
                </div>
              </div>
              <div className="landing-art" aria-label="MediConnect appointment illustration">
                <div className="art-glow" />
                <div className="art-card art-card-top"><span className="art-icon"></span><div><strong>Appointment confirmed</strong><small>Today, 10:00 AM</small></div></div>
                <div className="art-card art-card-bottom"><span className="pulse-dot" /><div><strong>Live token updates</strong><small>Know before you go</small></div></div>
              </div>
            </section>

            <section className="service-strip" id="services" aria-label="Locate hospitals">
              <button type="button" className="hospital-locator-button" onClick={() => setCurrentPage('hospitals')}>
                Locate hospitals <span aria-hidden="true"></span>
              </button>
            </section>
          </main>
        </>
      ) : (
        <div className="container" id="booking">
          <div className="booking-intro">
          <div>
            <p className="booking-kicker">Your care, your time</p>
            <h2>Reserve your OPD token</h2>
            <p>Select a specialty and doctor to see the next available visit.</p>
          </div>
          <div className="location-bar">
             <span id="locationText">Coimbatore, Tamil Nadu</span>
          </div>
        </div>

        <div className="queue-ticker">
          <div>
            <span className="queue-live-tag"> Live OPD</span>
            <span>Coimbatore OPD Central: <strong style={{ color: '#38bdf8' }}>Token #4</strong> in Consultation</span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}> Avg Consultation: ~6 mins</div>
        </div>

        <div className="booking-layout">
          <div className="booking-form-column">
            <div className="symptom-section">
              <div className="section-title"> Quick Symptom Matcher (Click to auto-select)</div>
              <div className="chip-grid">
                <div className="s-chip" onClick={() => handleSymptomMatch('ENT')}> Ear / Throat Pain</div>
                <div className="s-chip" onClick={() => handleSymptomMatch('CARDIOLOGY')}> Chest Pain / High BP</div>
                <div className="s-chip" onClick={() => handleSymptomMatch('NEUROSURGERY')}> Headache / Spine Pain</div>
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
            <select value={patientType} onChange={(e) => setPatientType(e.target.value)} aria-label="Who is booking for">
              <option value="Myself">Whom is booking for? Myself</option>
              <option value="Father">Whom is booking for? Father</option>
              <option value="Mother">Whom is booking for? Mother</option>
              <option value="Spouse">Whom is booking for? Spouse</option>
              <option value="Child">Whom is booking for? Child</option>
            </select>
          </div>
          <div className="family-row" style={{ marginTop: '12px' }}>
            <input
              type="text"
              id="patientName"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              aria-label="Patient Name"
            />
            <input
              type="number"
              id="patientAge"
              placeholder="Age"
              min="1"
              max="110"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              aria-label="Patient Age"
            />
          </div>

          <div className="step-title">2. Hospital / Branch</div>
          <select value={hospitalName} onChange={handleHospitalChange} aria-label="Select hospital branch">
            <option value="">-- Choose Hospital Branch --</option>
            {hospitalBranches.map((hospital) => (
              <option key={hospital.name} value={hospital.name}>{hospital.name}  {hospital.location}</option>
            ))}
          </select>

          <div className="step-title">3. Medical Specialty</div>
          <select value={specialty} disabled={!hospitalName} onChange={(e) => { setSpecialty(e.target.value); setDoctorId(''); setDate(''); setTime(''); setSeat(null); setShowPayment(false); setUtr(''); setPaymentVerified(false); }}>
            <option value="">-- Choose Medical Specialty --</option>
            <option value="ENT">ENT (Ear, Nose &amp; Throat)</option>
            <option value="CARDIOLOGY">Cardiology &amp; Heart Care</option>
            <option value="NEUROSURGERY">Neurosurgery &amp; Spine</option>
          </select>

          <div className="step-title">4. Specialist Doctor</div>
          <select value={doctorId} onChange={handleDoctorSelect} disabled={!specialty || !hospitalName}>
            {!specialty ? (
              <option value="">Select specialty first</option>
            ) : (
              <>
                <option value="">{doctorList.length ? 'Select a Specialist' : 'No doctor available at this branch'}</option>
                {doctorList.map((doc) => <option key={doc.id} value={doc.id}>{doc.name} ({doc.hospital.name})</option>)}
              </>
            )}
          </select>
          {selectedDoctor && (
            <div className="doctor-details-box" style={{ display: 'block' }}>
              <div> <strong>{selectedDoctor.hospital.name}</strong>  {selectedDoctor.hospital.location}</div>
              <div> <strong>OPD Timings:</strong> {selectedDoctor.schedule}</div>
            </div>
          )}

          <div className="step-title">5. Consultation Date</div>
          <input
            type="date"
            id="dateInput"
            value={date}
            onChange={handleDateChange}
            disabled={!selectedDoctor}
          />
          {dayOfWeek === 0 && (
            <div id="sundayNotice" style={{ display: 'block', color: 'var(--danger)', fontSize: '12px', fontWeight: 700, marginTop: '6px' }}>
               Outpatient clinics are closed on Sundays. Emergency OPD is open 24/7.
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
                           {slotValue}
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
                <span> 6. Token / Seat Assignment</span>
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
                Proceed to Token Payment 
              </button>
            </div>
          )}

          {showPayment && selectedDoctor && (
            <div id="paymentArea" style={{ display: 'block' }}>
              <div id="bookingSummary" className="booking-summary">
                <div className="summary-item"><strong>Patient Profile</strong>{patientName || patientType} ({patientAge} Yrs)</div>
                <div className="summary-item"><strong>Doctor</strong>{selectedDoctor.name}</div>
                <div className="summary-item"><strong>Hospital</strong>{selectedDoctor.hospital.name}</div>
                <div className="summary-item"><strong>Date &amp; Slot</strong>{date}  {time}</div>
                <div className="summary-item"><strong>Token Assigned</strong>Token #{seat}</div>
                <div className="summary-item"><strong>OPD Status</strong>On Schedule</div>
              </div>
              <fieldset className="payment-choice">
                <legend>Choose how you will pay</legend>
                <label className={`payment-choice-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => { setPaymentMethod('online'); setPaymentVerified(false); setUtr(''); }} />
                  <span><strong>Pay online</strong><small>UPI payment</small></span>
                </label>
                <label className={`payment-choice-option ${paymentMethod === 'hospital' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="hospital" checked={paymentMethod === 'hospital'} onChange={() => { setPaymentMethod('hospital'); setPaymentVerified(false); setUtr(''); }} />
                  <span><strong>Pay at hospital</strong><small>Pay during your visit</small></span>
                </label>
              </fieldset>

              {paymentMethod === 'online' && (
                <>
                  <div className="gpay-badge"> Google Pay / PhonePe UPI</div>
                  <div id="qrContainer">
                    <img src={qrImage} alt="UPI QR" style={{ borderRadius: '8px', width: '160px', height: '160px' }} />
                  </div>
                  <p className="payment-demo-note">Demo flow: enter the UTR from your payment. This page checks its format only; it does not process or verify a real payment.</p>
                  <div className="utr-verify-box">
                    <label htmlFor="utrNumberInput" style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                      Enter the 12-digit UPI reference / UTR:
                    </label>
                    <input type="text" id="utrNumberInput" placeholder="e.g. 423819208391" maxLength="12" value={utr} onChange={(e) => { setUtr(e.target.value); setPaymentVerified(false); }} />
                    <button id="verifyBtn" type="button" className="btn btn-verify" onClick={handleVerify} style={{ marginTop: '8px' }}>
                      Process online payment
                    </button>
                  </div>
                  {paymentVerified && <div id="payStatus" className="status-box status-verified" role="status">UTR format checked. Submit your appointment below.</div>}
                </>
              )}

              {paymentMethod === 'hospital' && <div className="status-box status-waiting" role="status">Payment is due at the hospital during your visit.</div>}

              {canSubmitAppointment && (
                <button id="confirmBtn" type="button" className="btn btn-primary" onClick={handleConfirmBooking}>
                  Submit appointment
                </button>
              )}
            </div>
          )}

          <button className="btn btn-secondary" onClick={resetForm} style={{ marginTop: '16px' }}>
            Reset Form
          </button>
            </main>
          </div>
          <PrescriptionAttachments />
        </div>

        <div className="footer">
           2026 MediConnect  <a className="medai-footer-button" href="https://jeevinth008-pixel.github.io/Mediconnect/" target="_blank" rel="noopener noreferrer">MedAI</a>
        </div>
      </div>
      )}

      <div id="authModal" className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="authTitle" style={{ display: isAuthOpen ? 'grid' : 'none' }}>
        <div className="modal-card">
          <button className="modal-close" type="button" aria-label="Close sign in" onClick={() => setIsAuthOpen(false)}></button>
          <p className="modal-kicker">MediConnect account</p>
          <h3 id="authTitle">Patient Sign In</h3>
          <p className="modal-copy">Sign in to keep your appointments and patient details together.</p>
          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <div className="auth-field">
                <label htmlFor="patientName">Full Name</label>
                <input type="text" id="patientName" placeholder="Enter patient name" required value={patientName} onChange={(e) => setPatientName(e.target.value)} />
              </div>
              <div className="auth-field">
                <label htmlFor="patientAge">Age</label>
                <input type="number" id="patientAge" min="1" max="120" required value={patientAge} onChange={(e) => setPatientAge(e.target.value)} />
              </div>
              <div className="auth-field">
                <label htmlFor="patientGender">Gender</label>
                <select id="patientGender" required value={patientGender} onChange={(e) => setPatientGender(e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="auth-field">
                <label htmlFor="patientAddress">Address</label>
                <textarea id="patientAddress" placeholder="Enter your address" required value={patientAddress} onChange={(e) => setPatientAddress(e.target.value)} />
              </div>
              <div className="auth-field">
                <label htmlFor="profilePhoto">Profile Photo (Optional, max 1 MB)</label>
                <input type="file" id="profilePhoto" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (file.size > 1024 * 1024) { setLoginError('Photo must be smaller than 1 MB.'); e.target.value = ''; return }
                  const reader = new FileReader()
                  reader.onload = () => setProfilePhoto(reader.result)
                  reader.readAsDataURL(file)
                  setLoginError('')
                }} />
              </div>
              <label htmlFor="loginId">Email or mobile</label>
              <input type="text" id="loginId" placeholder="name@domain.com" autoComplete="username" required value={loginInput} onChange={(e) => { setLoginInput(e.target.value); setLoginError('') }} />
            </div>
            <div className="auth-field">
              <label htmlFor="loginPassword">Password</label>
              <input type="password" id="loginPassword" placeholder="At least 6 characters" autoComplete="current-password" required value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value); setLoginError('') }} />
            </div>
            {loginError && <p className="auth-error" role="alert">{loginError}</p>}
            <button type="submit" className="btn btn-primary">Login Now</button>
          </form>
        </div>
      </div>

    </>
  )
}

export default App
