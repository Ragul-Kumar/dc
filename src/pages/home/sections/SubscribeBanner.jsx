import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function SubscribeBanner() {
  return (
    <section className="page-x mx-auto max-w-[1440px] py-20">
      <div className="flex flex-col items-start justify-between gap-6 rounded-media bg-sand px-6 py-10 md:px-14 md:py-16 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-2.5">
          <p className="eyebrow">SUBSCRIBE AND SAVE</p>
          <h2 className="font-display text-[30px] font-semibold leading-tight md:text-h2">Never run out. Save 10% monthly.</h2>
          <p className="max-w-[620px] leading-relaxed">
            Pick your grade and flavours, choose every 2, 4 or 8 weeks. Skip or cancel anytime.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/subscribe">Start a subscription</Link>
        </Button>
      </div>
    </section>
  )
}
