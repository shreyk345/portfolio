// LetterBlock — supports SVG or PNG letter block images.
// Tries SVG first (cleaner paths), falls back to PNG, then colored square.

import { useMemo, useState } from 'react'

const ACCENT_COLORS = ['#E6C7EB','#FE602F','#64CEBB','#F5C645']

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export default function LetterBlock({ letter = 'K', size = null, colorIndex = 0, seed = 0, className = '' }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [svgFailed, setSvgFailed] = useState(false)
  const [pngFailed, setPngFailed] = useState(false)

  const bg       = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length]
  const dim      = size ? { width: size, height: size } : { width: '100%', height: '100%' }
  const baseTilt = useMemo(() => (seededRandom(seed) * 12) - 6, [seed])
  const hoverTilt = baseTilt * 2.2

  const [hovered, setHovered] = useState(false)
  const transform = hovered
    ? `rotate(${hoverTilt}deg) scale(1.18)`
    : `rotate(${baseTilt}deg)`

  const lc = letter.toLowerCase()
  // Try SVG first, then PNG
  const svgSrc = `/images/letter-blocks/${lc}.svg`
  const pngSrc = `/images/letter-blocks/${lc}.png`

  const showFallback = svgFailed && pngFailed

  return (
    <div
      className={className}
      style={{
        ...dim,
        borderRadius:    size ? Math.max(4, size * 0.15) : '14%',
        backgroundColor: (imgLoaded && !showFallback) ? 'transparent' : bg,
        flexShrink:      0,
        overflow:        'hidden',
        position:        'relative',
        transform,
        transition:      'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor:          'default',
        zIndex:          hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Letter ${letter}`}
    >
      {/* Try SVG first */}
      {!svgFailed && (
        <img
          src={svgSrc}
          alt={letter}
          style={{
            width: '100%', height: '100%',
            objectFit: 'fill', display: 'block',
            position: 'absolute', inset: 0,
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setSvgFailed(true)}
        />
      )}

      {/* Fall back to PNG if SVG failed */}
      {svgFailed && !pngFailed && (
        <img
          src={pngSrc}
          alt={letter}
          style={{
            width: '100%', height: '100%',
            objectFit: 'fill', display: 'block',
            position: 'absolute', inset: 0,
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setPngFailed(true)}
        />
      )}

      {/* Fallback colored square with letter */}
      {showFallback && (
        <span style={{
          position:       'absolute',
          inset:           0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontFamily:     '"Reenie Beanie", cursive',
          fontSize:       size ? size * 0.58 : '58%',
          color:          'white',
          fontWeight:     700,
          background:     bg,
        }}>
          {letter}
        </span>
      )}
    </div>
  )
}
