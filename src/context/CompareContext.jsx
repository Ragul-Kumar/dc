import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Products ticked "Compare" on the shop page (max 3), kept in localStorage so the tray survives navigation
const KEY = 'durai-compare-v1'
export const MAX_COMPARE = 3

const Ctx = createContext(null)

const load = () => {
  try {
    const ids = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(ids) ? ids.slice(0, MAX_COMPARE) : []
  } catch {
    return []
  }
}

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids))
    } catch {
      /* storage unavailable — still works in memory */
    }
  }, [ids])

  const toggle = useCallback(
    (id) => setIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : list.length >= MAX_COMPARE ? list : [...list, id])),
    []
  )

  const value = useMemo(() => ({ ids, toggle, has: (id) => ids.includes(id), full: ids.length >= MAX_COMPARE, clear: () => setIds([]) }), [ids, toggle])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCompare() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCompare must be used inside <CompareProvider>')
  return ctx
}
