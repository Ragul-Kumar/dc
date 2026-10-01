import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { Field, fieldClass } from '@/components/shared/FormField'
import { ProductCard } from '@/components/shared/ProductCard'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { PRODUCTS } from '@/data/products'
import { ARTICLES, FEATURED } from '@/data/journal'
import { SITE, whatsappUrl } from '@/data/site'
import { saveEnquiry } from '@/lib/enquiries'
import { cn } from '@/lib/utils'

// Sustainability, Careers, Press, Find a store, Sitemap and 404 — the pages the footer's Company column links to.

// ── Sustainability ──────────────────────────────────────────────────────────────────────────────────
const PILLARS = [
  ['Women-led floor', 'Grading and packing are led by women from the villages around the unit — steady, skilled work close to home.'],
  ['Partner farms', 'We buy from a fixed set of farm clusters, so every tin traces back to where it grew.'],
  ['Nothing wasted', 'Shells, skins and broken pieces go to cooking, sweets and fuel instead of the bin.'],
  ['Honest packaging', 'Tins and sleeves that can be refilled or recycled, and no plastic windows for show.'],
]

export function SustainabilityPage() {
  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-5 pb-12 pt-14 lg:pt-[88px]">
        <p className="eyebrow">SUSTAINABILITY</p>
        <h1 className="max-w-[760px] font-display text-[40px] font-semibold leading-[1.1] md:text-h1">Good for the hands that grade, and the land that grows.</h1>
        <p className="max-w-[640px] text-body-l">We make one thing, so we can afford to do it carefully. Here is how we think about the people, farms and packaging behind each tin.</p>
      </section>
      <section className="page-x mx-auto grid max-w-[1440px] gap-6 pb-24 pt-8 md:grid-cols-2">
        {PILLARS.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-3 rounded-card bg-white p-8">
            <Icon name="leaf-trust" size={28} />
            <h2 className="font-display text-[26px] font-semibold">{title}</h2>
            <p className="leading-[1.6]">{body}</p>
          </div>
        ))}
        <div className="flex flex-col items-start gap-3 rounded-card bg-leaf p-8 md:col-span-2">
          <h2 className="font-display text-[26px] font-semibold text-ivory">Meet the people</h2>
          <p className="max-w-[520px] text-sand">Read how a day on the grading floor actually runs.</p>
          <Button asChild variant="onDark">
            <Link to={`/journal/${FEATURED.slug}`}>Read the story</Link>
          </Button>
        </div>
      </section>
    </>
  )
}

// ── Careers ─────────────────────────────────────────────────────────────────────────────────────────
const ROLES = [
  ['Quality & lab assistant', 'Tamil Nadu · On site', 'Run moisture and size checks, keep batch records tidy.'],
  ['Grading team lead', 'Tamil Nadu · On site', 'Lead a grading line, train new graders, protect the standard.'],
  ['Customer care executive', 'Chennai · Hybrid', 'Answer orders and gifting questions on WhatsApp and phone.'],
  ['Digital marketing associate', 'Remote', 'Plan festive campaigns, email and WhatsApp journeys.'],
]

