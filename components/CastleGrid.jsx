import { useEffect, useState, useRef } from 'react'
import LetterBlock from './LetterBlock'

const PATTERN = [
  [0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0],
  [0,0,0,0,0,0,0,1,1,1,0],
  [0,0,0,0,0,0,0,1,1,0,0],
  [0,0,0,0,0,1,0,1,1,0,1],
  [0,0,1,0,0,1,0,1,1,1,1],
  [1,0,1,0,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,0,0,1,1,0,1,1],
  [1,1,1,0,0,0,1,1,1,1,1],
  [1,1,1,0,0,0,1,1,1,1,1],
]

const LETTERS = ['S','H','R','E','Y','A','K']
function randLetter() { return LETTERS[Math.floor(Math.random() * LETTERS.length)] }

export default function CastleGrid({ onTipPosition }) {
  const [cells, setCells] = useState([])
  const gridRef = useRef(null)

  useEffect(() => {
    setCells(PATTERN.map(row => row.map(cell => cell === 1 ? randLetter() : null)))
  }, [])

  useEffect(() => {
    if (!onTipPosition || !gridRef.current) return
    function report() {
      const rect    = gridRef.current.getBoundingClientRect()
      const wrapper = gridRef.current.closest('[data-landing-wrapper]')
      const wRect   = wrapper ? wrapper.getBoundingClientRect() : { left: 0, top: 0 }
      const cellW   = rect.width  / 11
      const cellH   = rect.height / 11
      // Section-relative coords (for position:absolute dragon)
      onTipPosition({
        x: rect.left - wRect.left + 7 * cellW + cellW / 2,
        y: rect.top  - wRect.top  + 0 * cellH,
      })
    }
    report()
    window.addEventListener('resize', report)
    return () => window.removeEventListener('resize', report)
  }, [cells, onTipPosition])

  return (
    <div style={{ width:'100%', display:'flex', justifyContent:'center', alignItems:'flex-end' }}>
      <div
        ref={gridRef}
        role="img"
        aria-label="Castle silhouette made of letter blocks"
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(11, 1fr)',
          gridTemplateRows:    'repeat(11, 1fr)',
          gap:                 '5px',
          width:               'min(780px, 70vh)',
          height:              'min(780px, 70vh)',
        }}
      >
        {cells.map((row, ri) =>
          row.map((letter, ci) =>
            letter
              ? <LetterBlock
                  key={`${ri}-${ci}`}
                  letter={letter}
                  size={null}
                  colorIndex={(ri * 11 + ci) % 4}
                  seed={ri * 11 + ci}
                />
              : <div key={`${ri}-${ci}`} />
          )
        )}
      </div>
    </div>
  )
}
