import { useState, useEffect, useRef } from 'react'

const WORDS  = ['designer', 'researcher', 'developer', 'artist']
const COLORS = ['#FE602F',  '#64CEBB',    '#E6C7EB',   '#F5C645']

const TYPE_SPEED   = 90
const DELETE_SPEED = 50
const PAUSE_AFTER  = 1400

export default function Typewriter() {
  const [display, setDisplay]   = useState('')
  const [wordIdx, setWordIdx]   = useState(0)
  const [charIdx, setCharIdx]   = useState(0)
  const [deleting, setDeleting] = useState(false)

  // Use a ref for wordIdx so the color is always in sync with displayed text
  const wordIdxRef = useRef(0)

  useEffect(() => {
    wordIdxRef.current = wordIdx
  }, [wordIdx])

  useEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(WORDS.join(' / '))
      return
    }

    const word = WORDS[wordIdx]

    if (!deleting && charIdx < word.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), TYPE_SPEED)
      return () => clearTimeout(t)
    }
    if (!deleting && charIdx === word.length) {
      const t = setTimeout(() => setDeleting(true), PAUSE_AFTER)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => setCharIdx(c => c - 1), DELETE_SPEED)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx === 0) {
      setDeleting(false)
      setWordIdx(i => (i + 1) % WORDS.length)
    }
  }, [charIdx, deleting, wordIdx])

  useEffect(() => {
    setDisplay(WORDS[wordIdx].slice(0, charIdx))
  }, [charIdx, wordIdx])

  const color = COLORS[wordIdx]

  return (
    <div style={{ minHeight: '2.8rem', display: 'flex', alignItems: 'center' }}>
      <span
        style={{
          fontFamily:  'Lato, sans-serif',
          fontSize:    'clamp(16px, 2.8vw, 26px)',
          fontWeight:  400,
          color:       color,
          transition:  'color 0.3s ease',
          display:     'inline-block',
        }}
        aria-label={`I am a ${display}`}
        aria-live="polite"
      >
        {display}
        <span
          aria-hidden="true"
          style={{
            display:       'inline-block',
            width:         '2px',
            height:        '1.6rem',
            background:    color,
            verticalAlign: 'text-bottom',
            marginLeft:    '3px',
            animation:     'blink 0.8s step-end infinite',
            transition:    'background 0.3s ease',
          }}
        />
      </span>
    </div>
  )
}
