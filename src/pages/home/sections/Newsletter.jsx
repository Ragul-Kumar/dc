import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/shared/Icon'
import { saveEnquiry } from '@/lib/enquiries'
import { whatsappUrl } from '@/data/site'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section className="bg-sand">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-20">
        <div className="flex flex-1 flex-col gap-2.5">
          <p className="eyebrow">VANAKKAM</p>
          <h2 className="font-display text-[32px] font-semibold md:text-h2">Get festive offers first</h2>
          <p className="max-w-[480px] leading-relaxed">
            One email a month and WhatsApp alerts before Diwali and Pongal. No spam.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-3 lg:w-[560px]"
          onSubmit={(e) => {
            e.preventDefault()
            if (email.includes('@')) {
              saveEnquiry('newsletter', e.currentTarget)
              setDone(true)
            }
          }}
        >
          {done ? (
            <p role="status">
              Nandri! Check your inbox to confirm.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address"
                className="h-[52px] border-0 bg-white"
              />
              <Button type="submit">Subscribe</Button>
            </div>
          )}
          <a
            href={whatsappUrl("Hi Durai Cashew, send me festive offers on WhatsApp")}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-2.5 rounded-full border border-roast/40 px-[18px] py-3 text-sm font-bold hover:bg-roast/5"
          >
            <Icon name="wa-green" size={20} />
            Or get updates on WhatsApp
          </a>
        </form>
      </div>
    </section>
  )
}
