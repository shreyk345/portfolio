import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

// Each nav label flashes a different accent color on hover
const NAV_COLORS = {
  Work:   '#FE602F',
  Play:   '#64CEBB',
  About:  '#E6C7EB',
  Resume: '#F5C645',
}

// Cloud SVG icon (matches the landing section cloud shape)
function CloudIcon() {
  return (
    <svg width="32" height="22" viewBox="0 0 200 85" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M 18 82 Q 4 82 4 68 L 4 62 A 22 22 0 0 1 28 40 A 28 28 0 0 1 80 22 A 32 32 0 0 1 140 18 A 24 24 0 0 1 178 38 A 20 20 0 0 1 196 58 L 196 68 Q 196 82 182 82 Z"/>
    </svg>
  )
}

// Star / plus icon for dark mode — rotates continuously
function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      style={{ animation: 'starSpin 8s linear infinite', display: 'block' }}>
      <rect x="10.5" y="0" width="3" height="24" rx="1.5"/>
      <rect x="0" y="10.5" width="24" height="3" rx="1.5"/>
    </svg>
  )
}

export default function Navbar() {
  const [dark, setDark]         = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState(null)
  const router = useRouter()
  const isHome = router.pathname === '/'

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  function goTo(id) {
    setMenuOpen(false)
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/#${id}`)
    }
  }

  const navItems = [
    { label: 'work',   action: () => goTo('work') },
    { label: 'play',   action: () => goTo('play') },
    { label: 'about',  action: () => goTo('about') },
    { label: 'resume', action: () => window.open('/resume.pdf', '_blank') },
  ]

  return (
    <nav style={{ background: 'var(--nav-bg)' }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between px-6 md:px-10 py-5">

        {/* Logo */}
        <Link href="/" aria-label="Home">
          <div style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <img src="/images/letter-blocks/k.png" alt="K"
              style={{ width:40, height:40, objectFit:'contain' }}
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}/>
            <div style={{ display:'none', width:40, height:40, background:'#FE602F', borderRadius:8,
              alignItems:'center', justifyContent:'center',
              fontFamily:'"Reenie Beanie", cursive', fontSize:26, color:'white', fontWeight:700 }}>K</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(({ label, action }) => (
            <button key={label} onClick={action}
              onMouseEnter={() => setHoveredNav(label)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: 14,
                fontWeight: 400,
                background: 'none', border: 'none', cursor: 'pointer',
                color: hoveredNav === label ? NAV_COLORS[label] : 'var(--text)',
                transition: 'color 0.15s ease',
                padding: '2px 0',
              }}>
              {label}
            </button>
          ))}

          {/* Mode toggle — icon only */}
          <button onClick={toggleDark} aria-label="Toggle dark mode"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text)', opacity: 0.75, padding: 4,
              display: 'flex', alignItems: 'center',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.75}>
            {dark ? <CloudIcon /> : <StarIcon />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontSize:22 }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-5 pt-2"
          style={{ background: 'var(--nav-bg)' }}>
          {navItems.map(({ label, action }) => (
            <button key={label} onClick={action}
              style={{ textAlign:'left', fontFamily:'Lato, sans-serif', fontSize:18,
                color:'var(--text)', background:'none', border:'none', cursor:'pointer' }}>
              {label}
            </button>
          ))}
          <button onClick={toggleDark}
            style={{ textAlign:'left', fontFamily:'Lato, sans-serif', fontSize:18,
              color:'var(--text)', background:'none', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', gap:8 }}>
            {dark ? <><CloudIcon /> Light mode</> : <><StarIcon /> Dark mode</>}
          </button>
        </div>
      )}
    </nav>
  )
}
