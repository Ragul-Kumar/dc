import { useEffect, useState } from 'react'
import { TOAST_EVENT } from '@/lib/toast'

// Bottom-centre message that clears itself; announced to screen readers via role="status"
export function Toaster() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    let timer
    const show = (e) => {
      setMessage(e.detail)
      clearTimeout(timer)
      timer = setTimeout(() => setMessage(''), 5000)
    }
    window.addEventListener(TOAST_EVENT, show)
    return () => {
      window.removeEventListener(TOAST_EVENT, show)
      clearTimeout(timer)
    }
  }, [])

  if (!message) return null
  return (
    <div role="status" className="fixed inset-x-4 bottom-6 z-[60] mx-auto w-fit max-w-[480px] rounded-full bg-roast px-5 py-3 text-center text-sm font-medium text-ivory shadow-lg">
      {message}
    </div>
  )
}
