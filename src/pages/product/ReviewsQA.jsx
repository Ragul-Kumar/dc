import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Icon } from '@/components/shared/Icon'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { cn } from '@/lib/utils'

const KEY = 'durai-reviews-v1'
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {}
  }
}

// Figma "Reviews + Q&A" (39:5441). Reviews written here are kept on this device until a reviews backend exists.
export function ReviewsQA({ product, details }) {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [mine, setMine] = useState(() => read()[product.id] ?? [])

  const reviews = useMemo(() => [...mine, ...details.reviews], [mine, details.reviews])
  const counts = {
    all: reviews.length,
    5: reviews.filter((r) => r.stars === 5).length,
    4: reviews.filter((r) => r.stars === 4).length,
    low: reviews.filter((r) => r.stars <= 3).length,
    photos: reviews.filter((r) => r.photo).length,
  }
  const filters = [
    ['all', 'All'],
    ['5', '5★'],
    ['4', '4★'],
    ['low', '3★ & below'],
    ['photos', 'With photos'],
  ]
  const shown = reviews.filter(
    (r) => filter === 'all' || (filter === 'photos' && r.photo) || (filter === 'low' && r.stars <= 3) || String(r.stars) === filter
  )

  const submit = (review) => {
    const next = [{ ...review, mine: true }, ...mine]
    setMine(next)
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...read(), [product.id]: next }))
    } catch {
      /* storage unavailable — the review stays for this visit */
    }
    setFilter('all')
  }

  return (
    <section id="reviews" className="page-x mx-auto flex max-w-[1440px] scroll-mt-24 flex-col gap-10 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="REVIEWS" title={`${product.rating} out of 5 · ${product.reviews} reviews`} />
        <Button variant="secondary" type="button" onClick={() => setOpen(true)}>
          Write a review
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews">
        {filters.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-bold',
              filter === value ? 'border-roast bg-roast text-ivory' : 'border-line bg-white'
            )}
          >
            {value === 'photos' && <Icon name="cam" size={14} />}
            {label} <span className="font-mono text-[11px] opacity-70">({counts[value]})</span>
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {shown.map((r, i) => (
            <article key={`${r.name}-${i}`} className="flex flex-col gap-3.5 rounded-card border border-line bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-base text-gold" role="img" aria-label={`${r.stars} out of 5 stars`}>
                  {'★'.repeat(r.stars)}
                  <span className="text-line">{'★'.repeat(5 - r.stars)}</span>
                </span>
                <Badge variant="success">{r.mine ? 'Your review' : 'Verified buyer'}</Badge>
              </div>
              <p className="leading-[1.55]">{r.text}</p>
              {r.photo && (
                <span className="flex w-fit items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-[11px] font-bold">
                  <Icon name="cam" size={12} /> Photo review
                </span>
              )}
              <div className="mt-auto flex items-center gap-3">
                <Icon name="avatar" size={40} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{product.name} · 250 g</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-line bg-white p-6 text-center text-muted-foreground">No reviews match this filter yet.</p>
      )}

      <div className="rounded-card bg-white px-7 py-2">
        {details.qa.map(([q, a], i) => (
          <div key={q} className={cn('flex flex-col gap-1.5 py-[18px] text-[15px]', i < details.qa.length - 1 && 'border-b border-line')}>
            <p className="font-bold">
              <span className="mr-3">Q</span>
              {q}
            </p>
            <p>
              <span className="mr-3">A</span>
              {a}
            </p>
          </div>
        ))}
      </div>

      <ReviewDialog open={open} onOpenChange={setOpen} productName={product.name} onSubmit={submit} />
    </section>
  )
}

function ReviewDialog({ open, onOpenChange, productName, onSubmit }) {
  const [stars, setStars] = useState(5)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const send = (e) => {
    e.preventDefault()
    if (text.trim().length < 10) return setError('Tell us a little more — at least 10 characters.')
    onSubmit({ stars, name: name.trim() || 'A Durai customer', text: `“${text.trim()}”`, photo: false })
    setText('')
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] p-7">
        <DialogTitle className="font-display text-2xl font-semibold">Review {productName}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">Your review appears on this page straight away.</DialogDescription>
        <form onSubmit={send} className="mt-2 flex flex-col gap-4">
          <div role="radiogroup" aria-label="Rating" className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onClick={() => setStars(n)}
                className={cn('text-3xl leading-none', n <= stars ? 'text-gold' : 'text-line')}
              >
                ★
              </button>
            ))}
          </div>
          <label className="flex flex-col gap-1.5 text-[13px] font-bold">
            Your name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya R., Coimbatore" className="h-12 rounded-input border border-line bg-white px-3.5 text-sm font-normal focus-visible:border-roast focus-visible:outline-none" />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-bold">
            Your review
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setError('')
              }}
              rows={4}
              maxLength={400}
              className="resize-none rounded-input border border-line bg-white p-3.5 text-sm font-normal focus-visible:border-roast focus-visible:outline-none"
            />
          </label>
          {error && (
            <p className="text-xs font-medium text-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit">Post review</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
