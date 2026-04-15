import { useState, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Masonry from 'react-masonry-css'

import Navbar           from '../components/Navbar'
import Footer           from '../components/Footer'
import CastleGrid       from '../components/CastleGrid'
import Typewriter       from '../components/Typewriter'
import Dragon           from '../components/Dragon'
import EnvironmentLayer from '../components/EnvironmentLayer'
import CaseFileCard     from '../components/CaseFileCard'
import Saturn           from '../components/Saturn'
import MusicStaff       from '../components/MusicStaff'
import ImageModal       from '../components/ImageModal'
import { getAllCaseStudies } from '../lib/case-studies'
import { getPlayImages }    from '../lib/play-images'

// Shared typography constants for clean visual hierarchy across all sections
const HEADING_STYLE = {
  fontFamily:   '"Reenie Beanie", cursive',
  fontSize:     'clamp(70px, 7vw, 100px)',
  color:        'var(--text)',
  lineHeight:   1,
  margin:       0,
  marginBottom: 24,
}
const BODY_STYLE = {
  fontFamily: 'Lato, sans-serif',
  fontSize:   22,
  lineHeight: 1.75,
  color:      'var(--text)',
  opacity:    0.85,
  margin:     0,
}
const SECTION_STYLE = {
  minHeight:  '100vh',
  paddingTop: 80,
  paddingBottom: 80,
  display:    'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  scrollSnapAlign: 'start',
}

export default function Home({ featuredCaseStudies, playImages }) {
  const router = useRouter()
  const [modal, setModal]   = useState(null)
  const [tipPos, setTipPos] = useState({ x: 0, y: 100 })
  const handleTip = useCallback((pos) => setTipPos(pos), [])

  return (
    <>
      <Head>
        <title>Shreya Krishnamurthy — Portfolio</title>
        <meta name="description" content="UX researcher, designer, developer and artist." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      {/* Scroll-snap container wrapping all sections */}
      <div style={{ height:'100vh', overflowY:'scroll', scrollSnapType:'y mandatory' }}>

        {/* ═══ LANDING ═══════════════════════════════════════════════════ */}
        <div style={{ position:'relative', height:'100vh', overflow:'hidden', scrollSnapAlign:'start', flexShrink:0 }}>
          <Dragon tipX={tipPos.x} tipY={tipPos.y} />
          <section
            id="landing"
            className="page-section"
            style={{
              height:        '100vh',
              paddingTop:    72,
              paddingBottom: 0,
              display:       'flex',
              alignItems:    'center',
              position:      'relative',
              overflow:      'hidden',
              gap:           40,
              flexWrap:      'wrap',
            }}
          >
            <EnvironmentLayer />

            {/* Hero text — left-aligned */}
            <div style={{
              flex:     '1 1 300px',
              position: 'relative',
              zIndex:   2,
            }}>
              <h1 style={{ marginBottom: 0 }}>
                {/* "Hi! I'm Shreya" on one line */}
                <div style={{ whiteSpace: 'nowrap', lineHeight: 1.1 }}>
                  <span style={{
                    fontFamily: 'Lato, sans-serif',
                    fontSize:   'clamp(28px, 3.5vw, 50px)',
                    fontWeight: 400,
                    color:      'var(--text)',
                  }}>Hi! I'm </span>
                  <span style={{
                    fontFamily: '"Reenie Beanie", cursive',
                    fontSize:   'clamp(60px, 6.5vw, 92px)',
                    color:      '#64CEBB',
                  }}>Shreya</span>
                </div>
                {/* "Krishnamurthy." on second line, tight */}
                <div style={{ lineHeight: 0.9 }}>
                  <span style={{
                    fontFamily: '"Reenie Beanie", cursive',
                    fontSize:   'clamp(60px, 6.5vw, 92px)',
                    color:      '#64CEBB',
                  }}>Krishnamurthy.</span>
                </div>
              </h1>
              {/* Typewriter — minimal gap */}
              <div style={{ marginTop: 4 }}>
                <Typewriter />
              </div>
            </div>

            {/* Castle — bottom-aligned */}
            <div style={{
              flex:      '1 1 420px',
              alignSelf: 'flex-end',
              position:  'relative',
              zIndex:    2,
            }}>
              <CastleGrid onTipPosition={handleTip} />
            </div>
          </section>
        </div>

        {/* ═══ WORK ══════════════════════════════════════════════════════ */}
        <section id="work" className="page-section"
          style={{
            ...SECTION_STYLE,
            position: 'relative',
            overflow: 'hidden',
          }}>

          {/* Background accent dots */}
          <div aria-hidden="true" style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }}>
            {[
              { x:'8%',  y:'12%', r:6,  c:'#E6C7EB' }, { x:'18%', y:'72%', r:4,  c:'#64CEBB' },
              { x:'28%', y:'28%', r:9,  c:'#F5C645' }, { x:'14%', y:'48%', r:5,  c:'#FE602F' },
              { x:'38%', y:'82%', r:7,  c:'#E6C7EB' }, { x:'44%', y:'18%', r:4,  c:'#64CEBB' },
              { x:'52%', y:'60%', r:11, c:'#F5C645' }, { x:'22%', y:'90%', r:5,  c:'#FE602F' },
              { x:'60%', y:'35%', r:6,  c:'#E6C7EB' }, { x:'6%',  y:'62%', r:8,  c:'#F5C645' },
              { x:'32%', y:'55%', r:4,  c:'#64CEBB' }, { x:'48%', y:'88%', r:6,  c:'#FE602F' },
              { x:'12%', y:'33%', r:10, c:'#E6C7EB' }, { x:'55%', y:'78%', r:5,  c:'#64CEBB' },
              { x:'40%', y:'42%', r:4,  c:'#F5C645' }, { x:'25%', y:'15%', r:7,  c:'#FE602F' },
              { x:'35%', y:'68%', r:5,  c:'#E6C7EB' }, { x:'10%', y:'85%', r:9,  c:'#64CEBB' },
              { x:'50%', y:'22%', r:4,  c:'#FE602F' }, { x:'20%', y:'58%', r:6,  c:'#F5C645' },
              { x:'4%',  y:'40%', r:5,  c:'#E6C7EB' }, { x:'42%', y:'6%',  r:8,  c:'#FE602F' },
              { x:'16%', y:'95%', r:4,  c:'#F5C645' }, { x:'30%', y:'38%', r:6,  c:'#64CEBB' },
              { x:'58%', y:'52%', r:5,  c:'#E6C7EB' }, { x:'46%', y:'72%', r:3,  c:'#FE602F' },
              { x:'8%',  y:'78%', r:7,  c:'#F5C645' }, { x:'36%', y:'10%', r:4,  c:'#64CEBB' },
            ].map((dot, i) => (
              <div key={i} style={{
                position: 'absolute', left: dot.x, top: dot.y,
                width: dot.r * 2, height: dot.r * 2,
                borderRadius: '50%', background: dot.c, opacity: 0.55,
              }} />
            ))}
          </div>

          <Saturn />

          <h2 style={{ ...HEADING_STYLE, position:'relative', zIndex:2 }}>Work</h2>

          <div style={{ display:'flex', gap:36, flexWrap:'wrap', position:'relative', zIndex:2, alignItems:'flex-end' }}>
            {featuredCaseStudies.map((cs, i) => (
              <div key={cs.slug} style={{ flex:'1 1 320px', maxWidth:420 }}>
                <CaseFileCard {...cs} index={i} />
              </div>
            ))}
          </div>

          <div style={{ marginTop:32, position:'relative', zIndex:2 }}>
            <span
              style={{
                fontFamily:   'Lato, sans-serif',
                fontSize:     16,
                color:        'var(--bg)',
                background:   '#F5C645',
                cursor:       'pointer',
                padding:      '10px 22px',
                borderRadius: 9999,
                display:      'inline-block',
                fontWeight:   600,
                letterSpacing: 0.3,
                transition:   'opacity 0.2s, transform 0.2s',
              }}
              onClick={() => router.push('/case-studies')} role="link" tabIndex={0}
              onKeyDown={(e) => e.key==='Enter' && router.push('/case-studies')}
              onMouseEnter={(e) => { e.currentTarget.style.opacity='0.82'; e.currentTarget.style.transform='scale(1.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='scale(1)' }}
            >
              Explore all projects →
            </span>
          </div>
        </section>

        {/* ═══ PLAY ══════════════════════════════════════════════════════ */}
        <section id="play" className="page-section"
          style={{ ...SECTION_STYLE, paddingTop: 100, paddingBottom: 0 }}>

          {/* Heading row: "Play" + treble staff at same height */}
          <div style={{ marginBottom:16, marginRight:'calc(-1 * var(--page-px))' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:40 }}>
              <h2 style={{ ...HEADING_STYLE, marginBottom:0, flexShrink:0 }}>Play</h2>
              <div style={{ flex:1, minWidth:0, overflow:'hidden', marginTop:-50 }}>
                <MusicStaff variant="treble" />
              </div>
            </div>
            <p style={{ ...BODY_STYLE, marginTop:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              In my free time, I also like to paint (especially oils), sketch and animate on Procreate, and develop on Blender, Unity and Unreal Engine.
            </p>
          </div>

          {/* Masonry gallery */}
          {(() => {
            const imgs = playImages.length > 0 ? playImages : [
              { src:'', alt:'Oil painting',    title:'Oil painting',    description:'' },
              { src:'', alt:'Procreate sketch',title:'Procreate sketch',description:'' },
              { src:'', alt:'Blender render',  title:'Blender render',  description:'' },
              { src:'', alt:'Animation',       title:'Animation',       description:'' },
              { src:'', alt:'Photography',     title:'Photography',     description:'' },
              { src:'', alt:'Sketch',          title:'Sketch',          description:'' },
              { src:'', alt:'Drawing',         title:'Drawing',         description:'' },
              { src:'', alt:'Digital art',     title:'Digital art',     description:'' },
              { src:'', alt:'Mixed media',     title:'Mixed media',     description:'' },
            ]
            const bg = ['#E6C7EB80','#64CEBB80','#F5C64580','#FE602F40','#E6C7EB60','#64CEBB40','#F5C64560','#FE602F50','#E6C7EB50']
            return (
              <>
                <style>{`.masonry-grid{display:flex;gap:8px;margin-bottom:12px}.masonry-grid-col{display:flex;flex-direction:column;gap:8px;flex:1}`}</style>
                <Masonry breakpointCols={3} className="masonry-grid" columnClassName="masonry-grid-col">
                  {imgs.map((img, i) => (
                    <div key={i} onClick={() => setModal(img)} role="button" tabIndex={0}
                      aria-label={`View ${img.alt}`} onKeyDown={(e) => e.key==='Enter' && setModal(img)}
                      style={{ borderRadius:8, overflow:'hidden', background:bg[i%9], cursor:'pointer' }}>
                      {img.src
                        ? <img src={img.src} alt={img.alt} style={{ width:'100%', display:'block', objectFit:'cover' }}
                            onError={(e) => { e.target.style.display='none' }} />
                        : <div style={{ height:140, display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:11, color:'rgba(255,255,255,0.35)', fontFamily:'Lato, sans-serif' }}>[ {img.alt} ]</div>
                      }
                    </div>
                  ))}
                </Masonry>
              </>
            )
          })()}

          <MusicStaff variant="bass" edgeToEdge={true} />
        </section>

        {/* ═══ ABOUT ═════════════════════════════════════════════════════ */}
        <section id="about" className="page-section" style={{ ...SECTION_STYLE }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
            <div>
              <h2 style={{ ...HEADING_STYLE }}>
                Hi, I'm{' '}
                <span style={{ color:'#FE602F' }}>Shreya.</span>
              </h2>
              <p style={{ ...BODY_STYLE, marginBottom:20 }}>
                I'm currently a student at UCSD double majoring in Cognitive Science (specialising in Design and Interaction) and Interdisciplinary Computing and the Arts. Basically, I'm an aspiring UX researcher, with a special interest in AR and VR.
              </p>
              <p style={{ ...BODY_STYLE }}>
                I love hiking, running, cycling, swimming, books, music, and art.
              </p>
            </div>
            <div style={{ height:'60vh', borderRadius:20, overflow:'hidden', background:'#64CEBB', position:'relative' }}>
              <img src="/images/about/profile.jpg" alt="Shreya Krishnamurthy"
                style={{ width:'100%', height:'100%', objectFit:'cover' }}
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
              <div style={{ display:'none', position:'absolute', inset:0, alignItems:'center', justifyContent:'center',
                fontSize:13, color:'rgba(255,255,255,0.7)', fontFamily:'Lato, sans-serif' }}>[ your photo ]</div>
            </div>
          </div>
        </section>

        <div style={{ scrollSnapAlign:'start' }}>
          <Footer />
        </div>

      </div>{/* end scroll-snap container */}

      {modal && <ImageModal src={modal.src} alt={modal.alt} title={modal.title} description={modal.description} onClose={() => setModal(null)} />}
    </>
  )
}

export async function getStaticProps() {
  const all      = getAllCaseStudies()
  const featured = all.filter(cs => cs.featured).slice(0, 3)
  const featuredCaseStudies = featured.length >= 3 ? featured : all.slice(0, 3)
  const playImages = getPlayImages()
  return { props: { featuredCaseStudies, playImages } }
}
