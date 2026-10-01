import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/shared/Icon'
import { freshDate } from '@/data/products'

const TRUST = [
  { icon: 'star', title: '4.8 / 5', sub: '2,400+ reviews' },
  { icon: 'truck', title: '12,000+', sub: 'orders delivered' },
  { icon: 'lab', title: 'Lab tested', sub: 'every batch' },
  { icon: 'leaf', title: `Packed ${freshDate(2)}`, sub: 'this week’s roast' },
]

export function Hero() {
  const scrollToShop = () => document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' })
  const [tilt, setTilt] = useState(0)

  // "Macro cashew rotates on scroll": the bowl turns a little as the page scrolls
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const onScroll = () => setTilt(Math.min(18, window.scrollY * 0.04))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 pb-16 pt-10 lg:flex-row lg:items-center lg:gap-16 lg:pb-[88px] lg:pt-[72px]">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-7">
        <div className="flex max-w-full items-center gap-2 rounded-full border border-line bg-white py-2 pl-2 pr-3.5">
          <Badge>NEW</Badge>
          <p className="min-w-0 truncate text-[13px] font-medium">
            Chettinad Masala is here · 10% off your first order with code <span className="font-mono">FIRST10</span>
          </p>
        </div>

        <h1 className="max-w-[600px] font-display text-[56px] font-normal leading-none md:text-display-xl">
          One nut, <em className="font-normal">mastered.</em>
        </h1>

        <p className="max-w-[540px] text-base leading-relaxed md:text-body-l">
          Graded whole cashews from Tamil Nadu, roasted in small batches and packed with the date on every tin. W180
          to splits — you always know exactly what you are getting.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={scrollToShop}>Shop cashews</Button>
          <Button asChild variant="secondary">
            <Link to="/gifting/build">Build a gift box</Link>
          </Button>
        </div>

        <div className="grid w-full grid-cols-2 gap-5 border-t border-line pt-5 sm:flex sm:w-auto sm:flex-wrap sm:gap-7">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-2.5">
              <Icon name={t.icon} />
              <div>
                <p className="text-sm font-bold">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex aspect-[580/620] w-full max-w-[580px] shrink-0 self-center items-center justify-center overflow-hidden rounded-media bg-gradient-to-b from-ivory to-sand lg:w-[580px]">
        <img
          src="/assets/images/bowl-wood.png"
          alt="A wooden bowl of whole W240 cashews"
          className="h-[90%] w-[90%] object-contain will-change-transform"
          style={{ transform: `rotate(${tilt}deg)` }}
        />
        <p className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-night/85 py-2 pl-2.5 pr-3 text-[11px] font-medium text-ivory">
          <Icon name="play" size={12} />
          Macro cashew rotates on scroll
        </p>
      </div>
    </section>
  )
}
