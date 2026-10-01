import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { FaqList } from '@/components/shared/FaqList'
import { Field, fieldClass } from '@/components/shared/FormField'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { SITE, whatsappUrl } from '@/data/site'
import { saveEnquiry } from '@/lib/enquiries'
import { cn } from '@/lib/utils'

// Figma 15 · Contact (39:7419). Phone, WhatsApp number and address come from src/data/site.js;
// cards without a configured value fall back to a working action instead of showing a placeholder.
const CARDS = [
  {
    icon: 'wa-32',
    title: 'WhatsApp',
    value: SITE.whatsapp ? `+${SITE.whatsapp}` : 'Message us anytime',
    hours: 'Mon–Sat · 9 am – 8 pm',
    cta: 'Chat now →',
    href: whatsappUrl('Hi Durai Cashew'),
  },
  {
    icon: 'phone',
    title: 'Phone',
    value: SITE.phone || 'Call us on WhatsApp',
    hours: 'Mon–Sat · 10 am – 6 pm',
    cta: SITE.phone ? 'Call us →' : 'Chat now →',
    href: SITE.phone ? `tel:${SITE.phone.replace(/\s/g, '')}` : whatsappUrl('Hi Durai Cashew, can you call me?'),
  },
  {
    icon: 'mail',
    title: 'Email',
    value: SITE.email,
    hours: 'Replies within 24 hours',
    cta: 'Write to us →',
    href: `mailto:${SITE.email}`,
  },
]
const TOPICS = ['Order', 'Gifting', 'Wholesale', 'Other']
const FAQ = [
  { q: 'Where is my order?', a: 'Use Track order with your order number and phone — no login needed.' },
  { q: 'Can I change my delivery address?', a: 'Yes, until the order is packed. Message us on WhatsApp with your order number and the new address.' },
  { q: 'Do you ship outside India?', a: 'Not yet for retail orders. Exporters can reach us through the Wholesale page.' },
  { q: 'My tin arrived damaged', a: 'Send a photo on WhatsApp within 48 hours of delivery and we will replace the tin.' },
]

export default function ContactPage() {
  const [topic, setTopic] = useState('Order')
  const [ref, setRef] = useState('')

  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-4 pb-12 pt-16 lg:pt-[88px]">
        <p className="font-tamil text-[22px] text-gold" lang="ta">
          வணக்கம்
        </p>
        <h1 className="font-display text-[40px] font-semibold leading-[1.1] md:text-h1">Vanakkam. How can we help?</h1>
        <p className="text-body-l">Real people, usually within an hour during working hours.</p>
      </section>

      <section className="page-x mx-auto grid max-w-[1440px] gap-6 pb-16 md:grid-cols-3">
        {CARDS.map((c) => (
          <a key={c.title} href={c.href} className="flex flex-col items-start gap-3 rounded-card border border-line bg-white p-8 transition-colors hover:border-roast">
            <Icon name={c.icon} size={32} />
            <h2 className="font-display text-[26px] font-semibold">{c.title}</h2>
            <p className="break-all font-mono text-[15px] font-medium">{c.value}</p>
            <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Icon name="clock-14" size={14} />
              {c.hours}
            </p>
            <span className="text-sm font-bold text-primary">{c.cta}</span>
          </a>
        ))}
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-12 py-[88px] lg:flex-row">
        <form
          className="flex min-w-0 flex-1 flex-col items-start gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setRef(saveEnquiry('contact', e.currentTarget))
          }}
        >
          <SectionHeading eyebrow="WRITE TO US" title="Send a message" />
          <input type="hidden" name="topic" value={topic} />
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[13px] font-bold">Topic</legend>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={topic === t}
                  onClick={() => setTopic(t)}
                  className={cn(
                    'rounded-full border px-[18px] py-2.5 text-sm font-bold',
                    topic === t ? 'border-roast bg-roast text-ivory' : 'border-line bg-white hover:border-roast'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Field label="Name">
              <input name="name" required className={fieldClass} placeholder="Your name" />
            </Field>
            <Field label="Phone">
              <input name="phone" required type="tel" className={fieldClass} placeholder="+91" />
            </Field>
          </div>
          <Field label="Order number (optional)" className="w-full flex-none">
            <input name="order" className={cn(fieldClass, 'font-mono')} placeholder="e.g. DC-10482" />
          </Field>
          <Field label="Message" className="w-full flex-none">
            <textarea
              name="message"
              required
              className="h-[120px] w-full resize-none rounded-input border border-line bg-white p-3.5 text-sm font-normal placeholder:text-muted-foreground focus-visible:border-roast focus-visible:outline-none"
              placeholder="How can we help?"
            />
          </Field>
          {ref ? (
            <p role="status" className="rounded-input bg-mint p-3 text-sm font-medium text-leaf">
              Nandri! We have your message about “{topic.toLowerCase()}” (reference {ref}) and will reply soon.
            </p>
          ) : (
            <Button type="submit">Send message</Button>
          )}
        </form>

        <div className="flex w-full flex-col items-start gap-4 lg:w-[520px] lg:shrink-0">
          <img src="/assets/icons/map-contact.svg" alt="Map showing the Durai Cashew factory and shop" className="h-auto w-full rounded-card" />
          <h2 className="font-display text-[26px] font-semibold">Factory &amp; shop</h2>
          <p className="max-w-[480px] text-[15px] leading-[1.55]">{SITE.address || 'Tamil Nadu — message us for the exact location and visiting slots.'}</p>
          <p className="flex items-center gap-2 text-sm">
            <Icon name="clock-16" size={16} />
            Shop: Mon–Sat 10 am – 6 pm · Factory visits by appointment
          </p>
          <Button variant="secondary" asChild>
            <a href={SITE.address ? `https://maps.google.com/?q=${encodeURIComponent(SITE.address)}` : whatsappUrl('Hi Durai Cashew, please share the shop location')} target="_blank" rel="noreferrer">
              {SITE.address ? 'Get directions' : 'Ask for directions'}
            </a>
          </Button>
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="QUICK ANSWERS" title="Before you write" />
        <FaqList items={FAQ} />
        <p className="text-sm text-muted-foreground">
          More answers in the{' '}
          <Link to="/faq" className="font-bold underline">
            full FAQ
          </Link>
          .
        </p>
      </section>
    </>
  )
}
