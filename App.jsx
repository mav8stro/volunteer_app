import { useState, useEffect } from 'react'

const API = 'http://localhost:5000'

const styles = {
  body: { fontFamily: 'sans-serif', maxWidth: 700, margin: '0 auto', padding: '2rem 1rem', color: '#1a1a1a' },
  nav: { display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #1c3a2e', paddingBottom: '1rem' },
  navBtn: (active) => ({
    background: active ? '#1c3a2e' : 'transparent',
    color: active ? '#fff' : '#1c3a2e',
    border: '2px solid #1c3a2e',
    padding: '0.4rem 1.2rem',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
  }),
  h1: { fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1c3a2e', marginBottom: '0.5rem' },
  h2: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1c3a2e', marginBottom: '1rem' },
  card: { border: '1px solid #ddd', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '0.75rem', background: '#fafaf8' },
  label: { display: 'block', fontWeight: 600, marginBottom: '0.3rem', marginTop: '1rem' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' },
  btn: { marginTop: '1.25rem', background: '#1c3a2e', color: '#fff', border: 'none', padding: '0.7rem 2rem', borderRadius: 6, fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  msg: (ok) => ({ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 6, background: ok ? '#edf7ee' : '#fdecea', color: ok ? '#1e6630' : '#b71c1c' }),
}

function Home({ setPage }) {
  return (
    <div>
      <h1 style={styles.h1}>🌱 Volunteer Nexus</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Connect with meaningful community events. Find your cause, show up, and make a difference.
      </p>
      <button style={styles.btn} onClick={() => setPage('events')}>Browse Events</button>
      <button style={{ ...styles.btn, marginLeft: '0.75rem', background: '#fff', color: '#1c3a2e', border: '2px solid #1c3a2e' }} onClick={() => setPage('register')}>
        Register as Volunteer
      </button>
    </div>
  )
}

function Events() {
  const [events, setEvents] = useState([])
  const [error, setError]   = useState('')

  useEffect(() => {
    fetch(`${API}/events`)
      .then(r => r.json())
      .then(setEvents)
      .catch(() => setError('Could not load events. Is the backend running?'))
  }, [])

  return (
    <div>
      <h2 style={styles.h2}>Upcoming Events</h2>
      {error && <p style={styles.msg(false)}>{error}</p>}
      {events.map(ev => (
        <div key={ev.id} style={styles.card}>
          <strong style={{ fontSize: '1.05rem' }}>{ev.title}</strong>
          <p style={{ margin: '0.3rem 0 0', color: '#555', fontSize: '0.9rem' }}>📅 {ev.date} &nbsp;|&nbsp; 📍 {ev.location}</p>
        </div>
      ))}
    </div>
  )
}

function Register() {
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg]     = useState(null)

  const submit = async () => {
    if (!name || !email) { setMsg({ ok: false, text: 'Please fill in both fields.' }); return }
    const res  = await fetch(`${API}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email }) })
    const data = await res.json()
    setMsg({ ok: res.ok, text: data.message || data.error })
    if (res.ok) { setName(''); setEmail('') }
  }

  return (
    <div>
      <h2 style={styles.h2}>Volunteer Registration</h2>
      <label style={styles.label}>Full Name</label>
      <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" />
      <label style={styles.label}>Email Address</label>
      <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" />
      <button style={styles.btn} onClick={submit}>Register</button>
      {msg && <p style={styles.msg(msg.ok)}>{msg.text}</p>}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div style={styles.body}>
      <nav style={styles.nav}>
        {['home', 'events', 'register'].map(p => (
          <button key={p} style={styles.navBtn(page === p)} onClick={() => setPage(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </nav>
      {page === 'home'     && <Home setPage={setPage} />}
      {page === 'events'   && <Events />}
      {page === 'register' && <Register />}
    </div>
  )
}
