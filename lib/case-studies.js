// lib/case-studies.js
// All data fetching for case studies lives here.
// The designer never needs to touch this file.
// To add a new case study: create a new .md file in /content/case-studies/

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'case-studies')

// Get all slugs (used for static path generation)
export function getAllSlugs() {
  const files = fs.readdirSync(CONTENT_DIR)
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

// Get metadata for ALL case studies (homepage + index page)
export function getAllCaseStudies() {
  const slugs = getAllSlugs()
  return slugs
    .map((slug) => {
      const fullPath = path.join(CONTENT_DIR, `${slug}.md`)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(raw)
      return {
        slug,
        title:       data.title       || 'Untitled',
        date:        data.date        || '',
        tags:        data.tags        || [],
        thumbnail:   data.thumbnail   || null,
        description: data.description || '',
        featured:    data.featured    || false,
        protected:   data.protected   || false,
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Get a single case study with full HTML content
export async function getCaseStudy(slug) {
  const fullPath = path.join(CONTENT_DIR, `${slug}.md`)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)

  const processed = await remark().use(remarkHtml).process(content)
  const contentHtml = processed.toString()

  return {
    slug,
    title:       data.title       || 'Untitled',
    date:        data.date        || '',
    tags:        data.tags        || [],
    thumbnail:   data.thumbnail   || null,
    description: data.description || '',
    protected:   data.protected   || false,
    contentHtml,
  }
}
