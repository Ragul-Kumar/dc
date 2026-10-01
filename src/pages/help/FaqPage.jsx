import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/shared/Icon'
import { FaqList } from '@/components/shared/FaqList'
import { cn } from '@/lib/utils'
import { POLICIES } from './policies'

// Figma 19 · FAQ and policies (39:8782). Answers marked [confirm] are placeholders in the design.
export const GROUPS = [
  {
    topic: 'Orders & delivery',
    items: [
      { q: 'How long does delivery take?', a: 'Metros 2–3 days, rest of India 3–5 days. You’ll see an exact date after entering your pincode.' },
      { q: 'Is delivery free?', a: 'Free above ₹999. Below that, a flat ₹49. Subscriptions always ship free.' },
      { q: 'Can I send one order to several addresses?', a: 'Each order ships to one address. To send gifts to several people, place one order per address — or message us for bulk dispatch.' },
    ],
  },
  {
    topic: 'Products & grades',
    items: [
      { q: 'What does W240 mean?', a: 'About 240 whole nuts per pound — our everyday “Classic” grade. See the Grade guide.' },
      { q: 'How fresh are the cashews?', a: 'Every tin carries its roast or packed-on date, and we ship within a few days of roasting.' },
    ],
  },
  {
    topic: 'Gifting & corporate',
    items: [
      { q: 'Can I add a handwritten card?', a: 'Yes — add a message card (up to 200 characters) at checkout or in the gift box builder.' },
      { q: 'What is the minimum for corporate orders?', a: 'Corporate gifting starts at 50 boxes. Logo sleeves have an MOQ of 50.' },
    ],
  },
  {
    topic: 'Payments & COD',
    items: [
      { q: 'Which payment methods do you accept?', a: 'UPI, cards, netbanking, wallets and cash on delivery.' },
      { q: 'Is COD available everywhere?', a: 'COD is available on most pincodes for orders up to ₹5,000. You will confirm it with a 4-digit OTP.' },
    ],
  },
  {
    topic: 'Returns & refunds',
    items: [
      { q: 'What is your return policy?', a: '7 days, no questions. If a tin is damaged or the broken count is above 5%, we replace it.' },
      { q: 'How long do refunds take?', a: 'Refunds reach your original payment method in 5–7 working days.' },
    ],
  },
  {
    topic: 'Subscriptions',
    items: [
      { q: 'Can I skip or cancel a subscription?', a: 'Yes — skip, pause or cancel from your account in two taps.' },
      { q: 'Can I change flavours?', a: 'Any time up to 48 hours before dispatch.' },
    ],
  },
]

const slug = (t) => t.toLowerCase().replace(/[^a-z]+/g, '-')

export default function FaqPage() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState(GROUPS[0].topic)

  const q = query.trim().toLowerCase()
  const visible = useMemo(
    () => GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => !q || (i.q + i.a).toLowerCase().includes(q)) })).filter((g) => g.items.length),
    [q]
  )

  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col items-start gap-5 pb-12 pt-16 lg:pt-[88px]">
        <h1 className="font-display text-[40px] font-semibold leading-[1.1] md:text-h1">How can we help?</h1>
        <label className="flex h-[60px] w-full max-w-[640px] items-center gap-2.5 rounded-full border border-line bg-white pl-5 pr-6">
          <Icon name="search-20" size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: delivery time, COD, grades, returns…"
            aria-label="Search the FAQ"
            className="min-w-0 flex-1 bg-transparent text-base placeholder:text-muted-foreground focus:outline-none"
          />
        </label>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 pb-[88px] pt-6 lg:flex-row lg:gap-12">
        <nav aria-label="FAQ topics" className="flex gap-1 overflow-x-auto lg:w-[260px] lg:shrink-0 lg:flex-col lg:overflow-visible">
          {GROUPS.map((g) => (
            <button
              key={g.topic}
              type="button"
              aria-current={topic === g.topic}
              onClick={() => {
                setTopic(g.topic)
                document.getElementById(slug(g.topic))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={cn(
                'shrink-0 rounded-lg px-4 py-3 text-left text-[15px] transition-colors',
                topic === g.topic ? 'bg-sand font-bold' : 'font-medium hover:bg-sand/60'
              )}
            >
              {g.topic}
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {visible.length ? (
            visible.map((g) => (
              <div key={g.topic} id={slug(g.topic)} className="flex scroll-mt-28 flex-col gap-1">
                <h2 className="font-display text-[28px] font-semibold">{g.topic}</h2>
                <FaqList key={q} items={g.items} defaultOpen={q ? -1 : 0} />
              </div>
            ))
          ) : (
            <p className="rounded-card border border-line bg-white p-6 text-muted-foreground">
              Nothing matches “{query}”. Try fewer words, or{' '}
              <Link to="/contact" className="font-bold text-roast underline">
                write to us
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 border-t border-line py-[88px] lg:flex-row lg:gap-16">
        <nav aria-label="Policies" className="flex flex-col gap-1 lg:w-[260px] lg:shrink-0">
          <p className="mb-1 text-xs font-bold tracking-[0.12em] text-muted-foreground">POLICIES</p>
          {POLICIES.map((p) => (
            <Link key={p.slug} to={`/policies/${p.slug}`} className={cn('rounded-lg px-4 py-3 text-[15px]', p.slug === 'shipping' ? 'bg-sand font-bold' : 'font-medium hover:bg-sand/60')}>
              {p.title}
            </Link>
          ))}
        </nav>
        <PolicyBody policy={POLICIES[0]} Tag="h2" />
      </section>
    </>
  )
}

export function PolicyBody({ policy, Tag = 'h1' }) {
  return (
    <article className="flex w-full max-w-[720px] flex-col gap-5">
      <Tag className="font-display text-[36px] font-semibold md:text-[48px]">{policy.heading}</Tag>
      <p className="font-mono text-xs font-medium text-muted-foreground">{policy.updated}</p>
      {policy.sections.map(([h, body]) => (
        <div key={h} className="flex flex-col gap-5">
          <h2 className="font-display text-[22px] font-semibold">{h}</h2>
          <p className="text-[17px] leading-[1.7]">{body}</p>
        </div>
      ))}
    </article>
  )
}
