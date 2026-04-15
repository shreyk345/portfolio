import { useEffect, useRef, useState } from 'react'
import { DRAGON_FRAMES, FRAME_VW, FRAME_VH } from './dragon-frames'

const FPS    = 10
const DISP_W = 320
const DISP_H = 250

export default function Dragon({ tipX = 800, tipY = 200 }) {
  const [frameIdx, setFrameIdx] = useState(0)
  const [pos, setPos]           = useState({ x: 9999, y: 0, visible: false })
  const [isDark, setIsDark]     = useState(false)
  // Store the random exit Y so it stays stable per loop but changes each loop
  const exitYRef = useRef(null)

  useEffect(() => {
    function sync() { setIsDark(document.documentElement.classList.contains('dark')) }
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setFrameIdx(i => (i + 1) % 12), 1000 / FPS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const W = window.innerWidth
    const H = window.innerHeight

    const startX = W + 60
    const startY = tipY - DISP_H * 0.6
    const landX  = tipX - DISP_W * 0.65
    const landY  = tipY - DISP_H * 0.7
    const exitX  = -DISP_W - 60

    const FLY_IN  = 3500
    const PERCH   = 2500
    const FLY_OUT = 2500
    const PAUSE   = 1500
    const TOTAL   = FLY_IN + PERCH + FLY_OUT + PAUSE

    function easeOut(t) { return 1 - Math.pow(1 - t, 3) }
    function easeIn(t)  { return t * t * t }

    function pickExitY() {
      return Math.random() * (H * 0.7) + H * 0.1 - DISP_H / 2
    }

    let start = null, id, lastLoop = -1
    function tick(ts) {
      if (!start) start = ts
      const elapsed   = ts - start
      const e         = elapsed % TOTAL
      const loopCount = Math.floor(elapsed / TOTAL)

      // Every time a new loop starts, pick a fresh exit Y
      if (loopCount !== lastLoop) {
        lastLoop = loopCount
        exitYRef.current = pickExitY()
      }

      const exitY = exitYRef.current ?? startY

      if (e < FLY_IN) {
        const t = easeOut(e / FLY_IN)
        setPos({ x: startX + (landX - startX) * t, y: startY + (landY - startY) * t, visible: true })
      } else if (e < FLY_IN + PERCH) {
        const bob = Math.sin((e - FLY_IN) / 300) * 4
        setPos({ x: landX, y: landY + bob, visible: true })
      } else if (e < FLY_IN + PERCH + FLY_OUT) {
        const t = easeIn((e - FLY_IN - PERCH) / FLY_OUT)
        setPos({ x: landX + (exitX - landX) * t, y: landY + (exitY - landY) * t, visible: true })
      } else {
        setPos(p => ({ ...p, visible: false }))
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [tipX, tipY])

  return (
    <div aria-hidden="true" style={{
      position:      'absolute',
      left:           pos.x,
      top:            pos.y,
      opacity:        pos.visible ? 1 : 0,
      pointerEvents: 'none',
      zIndex:         49,
      willChange:    'left, top',
    }}>
      <svg
        width={DISP_W}
        height={DISP_H}
        viewBox={`0 0 ${FRAME_VW} ${FRAME_VH}`}
        xmlns="http://www.w3.org/2000/svg"
        fill={isDark ? '#eff0e9' : '#000000'}
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d={DRAGON_FRAMES[frameIdx]} />
      </svg>
    </div>
  )
}
