import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getAllSlugs, getCaseStudy } from '../../lib/case-studies'

const PASSWORD = '!ntern2o25'

function PasswordGate({ title, onUnlock }) {
  const [value, setValue]   = useState('')
  const [error, setError]   = useState(false)
  const [shake, setShake]   = useState(false)

  function attempt() {
    if (value === PASSWORD) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        .shake { animation: shake 0.5s ease; }
      `}</style>
      <div style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--bg)',
        padding:        '40px 24px',
      }}>
        <div style={{
          maxWidth:    420,
          width:       '100%',
          textAlign:   'center',
        }}>
          {/* Lock icon */}
          <div style={{ fontSize: 52, marginBottom: 24 }}>🔒</div>

          <h1 style={{
            fontFamily:   '"Reenie Beanie", cursive',
            fontSize:     48,
            color:        'var(--text)',
            marginBottom: 8,
            lineHeight:   1,
          }}>
            {title}
          </h1>

          <p style={{
            fontFamily:   'Lato, sans-serif',
            fontSize:     18,
            color:        'var(--text)',
            opacity:      0.65,
            marginBottom: 36,
            lineHeight:   1.6,
          }}>
            Enter password to view this content.
          </p>

          <div className={shake ? 'shake' : ''} style={{ display:'flex', gap:8 }}>
            <input
              type="password"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && attempt()}
              placeholder="Password"
              autoFocus
              style={{
                flex:         1,
                padding:      '12px 16px',
                borderRadius: 10,
                border:       `2px solid ${error ? '#FE602F' : 'rgba(128,128,128,0.3)'}`,
                background:   'transparent',
                color:        'var(--text)',
                fontFamily:   'Lato, sans-serif',
                fontSize:     16,
                outline:      'none',
                transition:   'border-color 0.2s',
              }}
            />
            <button
              onClick={attempt}
              style={{
                padding:      '12px 24px',
                borderRadius: 10,
                border:       'none',
                background:   '#64CEBB',
                color:        'white',
                fontFamily:   'Lato, sans-serif',
                fontSize:     16,
                fontWeight:   700,
                cursor:       'pointer',
                transition:   'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Enter
            </button>
          </div>

          {error && (
            <p style={{
              fontFamily: 'Lato, sans-serif',
              fontSize:   14,
              color:      '#FE602F',
              marginTop:  12,
            }}>
              Incorrect password. Try again.
            </p>
          )}

          <div style={{ marginTop: 40 }}>
            <Link href="/case-studies" style={{
              fontFamily:     'Lato, sans-serif',
              fontSize:       14,
              color:          'var(--text)',
              opacity:        0.5,
              textDecoration: 'none',
            }}>
              ← Back to all work
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default function CaseStudyPage({ caseStudy }) {
  const [unlocked, setUnlocked] = useState(false)

  // Show password gate if protected and not yet unlocked
  if (caseStudy.protected && !unlocked) {
    return (
      <>
        <Head>
          <title>{caseStudy.title} — Shreya Krishnamurthy</title>
        </Head>
        <Navbar />
        <PasswordGate title={caseStudy.title} onUnlock={() => setUnlocked(true)} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{caseStudy.title} — Shreya Krishnamurthy</title>
        <meta name="description" content={caseStudy.description} />
      </Head>
      <Navbar />
      <main style={{ paddingTop:80, minHeight:'100vh' }}>
        <div style={{ background:'#FE602F', padding:'60px 40px 50px' }}>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {caseStudy.tags.map((tag) => (
              <span key={tag} style={{ fontSize:12, background:'rgba(255,255,255,0.25)', color:'white', padding:'3px 10px', borderRadius:9999, fontFamily:'Lato, sans-serif' }}>{tag}</span>
            ))}
          </div>
          <h1 style={{ fontFamily:'"Reenie Beanie", cursive', fontSize:'clamp(48px, 7vw, 80px)', color:'white', lineHeight:1, marginBottom:16 }}>
            {caseStudy.title}
          </h1>
          <p style={{ fontFamily:'Lato, sans-serif', fontSize:18, color:'rgba(255,255,255,0.88)', maxWidth:560, lineHeight:1.6 }}>
            {caseStudy.description}
          </p>
          {caseStudy.date && (
            <p style={{ marginTop:24, fontFamily:'Lato, sans-serif', fontSize:13, color:'rgba(255,255,255,0.65)' }}>
              {new Date(caseStudy.date).toLocaleDateString('en-US', { year:'numeric', month:'long' })}
            </p>
          )}
        </div>
        <article
          className="case-study-body"
          style={{ maxWidth:760, margin:'0 auto', padding:'60px 40px 80px', fontFamily:'Lato, sans-serif', fontSize:18, lineHeight:1.9, color:'var(--text)' }}
          dangerouslySetInnerHTML={{ __html: caseStudy.contentHtml }}
        />
        <div style={{ textAlign:'center', paddingBottom:60 }}>
          <Link href="/case-studies" style={{ fontFamily:'Lato, sans-serif', fontSize:15, color:'var(--text)', borderBottom:'2px solid #F5C645', paddingBottom:2, textDecoration:'none' }}>
            ← Back to all work
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

export async function getStaticProps({ params }) {
  const caseStudy = await getCaseStudy(params.slug)
  return { props: { caseStudy } }
}

export async function getStaticPaths() {
  const slugs = getAllSlugs()
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}
