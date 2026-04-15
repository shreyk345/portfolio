import '../styles/globals.css'
import { useEffect, useState } from 'react'

// Provides dark mode to the whole app via a class on <html>
export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    // Default is dark mode — only go light if user explicitly chose it
    if (saved === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
    setMounted(true)
  }, [])

  // Prevent flash of wrong theme on first render
  if (!mounted) return null

  return <Component {...pageProps} />
}
