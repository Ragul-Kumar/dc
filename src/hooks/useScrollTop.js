import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to top on every route change (checkout steps would otherwise open mid-page)
export function useScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}
