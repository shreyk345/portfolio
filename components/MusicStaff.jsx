import { useEffect, useRef, useState } from 'react'
import LetterBlock from './LetterBlock'

const LINES    = 5
const LINE_GAP = 16     // 21 * 0.75
const STAFF_H  = (LINES - 1) * LINE_GAP
const BLK      = 20    // 26 * 0.75
const STEM_LEN = 38    // 51 * 0.75
const LOOP_W   = 1600
const SPEED    = 36

// sp: 0=bottom line E4, 1=F4, 2=G4, 3=A4, 4=B4, 5=C5, 6=D5, 7=E5
// Bass: 0=G2, 1=A2, 2=B2, 3=C3, 4=D3, 5=E3, 6=F3, -1=F2(below staff)

// Hey Jude TREBLE — full melody across all 6 pages (top voice only)
const TREBLE_NOTES = [
  // System 1: Hey Jude, don't make it bad
  { sp:1, dur:'half',    ci:0, x:50   }, // F4 half
  { sp:1, dur:'quarter', ci:1, x:210  }, // F4
  { sp:1, dur:'eighth',  ci:2, x:290  }, // F4
  { sp:1, dur:'quarter', ci:3, x:340  }, // F4
  { sp:1, dur:'half',    ci:0, x:400  }, // F4 half (bad)
  // take a sad song
  { sp:3, dur:'quarter', ci:1, x:540  }, // A4
  { sp:1, dur:'quarter', ci:2, x:600  }, // F4
  { sp:2, dur:'quarter', ci:3, x:660  }, // G4 (dotted)
  { sp:2, dur:'eighth',  ci:0, x:740  }, // G4
  // and make it better
  { sp:3, dur:'quarter', ci:1, x:800  }, // A4
  { sp:3, dur:'quarter', ci:2, x:860  }, // A4
  { sp:3, dur:'eighth',  ci:3, x:920  }, // A4
  { sp:2, dur:'eighth',  ci:0, x:965  }, // G4
  { sp:1, dur:'eighth',  ci:1, x:1010 }, // F4
  { sp:2, dur:'eighth',  ci:2, x:1055 }, // G4
  { sp:3, dur:'half',    ci:3, x:1110 }, // A4 half
  // System 2: Remember to let her into your heart
  { sp:1, dur:'quarter', ci:0, x:1270 }, // F4
  { sp:5, dur:'quarter', ci:1, x:1340 }, // C5
  { sp:5, dur:'quarter', ci:2, x:1410 }, // C5 (let)
  { sp:5, dur:'half',    ci:3, x:1470 }, // C5 half
]

// Hey Jude BASS — full bass line across all pages
const BASS_NOTES = [
  // System 1 bass pattern: F C C C / F C C C
  { sp:-1, dur:'quarter', ci:0, x:50   }, // F2
  { sp:3,  dur:'quarter', ci:1, x:120  }, // C3
  { sp:3,  dur:'quarter', ci:2, x:190  }, // C3
  { sp:3,  dur:'quarter', ci:3, x:260  }, // C3
  { sp:-1, dur:'quarter', ci:0, x:370  }, // F2
  { sp:3,  dur:'quarter', ci:1, x:440  }, // C3
  { sp:3,  dur:'quarter', ci:2, x:510  }, // C3
  { sp:3,  dur:'quarter', ci:3, x:580  }, // C3
  // System 1 bar 3-4: Bb / F pattern
  { sp:2,  dur:'quarter', ci:0, x:690  }, // Bb2(sp2 in bass)
  { sp:2,  dur:'quarter', ci:1, x:760  }, // Bb2
  { sp:2,  dur:'quarter', ci:2, x:830  }, // Bb2
  { sp:2,  dur:'quarter', ci:3, x:900  }, // Bb2
  { sp:-1, dur:'quarter', ci:0, x:1010 }, // F2
  { sp:3,  dur:'quarter', ci:1, x:1080 }, // C3
  { sp:3,  dur:'quarter', ci:2, x:1150 }, // C3
  { sp:3,  dur:'quarter', ci:3, x:1220 }, // C3
  // System 2 bass
  { sp:-1, dur:'quarter', ci:0, x:1330 }, // F2
  { sp:3,  dur:'quarter', ci:1, x:1400 }, // C3
  { sp:2,  dur:'quarter', ci:2, x:1470 }, // Bb2
  { sp:2,  dur:'quarter', ci:3, x:1540 }, // Bb2
]

const ACCENT = ['#E6C7EB','#FE602F','#64CEBB','#F5C645']

