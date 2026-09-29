import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/shared/Icon'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section className="bg-roast">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-20">
        <div className="flex flex-1 flex-col gap-2.5">
          <p className="eyebrow text-gold">VANAKKAM</p>
          <h2 className="font-display text-[32px] font-semibold text-ivory md:text-h2">Get festive offers first</h2>
          <p className="max-w-[480px] leading-relaxed text-sand">
            One email a month and WhatsApp alerts before Diwali and Pongal. No spam.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-3 lg:w-[560px]"
          onSubmit={(e) => {
            e.preventDefault()
            if (email.includes('@')) setDone(true)
          }}
        >
          {done ? (
            <p className="text-ivory" role="status">
              Nandri! Check your inbox to confirm.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address"
                className="h-[52px] border-0 bg-ivory"
              />
              <Button type="submit">Subscribe</Button>
            </div>
          )}
          <a
            href="#"
            className="flex w-fit items-center gap-2.5 rounded-full border border-ivory/35 px-[18px] py-3 text-sm font-bold text-ivory hover:bg-ivory/10"
          >
            <Icon name="wa-green" size={20} />
            Or get order's on WhatsApp
          </a>
        </form>
      </div>
    </section>
  )
}
