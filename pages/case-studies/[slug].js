import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getAllSlugs, getCaseStudy } from '../../lib/case-studies'

const ACCENT = ['#FE602F', '#64CEBB', '#E6C7EB', '#F5C645']

// ── Password Gate ──────────────────────────────────────────
function PasswordGate({ title, onUnlock }) {
  const [value, setValue]   = useState('')
  const [error, setError]   = useState(false)
  const [shake, setShake]   = useState(false)
  const [loading, setLoading] = useState(false)

  async function attempt() {
    if (!value) return
    setLoading(true)
    try {
      const res = await fetch('/api/unlock', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: value }),
      })
      if (res.ok) {
        onUnlock()
      } else {
        setError(true); setShake(true); setValue('')
        setTimeout(() => setShake(false), 500)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}.shake{animation:shake .5s ease}`}</style>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'40px 24px' }}>
        <div style={{ maxWidth:420, width:'100%', textAlign:'center' }}>
          <div style={{ fontSize:52, marginBottom:24 }}>🔒</div>
          <h1 style={{ fontFamily:'"Reenie Beanie", cursive', fontSize:48, color:'var(--text)', marginBottom:8, lineHeight:1 }}>{title}</h1>
          <p style={{ fontFamily:'Lato, sans-serif', fontSize:18, color:'var(--text)', opacity:0.65, marginBottom:36, lineHeight:1.6 }}>Enter password to view this content.</p>
          <div className={shake ? 'shake' : ''} style={{ display:'flex', gap:8 }}>
            <input type="password" value={value} onChange={(e) => { setValue(e.target.value); setError(false) }}
              onKeyDown={(e) => e.key==='Enter' && attempt()} placeholder="Password" autoFocus
              style={{ flex:1, padding:'12px 16px', borderRadius:10, border:`2px solid ${error ? '#FE602F' : 'rgba(128,128,128,0.3)'}`, background:'transparent', color:'var(--text)', fontFamily:'Lato, sans-serif', fontSize:16, outline:'none' }} />
            <button onClick={attempt} disabled={loading}
              style={{ padding:'12px 24px', borderRadius:10, border:'none', background:'#64CEBB', color:'white', fontFamily:'Lato, sans-serif', fontSize:16, fontWeight:700, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity='0.85' }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity='1' }}>{loading ? '...' : 'Enter'}</button>
          </div>
          {error && <p style={{ fontFamily:'Lato, sans-serif', fontSize:14, color:'#FE602F', marginTop:12 }}>Incorrect password. Try again.</p>}
          <div style={{ marginTop:40 }}>
            <Link href="/case-studies" style={{ fontFamily:'Lato, sans-serif', fontSize:14, color:'var(--text)', opacity:0.5, textDecoration:'none' }}>← Back to all work</Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Zoom modal for images ──────────────────────────────────
function ImageZoom({ src, alt, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler) }
  }, [])
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.92)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', cursor:'zoom-out' }}>
      <img src={src} alt={alt} style={{ maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', borderRadius:8 }} onClick={(e) => e.stopPropagation()} />
      <button onClick={onClose} style={{ position:'fixed', top:20, right:24, background:'none', border:'none', color:'white', fontSize:28, cursor:'pointer', opacity:0.7 }}>✕</button>
    </div>
  )
}

// ── Animated section wrapper ───────────────────────────────
function SlideIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.34,1.26,0.64,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────
export default function CaseStudyPage({ caseStudy }) {
  const [unlocked, setUnlocked] = useState(false)
  const [zoomImg, setZoomImg]   = useState(null)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    // Trigger hero animation on mount
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Make images in article zoomable
  useEffect(() => {
    const imgs = document.querySelectorAll('.case-study-body img')
    imgs.forEach((img) => {
      img.style.cursor = 'zoom-in'
      img.onclick = () => setZoomImg({ src: img.src, alt: img.alt })
    })
  })

  if (caseStudy.protected && !unlocked) {
    return (
      <>
        <Head><title>{caseStudy.title} — Shreya Krishnamurthy</title></Head>
        <Navbar />
        <PasswordGate title={caseStudy.title} onUnlock={() => setUnlocked(true)} />
      </>
    )
  }

  const accentColor = ACCENT[caseStudy.tags.length % ACCENT.length]

  return (
    <>
      <Head>
        <title>{caseStudy.title} — Shreya Krishnamurthy</title>
        <meta name="description" content={caseStudy.description} />
      </Head>
      <style>{`
        @keyframes cs-slide-up {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .cs-hero-tag    { animation: cs-slide-up .5s ease both; }
        .cs-hero-title  { animation: cs-slide-up .6s ease .1s both; }
        .cs-hero-desc   { animation: cs-slide-up .6s ease .2s both; }
        .cs-hero-meta   { animation: cs-slide-up .6s ease .3s both; }
        .cs-hero-imgs   { animation: cs-slide-up .7s ease .35s both; }
      `}</style>

      <Navbar />

      <div style={{ scrollSnapType:'y mandatory', overflowY:'scroll', height:'100vh' }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <div style={{
          scrollSnapAlign: 'start',
          height:          '100vh',
          background:      accentColor,
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'center',
          padding:         '0 80px',
          boxSizing:       'border-box',
          position:        'relative',
        }}>
          <div className="cs-hero-tag" style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {caseStudy.tags.map((tag) => (
              <span key={tag} style={{ fontSize:12, background:'rgba(255,255,255,0.25)', color:'white', padding:'4px 12px', borderRadius:9999, fontFamily:'Lato, sans-serif' }}>{tag}</span>
            ))}
          </div>
          <h1 className="cs-hero-title" style={{ fontFamily:'"Reenie Beanie", cursive', fontSize:'clamp(48px, 6vw, 82px)', color:'white', lineHeight:1, marginBottom:20 }}>
            {caseStudy.title}
          </h1>
          <p className="cs-hero-desc" style={{ fontFamily:'Lato, sans-serif', fontSize:17, color:'rgba(255,255,255,0.88)', maxWidth:580, lineHeight:1.7, marginBottom:16 }}>
            {caseStudy.description}
          </p>
          {/* Meta line: date · duration · role */}
          <p className="cs-hero-meta" style={{ fontFamily:'Lato, sans-serif', fontSize:13, color:'rgba(255,255,255,0.65)', marginBottom:36, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            {caseStudy.date && (
              <span>{new Date(caseStudy.date).toLocaleDateString('en-US', { year:'numeric', month:'long' })}</span>
            )}
            {caseStudy.duration && <><span style={{ fontSize:18, lineHeight:1 }}>·</span><span>{caseStudy.duration}</span></>}
            {caseStudy.role && <><span style={{ fontSize:18, lineHeight:1 }}>·</span><span>{caseStudy.role}</span></>}
          </p>
          {/* Three preview image slots */}
          <div className="cs-hero-imgs" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
            {[0,1,2].map((i) => {
              const src = caseStudy.previewImages?.[i]
              return (
                <div key={i} onClick={() => src && setZoomImg({ src, alt:`Preview ${i+1}` })}
                  style={{ height:200, borderRadius:10, overflow:'hidden', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', cursor: src ? 'zoom-in' : 'default' }}>
                  {src
                    ? <img src={src} alt={`Preview ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.35)', fontFamily:'Lato, sans-serif', fontSize:11 }}>[ preview {i+1} ]</div>
                  }
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────── */}
        <div style={{ scrollSnapAlign:'start', minHeight:'100vh', background:'var(--bg)', display:'grid', gridTemplateColumns:'280px 1fr' }}>

          {/* Left sidebar */}
          <div style={{ padding:'80px 36px 60px 60px', borderRight:'1px solid rgba(128,128,128,0.15)', position:'sticky', top:0, height:'100vh', boxSizing:'border-box', display:'flex', flexDirection:'column', gap:32 }}>
            <SlideIn delay={0.1}>
              {/* Problem */}
              {caseStudy.problem && (
                <div>
                  <div style={{ fontFamily:'Lato, sans-serif', fontSize:10, fontWeight:700, letterSpacing:1.5, opacity:0.5, textTransform:'uppercase', marginBottom:8, color:'var(--text)' }}>Problem</div>
                  <p style={{ fontFamily:'Lato, sans-serif', fontSize:13, lineHeight:1.65, color:'var(--text)', opacity:0.8, margin:0 }}>{caseStudy.problem}</p>
                </div>
              )}
            </SlideIn>
            <SlideIn delay={0.2}>
              {/* Solution */}
              {caseStudy.solution && (
                <div>
                  <div style={{ fontFamily:'Lato, sans-serif', fontSize:10, fontWeight:700, letterSpacing:1.5, opacity:0.5, textTransform:'uppercase', marginBottom:8, color:'var(--text)' }}>Solution</div>
                  <p style={{ fontFamily:'Lato, sans-serif', fontSize:13, lineHeight:1.65, color:'var(--text)', opacity:0.8, margin:0 }}>{caseStudy.solution}</p>
                </div>
              )}
            </SlideIn>
            <SlideIn delay={0.3}>
              {/* Prototype link */}
              {caseStudy.prototypeUrl && (
                <a href={caseStudy.prototypeUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:'block', padding:'10px 16px', borderRadius:9999, border:`2px solid ${accentColor}`, color:accentColor, fontFamily:'Lato, sans-serif', fontSize:13, fontWeight:700, textAlign:'center', textDecoration:'none', transition:'background 0.2s, color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background=accentColor; e.currentTarget.style.color='white' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=accentColor }}>
                  View Prototype →
                </a>
              )}
            </SlideIn>
          </div>

          {/* Right: article content */}
          <div style={{ padding:'80px 80px 80px 72px', minWidth:0 }}>
            <SlideIn delay={0.15}>
              <article
                className="case-study-body"
                style={{ fontFamily:'Lato, sans-serif', fontSize:17, lineHeight:1.9, color:'var(--text)' }}
                dangerouslySetInnerHTML={{ __html: caseStudy.contentHtml }}
              />
            </SlideIn>
            <div style={{ marginTop:48, paddingBottom:60 }}>
              <Link href="/case-studies" style={{ fontFamily:'Lato, sans-serif', fontSize:13, color:'var(--text)', borderBottom:`2px solid ${accentColor}`, paddingBottom:2, textDecoration:'none', opacity:0.7 }}>
                ← Back to all work
              </Link>
            </div>
          </div>
        </div>

        {/* Footer — full width outside the grid */}
        <div style={{ scrollSnapAlign:'none' }}>
          <Footer />
        </div>
      </div>

      {/* Image zoom modal */}
      {zoomImg && <ImageZoom src={zoomImg.src} alt={zoomImg.alt} onClose={() => setZoomImg(null)} />}
    </>
  )
}

export async function getStaticProps({ params }) {
  const caseStudy = await getCaseStudy(params.slug)
  return { props: { caseStudy } }
}

export async function getStaticPaths() {
  const slugs = getAllSlugs()
  return { paths: slugs.map((slug) => ({ params: { slug } })), fallback: false }
}
