import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/shared/Icon'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { saveEnquiry } from '@/lib/enquiries'
import { whatsappUrl } from '@/data/site'
import { cn } from '@/lib/utils'

// Figma 09 · Corporate gifting (39:6362). Prices, MOQs and lead times are placeholders [confirm].
const TIERS = [
  { name: 'Classic', price: '₹499', img: 'w240-plain.png', desc: 'Kraft box · 2 flavours · 300 g · printed card', cta: 'Choose Classic' },
  { name: 'Signature', price: '₹999', img: 'bowl-wood.png', desc: 'Brass tin · 4 flavours · 600 g · logo sleeve', cta: 'Choose Signature', featured: true },
  { name: 'Grand', price: '₹1,999', img: 'mood-snacking.png', desc: 'Wooden drawer · W180 + 5 flavours · 1.2 kg · co-branded lid', cta: 'Choose Grand' },
]
const BRANDING = [
  ['brand-tag', 'Logo on sleeve', 'Full-colour print on a paper sleeve. MOQ 50.'],
  ['brand-doc', 'Custom card', 'Your message and signature, printed or handwritten.'],
  ['brand-tin', 'Co-branded tin', 'Embossed lid with both logos. MOQ 250.'],
]
const SLABS = [
  ['50 – 99', '₹499', '₹999', '₹1,999', '10 days'],
  ['100 – 249', '₹469', '₹949', '₹1,899', '12 days', true],
  ['250 – 499', '₹449', '₹899', '₹1,799', '15 days'],
  ['500+', 'Request quote', 'Request quote', 'Request quote', 'Talk to us'],
]
const STEPS = [
  ['Brief', 'Tell us quantity, budget and date.'],
  ['Sample', 'We courier a sample box in 3 days.'],
  ['Approval', 'Sign off artwork and contents.'],
  ['Production', 'Packed fresh, batch-coded.'],
  ['Pan-India delivery', 'To one office or 500 homes.'],
]
const REVIEWS = [
  ['“400 boxes, 60 cities, all delivered before Diwali. Zero follow-up from our side.”', 'Head of People, a tech company'],
  ['“The sample arrived in two days and the logo sleeve looked better than our own print.”', 'Procurement Lead, a tech company'],
  ['“Clients actually posted about it. That never happens with dry-fruit boxes.”', 'Founder’s Office, a tech company'],
]
const QUANTITIES = ['50 boxes', '100 boxes', '250 boxes', '500+ boxes']
const BUDGETS = ['₹500 – ₹900', '₹900 – ₹1,200', '₹1,200 – ₹2,000', '₹2,000+']

