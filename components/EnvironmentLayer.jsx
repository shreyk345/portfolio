import { useState, useEffect } from 'react'

const CLOUDS = [
  { color: '#E6C7EB', w: 200, h: 100, top: '10%', dur: 48, delay: 0  },
  { color: '#64CEBB', w: 240, h: 115, top: '18%', dur: 58, delay: 5  },
  { color: '#F5C645', w: 170, h: 85,  top: '55%', dur: 42, delay: 10 },
  { color: '#FE602F', w: 210, h: 100, top: '68%', dur: 52, delay: 15 },
  { color: '#E6C7EB', w: 160, h: 80,  top: '32%', dur: 64, delay: 3  },
  { color: '#64CEBB', w: 180, h: 90,  top: '80%', dur: 44, delay: 8  },
]

const STARS = Array.from({ length: 32 }, (_, i) => ({
  top:          `${4  + (i * 31) % 88}%`,
  left:         `${2  + (i * 47) % 92}%`,
  spinDur:      `${8  + (i % 6)  * 2}s`,
  spinDelay:    `-${(i * 1.9) % 12}s`,
  twinkleDur:   `${2  + (i % 5) * 0.8}s`,   // 2s–5.2s cycle
  twinkleDelay: `-${(i * 0.7) % 4}s`,        // stagger so they don't all flash together
  size:         18 + (i % 4) * 10,
}))

// Single unified cloud path — drawn as one filled shape so there are no
// visible overlapping circles. Bumpy top, gently rounded flat base.
function CloudShape({ color, width, height }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 85"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/*
        One continuous path tracing the cloud outline:
        - Start bottom-left corner (rounded)
        - Trace up the left side
        - Cross the bumpy top using arc commands (each arc = one puff)
        - Trace down the right side
        - Return along the flat bottom
        SVG arc: A rx ry x-rot large-arc sweep x y
      */}
      <path
        fill={color}
        opacity="0.35"
        d="
          M 18 82
          Q 4 82 4 68
          L 4 62
          A 22 22 0 0 1 28 40
          A 28 28 0 0 1 80 22
          A 32 32 0 0 1 140 18
          A 24 24 0 0 1 178 38
          A 20 20 0 0 1 196 58
          L 196 68
          Q 196 82 182 82
          Z
        "
      />
    </svg>
  )
}

export default function EnvironmentLayer() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    function sync() { setIsDark(document.documentElement.classList.contains('dark')) }
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return (
    <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      {!isDark
        ? CLOUDS.map((c, i) => (
            <div key={i} className="cloud-drift" style={{
              position: 'absolute', top: c.top, left: 0,
              animationDuration: `${c.dur}s`, animationDelay: `-${c.delay}s`,
            }}>
              <CloudShape color={c.color} width={c.w} height={c.h} />
            </div>
          ))
        : STARS.map((s, i) => (
            <span key={i} className="star-spin" style={{
              position:   'absolute', top: s.top, left: s.left,
              fontSize:   s.size, color: '#eff0e9',
              animationName:     'starSpin, starTwinkle',
              animationDuration: `${s.spinDur}, ${s.twinkleDur}`,
              animationDelay:    `${s.spinDelay}, ${s.twinkleDelay}`,
              animationTimingFunction: 'linear, ease-in-out',
              animationIterationCount: 'infinite, infinite',
              userSelect: 'none', display: 'inline-block', lineHeight: 1,
            }}>+</span>
          ))
      }
    </div>
  )
}