function Note({ x, sp, dur, ci, isDark }) {
  const PAD     = 50   // space above top staff line for upward stems
  // headCY = vertical centre of note head
  const headCY  = PAD + STAFF_H - sp * (LINE_GAP / 2)
  const headTop = headCY - BLK / 2

  const filled    = dur !== 'whole' && dur !== 'half'
  const stemUp    = sp < 4
  const color     = ACCENT[ci % 4]

  // Stem: attaches to right edge if stemUp, left edge if stemDown
  const stemX     = stemUp ? x + BLK - 2 : x + 2
  const stemTop   = stemUp ? headTop : headCY + BLK / 2
  const stemBot   = stemUp ? headTop - STEM_LEN : headCY + BLK / 2 + STEM_LEN
  const flagStartY = stemUp ? stemTop : stemBot

  const needsLedger = sp <= -1 || sp >= 9

  return (
    <div style={{ position:'absolute', left: x, top: 0, width: BLK + 40 }}>

      {/* Ledger line */}
      {needsLedger && (
        <div style={{
          position:   'absolute',
          top:        headCY - 1,
          left:       -6,
          width:      BLK + 12,
          height:     2,
          background: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
        }} />
      )}

      {/* Stem — only for quarter/half notes; eighth notes get stem from SVG path */}
      {dur !== 'whole' && dur !== 'eighth' && (
        <div style={{
          position:     'absolute',
          left:         stemX - x,
          top:          Math.min(stemTop, stemBot),
          width:        2.5,
          height:       STEM_LEN,
          background:   color,
          borderRadius: 2,
        }} />
      )}

      {/* Flag — exact SVG from note.svg, head clipped off, LetterBlock used as head instead */}
      {dur === 'eighth' && (() => {
        const tipX   = stemX - x
        const scale  = STEM_LEN / 141
        const svgW   = Math.ceil(99 * scale)
        const svgH   = STEM_LEN
        const stemInSvg = 48 * scale
        const tipY   = stemUp ? headTop - STEM_LEN : headCY + BLK / 2

        return (
          <svg style={{
            position:        'absolute',
            left:            tipX - stemInSvg,
            top:             tipY,
            width:           svgW,
            height:          svgH,
            overflow:        'hidden',   // clip the head
            pointerEvents:   'none',
            transform:       stemUp ? 'none' : 'scaleY(-1)',
            transformOrigin: '0 0',
          }}>
            <g transform={`scale(${scale})`}>
              <path
                fillRule="evenodd" clipRule="evenodd"
                d="M48.01 70.817L48 141.635L45.75 140.817C44.513 140.368 39.675 140 35 140C27.68 140 25.694 140.396 20.699 142.848C9.029 148.579 0 160.899 0 171.093C0 175.793 0.339004 176.591 3.535 179.396C5.479 181.103 7.166 182.503 7.285 182.506C7.403 182.509 10.083 182.935 13.24 183.452C28.02 185.873 43.324 178.735 49.453 166.563C53.735 158.061 54 154.078 54 98.334V45.267L56.062 45.806C60.901 47.071 73.757 55.446 79.208 60.882C95.78 77.413 97.033 99.967 83.146 131.75C82.005 134.362 81.216 136.5 81.394 136.5C82.082 136.5 88.964 125.514 91.822 119.852C96.653 110.282 98.347 103.119 98.292 92.5C98.213 77.565 93.69 67.505 80.084 52C70.678 41.281 62.182 28.365 54.76 13.5L48.019 0L48.01 70.817Z"
                fill={color}
              />
            </g>
          </svg>
        )
      })()}

      {/* LetterBlock note head */}
      <div style={{
        position: 'absolute',
        top:      headTop,
        left:     0,
        width:    BLK,
        height:   BLK,
        opacity:  filled ? 1 : 0.7,
      }}>
        <LetterBlock
          letter={['S','H','R','E','Y','A','K'][ci % 7]}
          size={BLK}
          colorIndex={ci % 4}
          seed={ci * 7}
        />
      </div>
    </div>
  )
}

export default function MusicStaff({ variant = 'treble', edgeToEdge = false }) {
  const [isDark, setIsDark] = useState(false)
  const trackRef = useRef(null)
  const offRef   = useRef(0)
  const notes    = variant === 'bass' ? BASS_NOTES : TREBLE_NOTES

  useEffect(() => {
    function sync() { setIsDark(document.documentElement.classList.contains('dark')) }
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes:true, attributeFilter:['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    let last = null, id
    function tick(ts) {
      if (!last) last = ts
      offRef.current = (offRef.current + SPEED * (ts - last) / 1000) % LOOP_W
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-offRef.current}px)`
      }
      last = ts
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const lineColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.82)'
  const PAD_V    = 50
  const stripH   = STAFF_H + PAD_V * 2

  const allNotes = [
    ...notes.map(n => ({ ...n, tileX: 0 })),
    ...notes.map(n => ({ ...n, tileX: LOOP_W })),
  ]

  return (
    <div style={{
      ...(edgeToEdge ? {
        marginLeft:  'calc(-1 * var(--page-px))',
        marginRight: 'calc(-1 * var(--page-px))',
        width:       'calc(100% + 2 * var(--page-px))',
      } : { width: '100%' }),
      position: 'relative',
      height:   stripH,
      overflow: 'hidden',
    }}>
      {/* Static staff lines */}
      {Array.from({ length: LINES }).map((_, li) => (
        <div key={li} style={{
          position:   'absolute',
          top:        PAD_V + li * LINE_GAP,
          left:       0, right: 0,
          height:     1.8,
          background: lineColor,
          zIndex:     1,
        }} />
      ))}

      {/* Scrolling notes */}
      <div ref={trackRef} style={{
        position:   'absolute',
        top:        0, left: 0,
        width:      LOOP_W * 2,
        height:     stripH,
        willChange: 'transform',
        zIndex:     2,
      }}>
        {allNotes.map((n, i) => (
          <Note key={i} x={n.x + n.tileX} sp={n.sp} dur={n.dur} ci={n.ci} isDark={isDark} />
        ))}
      </div>
    </div>
  )
}