export function CareersPage() {
  const [role, setRole] = useState(ROLES[0][0])
  const [ref, setRef] = useState('')

  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-5 pb-12 pt-14 lg:pt-[88px]">
        <p className="eyebrow">CAREERS</p>
        <h1 className="max-w-[760px] font-display text-[40px] font-semibold leading-[1.1] md:text-h1">Come and master something small.</h1>
        <p className="max-w-[640px] text-body-l">We are a small team that cares about getting one product exactly right. If that sounds like you, we would like to meet.</p>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-12 py-12 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <h2 className="font-display text-[28px] font-semibold">Open roles</h2>
          {ROLES.map(([title, where, body]) => (
            <button
              key={title}
              type="button"
              onClick={() => {
                setRole(title)
                document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex flex-col items-start gap-1.5 rounded-card border border-line bg-white p-6 text-left hover:border-roast"
            >
              <span className="font-display text-xl font-semibold">{title}</span>
              <span className="font-mono text-xs text-muted-foreground">{where}</span>
              <span className="text-sm">{body}</span>
              <span className="text-sm font-bold text-primary">Apply →</span>
            </button>
          ))}
        </div>

        <form
          id="apply"
          className="flex w-full scroll-mt-28 flex-col gap-4 rounded-media bg-white p-6 md:p-10 lg:w-[560px] lg:shrink-0"
          onSubmit={(e) => {
            e.preventDefault()
            setRef(saveEnquiry('career-application', e.currentTarget))
          }}
        >
          <h2 className="font-display text-[28px] font-semibold">Apply</h2>
          <Field label="Role">
            <select name="role" value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}>
              {ROLES.map(([t]) => (
                <option key={t}>{t}</option>
              ))}
              <option>Something else</option>
            </select>
          </Field>
          <Field label="Name">
            <input name="name" required className={fieldClass} />
          </Field>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Field label="Email">
              <input name="email" type="email" required className={fieldClass} />
            </Field>
            <Field label="Phone">
              <input name="phone" type="tel" required className={fieldClass} />
            </Field>
          </div>
          <Field label="Why Durai?">
            <textarea name="note" rows={4} className="resize-none rounded-input border border-line bg-white p-3.5 text-sm font-normal focus-visible:border-roast focus-visible:outline-none" />
          </Field>
          {ref ? (
            <p role="status" className="rounded-input bg-mint p-3 text-sm font-medium text-leaf">
              Nandri! We have your application (reference {ref}) and will be in touch.
            </p>
          ) : (
            <Button type="submit">Send application</Button>
          )}
        </form>
      </section>
    </>
  )
}

// ── Press ───────────────────────────────────────────────────────────────────────────────────────────
const FACTS = [
  ['What we are', 'A Tamil Nadu cashew grader and roaster selling graded whole cashews, gifts and bulk supply under our own name.'],
  ['What is different', 'Every tin shows its grade, its roast date and its batch — and every batch is lab tested.'],
  ['Products', 'Whole grades W180, W210, W240 and W320, splits and pieces, in seven flavours and gift boxes.'],
]

