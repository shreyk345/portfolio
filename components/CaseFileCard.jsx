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
  const PEEK = 36

  return (
    <Link href={`/case-studies/${slug}`}
      style={{ textDecoration: 'none', display: 'block', width: '100%', maxWidth: 420 }}>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor:'pointer', position:'relative', width:'100%', paddingTop: PEEK }}
      >
        {/* Paper peek — slides up on hover */}
        <div style={{
          position:'absolute', top: hovered ? 0 : PEEK, left:10, right:10,
          height: PEEK + 20, background:'#fffef0', borderRadius:'4px 4px 0 0',
          border:'1px solid rgba(0,0,0,0.10)', zIndex:0,
          transition:'top 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
          backgroundImage:`repeating-linear-gradient(to bottom, transparent, transparent 11px, rgba(100,160,200,0.22) 11px, rgba(100,160,200,0.22) 12px)`,
          paddingTop:8, paddingLeft:12, overflow:'hidden',
        }}>
          <span style={{ fontFamily:'Lato, sans-serif', fontSize:9, color:'rgba(0,0,0,0.3)', letterSpacing:1, textTransform:'uppercase' }}>case notes</span>
        </div>

        {/* Folder body — overflow:visible so tab can protrude */}
        <div style={{
          position:'relative', width:'100%', aspectRatio:'3 / 4',
          background:fc.bg, borderRadius:'8px',
          border:`2px solid ${fc.dark}`,
          overflow:'visible',
          display:'flex', flexDirection:'column',
          boxShadow:`3px 4px 0px ${fc.dark}, 6px 8px 0px rgba(0,0,0,0.12)`,
          zIndex:1,
        }}>
          {/* Inner content — handles overflow:hidden for folder contents */}
          <div style={{ position:'absolute', inset:0, borderRadius:'8px', overflow:'hidden', zIndex:1 }}>
            {/* Binding line */}
            <div style={{ position:'absolute', top:0, bottom:0, left:22, width:2, background:fc.dark, opacity:0.4 }} />

            {/* Header — case number only, no stamps */}
            <div style={{ padding:'14px 14px 12px 34px', borderBottom:`1px dashed ${fc.dark}` }}>
              <div style={{ fontFamily:'Lato, sans-serif', fontSize:10, fontWeight:700, letterSpacing:1.5, color:fc.text, opacity:0.7, textTransform:'uppercase', marginBottom:2 }}>Case No.</div>
              <div style={{ fontFamily:'Lato, sans-serif', fontSize:13, fontWeight:700, color:fc.text, letterSpacing:1 }}>#{String(index+1).padStart(3,'0')}-{2024+index}</div>
            </div>

            {/* Thumbnail */}
            <div style={{ margin:'14px 14px 12px 34px', height:160, background:fc.dark, borderRadius:4, overflow:'hidden', border:'3px solid #fffef0', outline:`1px solid ${fc.dark}`, boxShadow:'2px 2px 0 rgba(0,0,0,0.2)' }}>
              {thumbnail
                ? <img src={thumbnail} alt={title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(255,255,255,0.4)', fontFamily:'Lato, sans-serif' }}>[ photo ]</div>
              }
            </div>

            {/* Title + description */}
            <div style={{ padding:'0 14px 18px 34px' }}>
              <h3 style={{ fontFamily:'"Reenie Beanie", cursive', fontSize:30, color:fc.text, marginBottom:10, lineHeight:1.2 }}>{title}</h3>
              <p style={{ fontFamily:'Lato, sans-serif', fontSize: 18, color:fc.text, lineHeight:1.7, opacity:0.85 }}>{description}</p>
            </div>
          </div>

          {/* Tab — longer, protrudes right */}
          <div style={{
            position:'absolute',
            top:20, right:-20,
            width:20, height:100,        // taller tab
            background:fc.dark,
            borderRadius:'0 6px 6px 0',
            zIndex:2,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontFamily:'Lato, sans-serif', fontSize:7, fontWeight:700, color:'rgba(255,255,255,0.7)', transform:'rotate(90deg)', letterSpacing:1 }}>{index+1}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
