import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { inr } from '@/lib/format'
import { whatsappUrl } from '@/data/site'

// Figma "16f · Checkout states" (27:3977). Each state is plain content so it can sit
// in a Dialog on the payment page or inline in a card on the cart/delivery pages.

export function PaymentFailed({ amount, onRetry, onAnother }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <Icon name="alert-lg" size={28} />
        <h3 className="font-display text-2xl font-semibold">Payment did not go through</h3>
      </div>
      <p className="text-[15px] leading-[1.55]">
        If money was taken, your bank refunds it automatically in 5–7 days. Your cart and address are saved.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Button onClick={onRetry}>Retry {inr(amount)}</Button>
        <Button variant="secondary" onClick={onAnother}>
          Another method
        </Button>
      </div>
      <a href={whatsappUrl("Hi Durai Cashew, my payment failed")} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[13px] font-bold underline">
        <Icon name="wa-sm" size={16} />
        Need help? WhatsApp support
      </a>
    </div>
  )
}

export function UpiPending({ upiId, seconds = 300, onApproved, onSwitch, onExpire }) {
  const [left, setLeft] = useState(seconds)
  const expireRef = useRef(onExpire)
  useEffect(() => {
    expireRef.current = onExpire
  })
  useEffect(() => {
    if (left <= 0) {
      expireRef.current?.()
      return
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left])

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  const r = 52
  const c = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h3 className="max-w-[340px] font-display text-2xl font-semibold leading-tight">Approve the request in your UPI app</h3>
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E9D9BF" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#C8442C"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - left / seconds)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <p className="font-mono text-[28px]" aria-live="polite">
        {mm}:{ss}
      </p>
      <p className="text-[13px] text-muted-foreground">Request sent to {upiId || 'your UPI app'}</p>
      <Button onClick={onApproved}>Open UPI app</Button>
      <button onClick={onSwitch} className="text-[13px] font-bold underline">
        Switch payment method
      </button>
    </div>
  )
}

const DEMO_OTP = '1234'

export function CodConfirm({ mobile, onConfirm, onCancel }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const refs = useRef([])
  const complete = digits.every((d) => d !== '')

  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = d
    setDigits(next)
    setError('')
    if (d && i < 3) refs.current[i + 1]?.focus()
  }

  // pasting "1234" into any box fills all four
  const paste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!text) return
    e.preventDefault()
    setDigits(Array.from({ length: 4 }, (_, i) => text[i] ?? ''))
    setError('')
    refs.current[Math.min(text.length, 4) - 1]?.focus()
  }

  const confirm = () => {
    if (digits.join('') === DEMO_OTP) onConfirm()
    else setError('That code doesn’t match. Check the WhatsApp message and try again.')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <Icon name="wa-xl" size={28} />
        <h3 className="font-display text-2xl font-semibold">Confirm your COD order</h3>
      </div>
      <p className="text-[15px] leading-[1.55]">
        We sent a WhatsApp message to {mobile}. Tap Confirm there, or enter the OTP.
      </p>
      <div className="flex gap-2" onPaste={paste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`OTP digit ${i + 1}`}
            aria-invalid={!!error}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => e.key === 'Backspace' && !d && i > 0 && refs.current[i - 1]?.focus()}
            className={`h-14 w-12 rounded-input border bg-ivory text-center font-mono text-[22px] outline-none focus:border-roast ${error ? 'border-[1.5px] border-error' : 'border-line'}`}
          />
        ))}
      </div>
      {error ? (
        <p className="text-[13px] font-medium text-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Demo: the code is {DEMO_OTP} until WhatsApp OTP is connected.</p>
      )}
      <div className="flex flex-wrap gap-2.5">
        <Button onClick={confirm} disabled={!complete}>
          Confirm order
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export function OutOfStock({ line, swap, onSwap, onRemove }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 rounded-xl bg-[#F6E3E1] p-3.5">
        <Icon name="alert-banner" size={18} />
        <p className="text-[13px] font-bold text-error">
          {line.grams >= 1000 ? `${line.grams / 1000} kg` : `${line.grams} g`} of {line.product.name} just sold out
        </p>
      </div>
      {swap && (
        <>
          <div className="flex items-center gap-3">
            <img src={line.product.image} alt="" className="size-14 rounded-[10px] object-contain" />
            <div>
              <p className="text-[15px] font-bold">{line.product.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                Try {swap.qty} × {swap.grams} g instead · {inr(swap.price * swap.qty)}
              </p>
            </div>
          </div>
        </>
      )}
      <div className="flex flex-wrap gap-2.5">
        {swap && (
          <Button onClick={onSwap}>
            Swap to {swap.qty} × {swap.grams} g
          </Button>
        )}
        <Button variant="secondary" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  )
}

export function PincodeNotServiceable({ pincode, onChange }) {
  const [notified, setNotified] = useState(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="flex items-center gap-1.5 text-[13px] font-medium text-error">
        <Icon name="alert-error" size={16} />
        We don’t deliver to {pincode} yet.
      </p>
      <button
        onClick={() => setNotified(true)}
        disabled={notified}
        className="flex items-center gap-2 rounded-full border-[1.5px] border-roast py-2.5 pl-3.5 pr-4 text-[13px] font-bold disabled:opacity-60"
      >
        <Icon name="bell" size={16} />
        {notified ? 'We’ll let you know' : 'Notify me when you do'}
      </button>
      {onChange && (
        <button onClick={onChange} className="text-[13px] font-bold text-primary underline">
          Change address →
        </button>
      )}
    </div>
  )
}