export function PressPage() {
  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-5 pb-12 pt-14 lg:pt-[88px]">
        <p className="eyebrow">PRESS</p>
        <h1 className="max-w-[760px] font-display text-[40px] font-semibold leading-[1.1] md:text-h1">For journalists and creators.</h1>
        <p className="max-w-[640px] text-body-l">Facts, images and a person to talk to. We reply to media requests within a working day.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={`mailto:${SITE.email}?subject=Press%20enquiry`}>Email the team</a>
          </Button>
          <Button asChild variant="secondary">
            <a href={whatsappUrl('Hi Durai Cashew, I have a press enquiry')} target="_blank" rel="noreferrer">
              WhatsApp us
            </a>
          </Button>
        </div>
      </section>
      <section className="page-x mx-auto grid max-w-[1440px] gap-6 py-12 md:grid-cols-3">
        {FACTS.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-2.5 rounded-card bg-white p-7">
            <h2 className="font-display text-2xl font-semibold">{title}</h2>
            <p className="leading-[1.6]">{body}</p>
          </div>
        ))}
      </section>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-6 pb-24">
        <h2 className="font-display text-[28px] font-semibold">Brand assets</h2>
        <div className="flex flex-wrap gap-6">
          {[['durai-symbol.svg', 'Symbol'], ['seal.svg', 'Seal']].map(([file, label]) => (
            <a key={file} href={`/assets/icons/${file}`} download className="flex flex-col items-center gap-3 rounded-card border border-line bg-white p-6 hover:border-roast">
              <img src={`/assets/icons/${file}`} alt="" className="size-24" />
              <span className="text-sm font-bold">Download {label} (SVG)</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

// ── Find a store ────────────────────────────────────────────────────────────────────────────────────
const STORES = [
  { name: 'Durai Cashew factory shop', city: 'Tamil Nadu', hours: 'Mon–Sat · 10 am – 6 pm', note: 'Factory visits by appointment.' },
]

export function StoresPage() {
  const [q, setQ] = useState('')
  const found = STORES.filter((s) => `${s.name} ${s.city}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-14 lg:py-[88px]">
      <div className="flex flex-col gap-4">
        <p className="eyebrow">FIND US</p>
        <h1 className="max-w-[760px] font-display text-[40px] font-semibold leading-[1.1] md:text-h1">Where to buy Durai in person.</h1>
        <p className="max-w-[620px] text-body-l">Our factory shop is open six days a week. Everywhere else in India, we deliver.</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by city or name"
          aria-label="Search stores"
          className="h-14 w-full max-w-[520px] rounded-full border border-line bg-white px-6 text-base focus-visible:border-roast focus-visible:outline-none"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {found.map((s) => (
          <article key={s.name} className="flex flex-col gap-2 rounded-card border border-line bg-white p-7">
            <h2 className="font-display text-[26px] font-semibold">{s.name}</h2>
            <p className="font-mono text-sm text-muted-foreground">{SITE.address || s.city}</p>
            <p className="flex items-center gap-2 text-sm">
              <Icon name="clock-14" size={14} />
              {s.hours}
            </p>
            <p className="text-sm text-muted-foreground">{s.note}</p>
            <a href={whatsappUrl('Hi Durai Cashew, please share the shop location')} target="_blank" rel="noreferrer" className="mt-2 text-sm font-bold text-primary underline">
              Ask for directions →
            </a>
          </article>
        ))}
        {found.length === 0 && (
          <p className="rounded-card border border-line bg-white p-7 md:col-span-2">
            No store in “{q}” yet — but we deliver there. <Link to="/shop" className="font-bold underline">Shop online</Link>, or{' '}
            <Link to="/wholesale" className="font-bold underline">become a stockist</Link>.
          </p>
        )}
      </div>
    </section>
  )
}

// ── Sitemap ─────────────────────────────────────────────────────────────────────────────────────────
const SITEMAP = [
  ['Shop', [['All cashews', '/shop'], ['Grade guide', '/grades'], ['Flavours', '/flavours'], ['Compare', '/compare'], ['Subscribe and save', '/subscribe']]],
  ['Gifting', [['Gifting hub', '/gifting'], ['Build a gift box', '/gifting/build'], ['Corporate gifting', '/gifting/corporate'], ['Wholesale', '/wholesale']]],
  ['Company', [['Our story', '/our-story'], ['Quality & lab testing', '/quality'], ['Sustainability', '/sustainability'], ['Careers', '/careers'], ['Press', '/press'], ['Find a store', '/stores']]],
  ['Learn', [['Journal', '/journal'], ['FAQ', '/faq'], ['Search', '/search']]],
  ['Help & account', [['Contact', '/contact'], ['Track order', '/track-order'], ['Account', '/account'], ['Cart', '/checkout/cart']]],
  ['Policies', [['Shipping', '/policies/shipping'], ['Returns & refunds', '/policies/returns'], ['Privacy', '/policies/privacy'], ['Terms of service', '/policies/terms']]],
]

export function SitemapPage() {
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-14 lg:py-[88px]">
      <SectionHeading eyebrow="SITEMAP" title="Every page on the site" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {SITEMAP.map(([group, links]) => (
          <div key={group} className="flex flex-col gap-3">
            <h2 className="font-display text-2xl font-semibold">{group}</h2>
            {links.map(([label, to]) => (
              <Link key={to} to={to} className="text-[15px] hover:underline">
                {label}
              </Link>
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold">Products</h2>
          {PRODUCTS.map((p) => (
            <Link key={p.id} to={`/shop/${p.id}`} className="text-[15px] hover:underline">
              {p.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold">Stories</h2>
          {[FEATURED, ...ARTICLES].map((a) => (
            <Link key={a.slug} to={`/journal/${a.slug}`} className="text-[15px] hover:underline">
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 404 ─────────────────────────────────────────────────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-5 py-20 text-center lg:py-[120px]">
        <p className={cn('font-display text-[96px] font-semibold leading-none text-gold md:text-[140px]')} aria-hidden>
          404
        </p>
        <p className="eyebrow text-primary">PAGE NOT FOUND</p>
        <h1 className="font-display text-[36px] font-semibold leading-[1.12] md:text-h1">This tin is empty.</h1>
        <p className="max-w-[520px] text-body-l">That page has moved or never existed. Try the shop, or search the site.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/shop">Go to the shop</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/search">Search the site</Link>
          </Button>
        </div>
      </section>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-6 pb-24">
        <h2 className="font-display text-[28px] font-semibold">While you’re here</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} listing />
          ))}
        </div>
      </section>
    </>
  )
}
