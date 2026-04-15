export default function Footer() {
  const links = [
    { href: 'https://linkedin.com/in/shreya-krishnamurthy', label: 'LinkedIn', icon: '/images/linkedin.svg' },
    { href: 'mailto:shkrishnamurthy@ucsd.edu',              label: 'Email',    icon: '/images/gmail.svg'    },
    { href: 'https://github.com/shreyk345',                  label: 'GitHub',   icon: '/images/github.svg'   },
    { href: '/resume.pdf',                                   label: 'Resume',   icon: '/images/resume.svg', download: true },
  ]

  return (
    <footer
      className="page-section"
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        paddingTop:     28,
        paddingBottom:  28,
        borderTop:      '1px solid rgba(128,128,128,0.18)',
        background:     'var(--bg)',
      }}
    >
      {/* Logo */}
      <a href="/" aria-label="Home" style={{ lineHeight: 0 }}>
        <div style={{ width: 48, height: 48, position: 'relative' }}>
          <img
            src="/images/letter-blocks/k.png"
            alt="K"
            style={{ width: 48, height: 48, objectFit: 'fill', display:'block' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div style={{
            display: 'none', width: 48, height: 48,
            background: '#FE602F', borderRadius: 9,
            alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Reenie Beanie", cursive',
            fontSize: 28, color: 'white', fontWeight: 700,
          }}>K</div>
        </div>
      </a>

      {/* Icon links */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        {links.map(({ href, label, icon, download }) => (
          <a
            key={label}
            href={href}
            target={download ? '_blank' : href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            style={{
              width: 52, height: 52,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 12,
              border: '1px solid rgba(128,128,128,0.2)',
              textDecoration: 'none',
              opacity: 0.8,
              transition: 'opacity 0.2s, transform 0.2s',
              background: 'rgba(128,128,128,0.06)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.8
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <img src={icon} alt={label} style={{ width: 28, height: 28, objectFit: 'contain' }} />
          </a>
        ))}
      </div>
    </footer>
  )
}
