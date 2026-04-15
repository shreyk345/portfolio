import { useEffect, useRef, useState } from 'react'

export default function ImageModal({ src, alt, title, description, onClose }) {
  const closeRef  = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    // Trigger entrance animation on next frame
    const t = requestAnimationFrame(() => setVisible(true))
    function onKey(e) { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(t)
    }
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 280)
  }

  return (
    <div
      onClick={handleClose}
      style={{
        position:       'fixed',
        inset:           0,
        background:     `rgba(0,0,0,${visible ? 0.88 : 0})`,
        zIndex:          1000,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        transition:     'background 0.28s ease',
      }}
    >
      <button
        ref={closeRef}
        onClick={handleClose}
        aria-label="Close"
        style={{
          position:   'fixed',
          top:         20,
          right:       24,
          background: 'none',
          border:     'none',
          color:      'white',
          fontSize:    32,
          cursor:     'pointer',
          lineHeight:  1,
          zIndex:      10,
          opacity:     visible ? 0.7 : 0,
          transition: 'opacity 0.28s ease',
        }}
      >✕</button>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          display:         'flex',
          alignItems:      'center',
          gap:             48,
          maxWidth:        '90vw',
          maxHeight:       '90vh',
          padding:         '0 16px',
          // Pop-out: scale from 0.7 and fade in
          opacity:         visible ? 1 : 0,
          transform:       visible ? 'scale(1)' : 'scale(0.7)',
          transition:      'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth:    '58vw',
            maxHeight:   '82vh',
            borderRadius: 14,
            objectFit:   'contain',
            boxShadow:   '0 8px 60px rgba(0,0,0,0.5)',
            flexShrink:   0,
          }}
        />

        <div style={{ flex: 1, minWidth: 220, maxWidth: 360 }}>
          <h2 style={{
            fontFamily:   '"Reenie Beanie", cursive',
            fontSize:      56,
            color:         'white',
            marginBottom:  20,
            lineHeight:    1.05,
          }}>
            {title || alt}
          </h2>
          {description && (
            <p style={{
              fontFamily: 'Lato, sans-serif',
              fontSize:    22,
              lineHeight:  1.75,
              color:      'rgba(255,255,255,0.80)',
              margin:      0,
            }}>
              {description}
            </p>
          )}
          {!description && (
            <p style={{
              fontFamily: 'Lato, sans-serif',
              fontSize:    16,
              color:      'rgba(255,255,255,0.3)',
              fontStyle:  'italic',
            }}>
              Add a description in public/images/play/metadata.json
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
