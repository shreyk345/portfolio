import { useMemo, useEffect, useRef, useState } from 'react'
import LetterBlock from './LetterBlock'

const LETTERS     = ['S','H','R','E','Y','A','K']
const BLOCK_COLOR = ['#E6C7EB','#FE602F','#64CEBB','#F5C645']
const RING_SCALES = [1.45, 1.75, 2.10, 2.50]
const RING_FLAT   = 0.28
const SPEEDS      = [14, 19, 25, 32]

function randLetter() { return LETTERS[Math.floor(Math.random() * LETTERS.length)] }
function seededRand(s) { const x = Math.sin(s+1)*10000; return x - Math.floor(x) }

// ── Orbiting block with RAF position + hover tilt ──────────────────────────
function OrbitBlock({ cx, cy, rx, ry, speed, color, letter, blockSize, startAngle, seed }) {
  const outerRef    = useRef(null)
  const innerRef    = useRef(null)
  const angle       = useRef(startAngle)
  const hoveredRef  = useRef(false)
  const prevHovered = useRef(false)
  const posRef      = useRef({ x: 0, y: 0 })  // tracks current screen position

  const baseTilt  = useMemo(() => (seededRand(seed) * 12) - 6, [seed])
  const hoverTilt = baseTilt * 2.2

  // Global mousemove — check if mouse is over the block by comparing positions
  useEffect(() => {
    function onMove(e) {
      const { x, y } = posRef.current
      const mx = e.clientX, my = e.clientY
      // Hit test: is mouse within block bounds?
      const inside = mx >= x && mx <= x + blockSize && my >= y && my <= y + blockSize
      hoveredRef.current = inside
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [blockSize])

  useEffect(() => {
    let last = null, id
    function tick(ts) {
      if (!last) last = ts
      angle.current += (Math.PI * 2 / speed) * ((ts - last) / 1000)
      last = ts

      const a  = angle.current
      const bx = cx + rx * Math.cos(a) - blockSize / 2
      const by = cy + ry * Math.sin(a) - blockSize / 2

      // Store absolute screen position for hit testing
      if (outerRef.current) {
        const rect = outerRef.current.parentElement?.getBoundingClientRect()
        posRef.current = {
          x: (rect?.left ?? 0) + bx,
          y: (rect?.top  ?? 0) + by,
        }
      }

      const onFront = Math.sin(a) > -0.12

      if (outerRef.current) {
        outerRef.current.style.left   = `${bx.toFixed(2)}px`
        outerRef.current.style.top    = `${by.toFixed(2)}px`
        outerRef.current.style.zIndex = onFront ? '6' : '2'
      }

      // Only write transform when hover state changes
      if (innerRef.current && hoveredRef.current !== prevHovered.current) {
        prevHovered.current = hoveredRef.current
        const rot = hoveredRef.current ? hoverTilt : baseTilt
        const sc  = hoveredRef.current ? 1.18 : 1
        innerRef.current.style.transform = `rotate(${rot}deg) scale(${sc})`
      }

      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [cx, cy, rx, ry, speed, blockSize, baseTilt, hoverTilt])

  return (
    <div
      ref={outerRef}
      style={{ position:'absolute', width:blockSize, height:blockSize, willChange:'left,top', cursor:'default', pointerEvents:'none' }}
    >
      <div
        ref={innerRef}
        style={{
          width:      blockSize,
          height:     blockSize,
          transform:  `rotate(${baseTilt}deg)`,
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <LetterBlock
          letter={letter}
          size={blockSize}
          colorIndex={LETTERS.indexOf(letter) % 4}
          seed={seed}
        />
      </div>
    </div>
  )
}

// ── Planet canvas: orange base + scrolling dark-red splotches ──────────────
function PlanetCanvas({ R }) {
  const canvasRef = useRef(null)

  const splotches = useMemo(() => {
    // Place splotches across a 3R-wide strip for seamless looping
    return [3,7,11,13,17,19,23,29,31,37].map((s, i) => ({
      x:    seededRand(s)     * R * 3,
      y:    (seededRand(s+5)  * 1.8 - 0.9) * R,
      rx:   R * (0.18 + seededRand(s+2) * 0.28),   // much bigger
      ry:   R * (0.10 + seededRand(s+3) * 0.18),   // much bigger
      tilt: seededRand(s+4) * 60 - 30,              // more tilt variation
      // Extra control points for irregular shape (bezier wobble)
      wobble: seededRand(s+6) * 0.5 + 0.75,         // 0.75–1.25 scale on one axis
      skew:   seededRand(s+7) * 0.4 - 0.2,          // slight skew
    }))
  }, [R])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    // Canvas covers the full left half-circle: width=R, height=R*2
    canvas.width  = R * dpr
    canvas.height = R * 2 * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    let id
    function draw(ts) {
      ctx.clearRect(0, 0, R, R * 2)

      // Clip to the LEFT half-circle (this IS the planet visible area)
      ctx.save()
      ctx.beginPath()
      ctx.arc(R, R, R, -Math.PI/2, Math.PI/2, true)   // left semicircle
      ctx.closePath()
      ctx.clip()

      // Orange base
      ctx.fillStyle = '#FE602F'
      ctx.fillRect(0, 0, R, R * 2)

      // Scrolling dark-red splotches
      const scrollX = (ts * 0.012) % (R * 3)
      ctx.globalAlpha = 1.0

      for (let tile = 0; tile <= 1; tile++) {
        for (const sp of splotches) {
          const sx = sp.x - scrollX + tile * R * 3
          const sy = sp.y + R
          ctx.save()
          ctx.translate(sx, sy)
          ctx.rotate(sp.tilt * Math.PI / 180)
          ctx.fillStyle = '#CB0505'

          // Draw an irregular blob using bezier curves instead of a perfect ellipse
          // 4 control points around the shape, each offset by wobble amounts
          const rx = sp.rx, ry = sp.ry
          const w  = sp.wobble, sk = sp.skew
          ctx.beginPath()
          // Top point
          ctx.moveTo(sk * ry, -ry)
          // Right curve
          ctx.bezierCurveTo(
            rx * 0.6 + sk * ry,  -ry * w * 0.5,
            rx,                   ry * 0.4,
            rx * w,               ry * 0.1
          )
          // Bottom point
          ctx.bezierCurveTo(
            rx * 0.8,             ry,
            -rx * 0.3 + sk * ry,  ry * w,
            -rx * 0.2,            ry * 0.9
          )
          // Left curve
          ctx.bezierCurveTo(
            -rx,                  ry * 0.5,
            -rx * w * 0.7,        -ry * 0.3,
            -rx * 0.5,            -ry * 0.7
          )
          // Back to top
          ctx.bezierCurveTo(
            -rx * 0.2,            -ry * w,
            sk * ry * 0.5,        -ry * 1.1,
            sk * ry,              -ry
          )
          ctx.fill()
          ctx.restore()
        }
      }
      ctx.restore()
      id = requestAnimationFrame(draw)
    }
    id = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(id)
  }, [R, splotches])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'absolute',
        right:         0,           // flush with right edge = planet right edge
        top:           '50%',
        transform:     'translateY(-50%)',
        width:         R,
        height:        R * 2,
        pointerEvents: 'none',
        zIndex:        3,
        display:       'block',
      }}
    />
  )
}

// ── Small debris circle orbiting a ring ───────────────────────────────────
function DebrisOrb({ cx, cy, rx, ry, speed, startAngle, radius }) {
  const ref   = useRef(null)
  const angle = useRef(startAngle)

  useEffect(() => {
    let last = null, id
    function tick(ts) {
      if (!last) last = ts
      angle.current += (Math.PI * 2 / speed) * ((ts - last) / 1000)
      last = ts
      const a  = angle.current
      const bx = cx + rx * Math.cos(a)
      const by = cy + ry * Math.sin(a)
      const onFront = Math.sin(a) > -0.12
      if (ref.current) {
        ref.current.style.left   = `${(bx - radius).toFixed(2)}px`
        ref.current.style.top    = `${(by - radius).toFixed(2)}px`
        ref.current.style.zIndex = onFront ? '6' : '2'
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [cx, cy, rx, ry, speed, radius])

  return (
    <div ref={ref} style={{
      position:      'absolute',
      width:          radius * 2,
      height:         radius * 2,
      borderRadius:  '50%',
      background:    'white',
      opacity:        0.75,
      willChange:    'left, top',
      pointerEvents: 'none',
    }} />
  )
}

// ── Main Saturn component ──────────────────────────────────────────────────
export default function Saturn() {
  const letters         = useMemo(() => RING_SCALES.map(() => randLetter()), [])
  const [dims, setDims] = useState(null)
  const ref             = useRef(null)

  useEffect(() => {
    function measure() {
      const section = ref.current?.closest('section')
      if (!section) return
      setDims({ R: section.offsetHeight * 0.65 / 2 })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (!dims) return <div ref={ref} style={{ position:'absolute', inset:0, pointerEvents:'none' }} />

  const { R }  = dims
  const BLOCK  = Math.max(33, Math.round(R * 0.13))  // scaled down from 0.17/44
  const maxRx  = R * RING_SCALES[RING_SCALES.length - 1]

  const pad  = BLOCK + 4
  const W    = maxRx + pad
  const H    = R * 2 + BLOCK * 2
  const cx   = W
  const cy   = H / 2

  // Debris: small white circles on each ring at different speeds & start angles
  const DEBRIS = [
    { ringIdx: 0, speed: 18,  startAngle: Math.PI * 0.3,  r: 4 },
    { ringIdx: 0, speed: 24,  startAngle: Math.PI * 1.1,  r: 3 },
    { ringIdx: 1, speed: 14,  startAngle: Math.PI * 0.7,  r: 5 },
    { ringIdx: 1, speed: 28,  startAngle: Math.PI * 1.6,  r: 3 },
    { ringIdx: 2, speed: 20,  startAngle: Math.PI * 0.2,  r: 4 },
    { ringIdx: 2, speed: 32,  startAngle: Math.PI * 1.4,  r: 3 },
    { ringIdx: 3, speed: 16,  startAngle: Math.PI * 0.9,  r: 5 },
    { ringIdx: 3, speed: 26,  startAngle: Math.PI * 1.8,  r: 3 },
    { ringIdx: 1, speed: 38,  startAngle: Math.PI * 0.4,  r: 2 },
    { ringIdx: 2, speed: 42,  startAngle: Math.PI * 1.0,  r: 2 },
  ]

  const ringPath = (scale, front) => {
    const rx = R * scale, ry = rx * RING_FLAT
    const lx = cx - rx, rx2 = cx + rx
    return front
      ? `M ${rx2} ${cy} A ${rx} ${ry} 0 1 1 ${lx} ${cy}`
      : `M ${lx} ${cy} A ${rx} ${ry} 0 1 1 ${rx2} ${cy}`
  }

  return (
    <>
      <div ref={ref} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }} />

      <div style={{
        position: 'absolute', right: 0, top: '50%',
        transform: 'translateY(-50%)',
        width: W, height: H, pointerEvents: 'none',
      }}>
        {/* z:2 — back ring arcs */}
        <svg style={{ position:'absolute', inset:0, zIndex:2, overflow:'visible' }} width={W} height={H}>
          {RING_SCALES.map((s, i) => (
            <path key={i} d={ringPath(s, false)}
              fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.38" />
          ))}
        </svg>

        {/* z:3 — planet canvas */}
        <PlanetCanvas R={R} />

        {/* z:5 — front ring arcs */}
        <svg style={{ position:'absolute', inset:0, zIndex:5, overflow:'visible' }} width={W} height={H}>
          {RING_SCALES.map((s, i) => (
            <path key={i} d={ringPath(s, true)}
              fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.88" />
          ))}
        </svg>

        {/* Debris circles — small white dots orbiting at various speeds */}
        {DEBRIS.map((d, i) => {
          const scale = RING_SCALES[d.ringIdx]
          const rx    = R * scale
          const ry    = rx * RING_FLAT
          return (
            <DebrisOrb
              key={i}
              cx={cx} cy={cy}
              rx={rx} ry={ry}
              speed={d.speed}
              startAngle={d.startAngle}
              radius={d.r}
            />
          )
        })}

        {/* Letter blocks */}
        {RING_SCALES.map((scale, i) => (
          <OrbitBlock
            key={i}
            cx={cx} cy={cy}
            rx={R * scale} ry={R * scale * RING_FLAT}
            speed={SPEEDS[i]}
            color={BLOCK_COLOR[i % 4]}
            letter={letters[i]}
            blockSize={BLOCK}
            startAngle={Math.PI / 2 + i * Math.PI / 2}
            seed={i * 13}
          />
        ))}
      </div>
    </>
  )
}