export default function CorporateGiftingPage() {
  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-10 py-14 lg:flex-row lg:gap-16 lg:py-[72px]">
        <div className="flex flex-1 flex-col items-start gap-6">
          <p className="eyebrow">CORPORATE GIFTING</p>
          <h1 className="max-w-[560px] font-display text-[44px] font-semibold leading-[1.1] md:text-h1">Gifts your clients will actually open.</h1>
          <p className="max-w-[520px] text-body-l">
            Branded cashew boxes for Diwali, onboarding and client thank-yous. 50 to 5,000 boxes, delivered pan-India on your
            date.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="#quote">Get a quote in 24 hrs</a>
            </Button>
            <Button asChild variant="secondary">
              <a href={whatsappUrl("Hi Durai Cashew, I would like a corporate gifting quote")} target="_blank" rel="noreferrer">
                <Icon name="wa-20" size={20} />
                WhatsApp us
              </a>
            </Button>
          </div>
        </div>
        <div className="relative flex h-[360px] w-full items-center justify-center rounded-media bg-night md:h-[480px] lg:w-[580px] lg:shrink-0">
          <img src="/assets/images/bowl-wood.png" alt="A branded gift tin of cashews" className="h-[83%] w-[83%] object-contain" />
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-ivory px-[18px] py-2.5">
            <span className="text-xs font-bold tracking-[0.2em]">YOUR LOGO</span>
            <span className="font-display text-sm italic text-gold">× Durai</span>
          </div>
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-5 py-12">
        <p className="text-sm font-medium text-muted-foreground">
          Teams we gift for
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex h-[72px] items-center justify-center rounded-xl bg-white text-sm font-bold text-line">
              Client logo
            </div>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="PACKAGES" title="Three tiers, all customisable" />
        <div className="grid items-end gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <article
              key={t.name}
              className={cn(
                'relative flex flex-col items-start gap-4 rounded-3xl border p-6',
                t.featured ? 'border-roast bg-roast text-ivory' : 'border-line bg-white'
              )}
            >
              {t.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-night">
                  MOST CHOSEN
                </span>
              )}
              <div className={cn('flex h-[200px] w-full items-center justify-center rounded-2xl', t.featured ? 'bg-night' : 'bg-ivory')}>
                <img src={`/assets/images/${t.img}`} alt="" className="h-[180px] w-[260px] max-w-full object-contain" />
              </div>
              <h3 className="font-display text-[32px] font-semibold">{t.name}</h3>
              <p className={cn('font-mono text-[15px] font-medium', t.featured && 'text-gold')}>from {t.price} / box</p>
              <p className={cn('max-w-[340px] text-[15px] leading-[1.55]', t.featured && 'text-sand')}>{t.desc}</p>
              <Button asChild variant={t.featured ? 'default' : 'secondary'}>
                <a href="#quote">{t.cta}</a>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="BRANDING" title="Your brand, our cashews" />
        <div className="grid gap-6 md:grid-cols-3">
          {BRANDING.map(([icon, title, body]) => (
            <div key={title} className="flex flex-col gap-3 rounded-card bg-white p-7">
              <Icon name={icon} size={32} />
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              <p className="max-w-[340px] text-[15px] leading-[1.55]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="BULK PRICING" title="The more you send, the less each costs" />
        <div className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-sand/60 text-muted-foreground">
                {['Boxes', 'Classic', 'Signature', 'Grand', 'Lead time'].map((h) => (
                  <th key={h} className="p-4 text-xs font-bold uppercase tracking-[0.12em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLABS.map(([qty, ...cells]) => {
                const highlight = cells[cells.length - 1] === true
                const values = cells.filter((c) => c !== true)
                return (
                  <tr key={qty} className={cn('border-t border-line', highlight && 'bg-mint')}>
                    <td className="p-4 font-bold">{qty}</td>
                    {values.map((v, i) => (
                      <td key={i} className={cn('p-4 font-mono font-medium', v === 'Request quote' && 'text-primary')}>
                        {v}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="-mt-6 text-[13px] text-muted-foreground">Per-box prices incl. GST, excl. delivery. Indicative.</p>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="HOW IT WORKS" title="From brief to doorstep in five steps" />
        <ol className="grid gap-8 md:grid-cols-5">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex flex-col gap-3">
              <div className="flex items-center">
                <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-ivory', i === 0 ? 'bg-primary' : 'bg-roast')}>
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && <span className="hidden h-0.5 flex-1 bg-line md:block" />}
              </div>
              <h3 className="font-display text-[22px] font-semibold">{title}</h3>
              <p className="max-w-[200px] text-sm leading-normal">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <QuoteForm />

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="FROM HR & PROCUREMENT" title="What buyers tell us" />
        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map(([text, who]) => (
            <article key={who} className="flex flex-col gap-3.5 rounded-card border border-line bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-base text-gold">★★★★★</span>
                <Badge variant="success">Verified client</Badge>
              </div>
              <p className="leading-[1.55]">{text}</p>
              <div className="mt-auto flex items-center gap-3">
                <Icon name="avatar" size={40} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold">{who}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">Signature · 250 boxes</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Just need a few gifts? <Link to="/gifting" className="font-bold underline">See the gifting hub</Link>
        </p>
      </section>
    </>
  )
}

const fieldClass =
  'h-12 w-full rounded-input border border-line bg-white px-3.5 text-sm font-normal focus-visible:border-roast focus-visible:outline-none'

function Field({ label, children, className }) {
  return (
    <label className={cn('flex flex-1 flex-col gap-1.5 text-[13px] font-bold', className)}>
      {label}
      {children}
    </label>
  )
}

function QuoteForm() {
  const [ref, setRef] = useState("")
  const [fileError, setFileError] = useState("")
  const today = new Date().toISOString().slice(0, 10)
  const [logo, setLogo] = useState('')

  return (
    <section id="quote" className="scroll-mt-20 bg-roast">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-12 py-[88px] lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-4">
          <p className="eyebrow text-gold">GET A QUOTE</p>
          <h2 className="max-w-[440px] font-display text-[36px] font-semibold leading-[1.12] text-ivory md:text-[48px]">
            Tell us about your gifting.
          </h2>
          <p className="max-w-[420px] text-[17px] leading-[1.6] text-sand">
            Instant acknowledgement with our PDF catalogue. Our team replies within one working day.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-4 rounded-media bg-ivory p-6 md:p-10 lg:w-[680px] lg:shrink-0"
          onSubmit={(e) => {
            e.preventDefault()
            setRef(saveEnquiry("corporate-quote", e.currentTarget))
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <Field label="Company">
              <input name="company" required className={fieldClass} placeholder="Acme Technologies" />
            </Field>
            <Field label="Your name">
              <input name="name" required className={fieldClass} placeholder="Anitha K." />
            </Field>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Field label="Work email">
              <input name="email" required type="email" className={fieldClass} placeholder="anitha@acme.in" />
            </Field>
            <Field label="Phone">
              <input name="phone" required type="tel" className={cn(fieldClass, "font-mono")} placeholder="+91 98xxx xxxxx" />
            </Field>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Field label="Quantity">
              <select name="quantity" className={fieldClass} defaultValue={QUANTITIES[2]}>
                {QUANTITIES.map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </Field>
            <Field label="Budget per gift">
              <select name="budget" className={fieldClass} defaultValue={BUDGETS[1]}>
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Delivery by">
              <input name="deliveryBy" type="date" min={today} className={cn(fieldClass, "font-mono")} />
            </Field>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-line p-[18px] text-sm font-medium">
            <Icon name="upload" size={20} />
            {logo || 'Upload your logo (SVG, PNG, PDF · max 10 MB)'}
            <input
              name="logo"
              type="file"
              accept=".svg,.png,.pdf"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file && file.size > 10 * 1024 * 1024) {
                  e.target.value = ""
                  setLogo("")
                  setFileError("That file is over 10 MB — please upload a smaller logo.")
                } else {
                  setLogo(file?.name ?? "")
                  setFileError("")
                }
              }}
            />
          </label>
          {fileError && (
            <p className="text-xs font-medium text-error" role="alert">
              {fileError}
            </p>
          )}
          {ref ? (
            <p role="status" className="rounded-input bg-mint p-3 text-sm font-medium text-leaf">
              Nandri! We have your request (reference {ref}) — expect our catalogue and a reply within one working day.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">Send quote request</Button>
              <a href={whatsappUrl("Hi Durai Cashew, I would like a corporate gifting quote")} target="_blank" rel="noreferrer" className="text-sm font-bold underline">
                or WhatsApp us
              </a>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
