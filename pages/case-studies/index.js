import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CaseFileCard from '../../components/CaseFileCard'
import EnvironmentLayer from '../../components/EnvironmentLayer'
import { getAllCaseStudies } from '../../lib/case-studies'

const ALL_TAGS_LABEL = 'All'

export default function CaseStudiesIndex({ caseStudies }) {
  const [activeTag, setActiveTag] = useState(null)
  const allTags = [...new Set(caseStudies.flatMap((cs) => cs.tags))]
  const filtered = activeTag ? caseStudies.filter((cs) => cs.tags.includes(activeTag)) : caseStudies

  return (
    <>
      <Head><title>Work — Shreya Krishnamurthy</title></Head>
      <Navbar />
      <div style={{ position:'relative', minHeight:'100vh' }}>
        <EnvironmentLayer />
        <main className="page-section" style={{ paddingTop:100, paddingBottom:80, position:'relative', zIndex:1 }}>

          <h1 style={{
            fontFamily:   '"Reenie Beanie", cursive',
            fontSize:     'clamp(70px, 7vw, 100px)',
            color:        'var(--text)',
            marginBottom: 20,
            lineHeight:   1,
          }}>
            All Work
          </h1>

          {/* Tag filter pills */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:48 }}>
            {[ALL_TAGS_LABEL, ...allTags].map((tag) => {
              const active = tag === ALL_TAGS_LABEL ? activeTag === null : activeTag === tag
              return (
                <button key={tag}
                  onClick={() => setActiveTag(tag === ALL_TAGS_LABEL ? null : (tag === activeTag ? null : tag))}
                  style={{
                    fontFamily:  'Lato, sans-serif',
                    fontSize:    14,
                    padding:     '6px 18px',
                    borderRadius: 9999,
                    border:      '1.5px solid var(--text)',
                    background:  active ? 'var(--text)' : 'transparent',
                    color:       active ? 'var(--bg)' : 'var(--text)',
                    cursor:      'pointer',
                    transition:  'background 0.2s, color 0.2s',
                  }}>
                  {tag}
                </button>
              )
            })}
          </div>

          {/* Case file cards — equal size 3-column grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:36 }}>
            {filtered.map((cs, i) => (
              <div key={cs.slug} style={{ minWidth:0 }}>
                <CaseFileCard {...cs} index={i} />
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export async function getStaticProps() {
  const caseStudies = getAllCaseStudies()
  return { props: { caseStudies } }
}
