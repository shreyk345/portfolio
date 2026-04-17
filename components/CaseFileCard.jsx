import Link from 'next/link'
import { useState } from 'react'

const FOLDER_COLORS = [
  { bg: '#E6C7EB', dark: '#B88FC0', text: '#3a1f40' },
  { bg: '#FE602F', dark: '#c44418', text: '#3d1000' },
  { bg: '#64CEBB', dark: '#3da898', text: '#0d3530' },
]

export default function CaseFileCard({ title, description, thumbnail, slug, index }) {
  const [hovered, setHovered] = useState(false)
  const fc   = FOLDER_COLORS[index % FOLDER_COLORS.length]
  const PEEK = 26  // scaled from 36

  return (
    <Link href={`/case-studies/${slug}`}
      style={{ textDecoration: 'none', display: 'block', width: '100%', maxWidth: 320 }}>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor:'pointer', position:'relative', width:'100%', paddingTop: PEEK }}
      >
        {/* Paper peek */}
        <div style={{
          position:'absolute', top: hovered ? 0 : PEEK, left:8, right:8,
          height: PEEK + 16, background:'#fffef0', borderRadius:'4px 4px 0 0',
          border:'1px solid rgba(0,0,0,0.10)', zIndex:0,
          transition:'top 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
          backgroundImage:`repeating-linear-gradient(to bottom, transparent, transparent 8px, rgba(100,160,200,0.22) 8px, rgba(100,160,200,0.22) 9px)`,
          paddingTop:6, paddingLeft:10, overflow:'hidden',
        }}>
          <span style={{ fontFamily:'Lato, sans-serif', fontSize:7, color:'rgba(0,0,0,0.3)', letterSpacing:1, textTransform:'uppercase' }}>case notes</span>
        </div>

        {/* Folder body */}
        <div style={{
          position:'relative', width:'100%', aspectRatio:'3 / 4',
          background:fc.bg, borderRadius:'6px',
          border:`2px solid ${fc.dark}`,
          overflow:'visible',
          display:'flex', flexDirection:'column',
          boxShadow:`2px 3px 0px ${fc.dark}, 4px 6px 0px rgba(0,0,0,0.12)`,
          zIndex:1,
        }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'6px', overflow:'hidden', zIndex:1 }}>
            {/* Binding line */}
            <div style={{ position:'absolute', top:0, bottom:0, left:16, width:2, background:fc.dark, opacity:0.4 }} />

            {/* Header */}
            <div style={{ padding:'10px 10px 8px 26px', borderBottom:`1px dashed ${fc.dark}` }}>
              <div style={{ fontFamily:'Lato, sans-serif', fontSize:8, fontWeight:700, letterSpacing:1.5, color:fc.text, opacity:0.7, textTransform:'uppercase', marginBottom:2 }}>Case No.</div>
              <div style={{ fontFamily:'Lato, sans-serif', fontSize:10, fontWeight:700, color:fc.text, letterSpacing:1 }}>#{String(index+1).padStart(3,'0')}-{2024+index}</div>
            </div>

            {/* Thumbnail */}
            <div style={{ margin:'10px 10px 8px 26px', height:160, background:fc.bg, borderRadius:3, overflow:'hidden' }}>
              {thumbnail
                ? <img src={thumbnail} alt={title} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'rgba(255,255,255,0.4)', fontFamily:'Lato, sans-serif' }}>[ photo ]</div>
              }
            </div>

            {/* Title + description */}
            <div style={{ padding:'0 10px 14px 26px' }}>
              <h3 style={{ fontFamily:'"Reenie Beanie", cursive', fontSize:22, color:fc.text, marginBottom:6, lineHeight:1.2 }}>{title}</h3>
              <p style={{ fontFamily:'Lato, sans-serif', fontSize:11, color:fc.text, lineHeight:1.6, opacity:0.85 }}>{description}</p>
            </div>
          </div>

          {/* Tab */}
          <div style={{
            position:'absolute',
            top:16, right:-16,
            width:16, height:75,
            background:fc.dark,
            borderRadius:'0 5px 5px 0',
            zIndex:2,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontFamily:'Lato, sans-serif', fontSize:6, fontWeight:700, color:'rgba(255,255,255,0.7)', transform:'rotate(90deg)', letterSpacing:1 }}>{index+1}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
