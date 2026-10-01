import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to top on every route change (checkout steps would otherwise open mid-page) —
// unless the URL has a #hash that exists on the new page, e.g. /subscribe#plan.
export function useScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const t = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ block: 'start' })
        else window.scrollTo(0, 0)
      }, 60) // after the new route has painted
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}
