import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/shared/SectionHeading'

const BOXES = [
  { name: 'Classic Tin', desc: 'W240 Classic Plain + Roasted & Salted · 500 g', price: '₹899', img: 'w240-plain.png' },
  { name: 'Signature Box', desc: 'Four flavours in brass-finish slots · 800 g', price: '₹1,649', img: 'bowl-wood.png' },
  { name: 'Grand Drawer', desc: 'W180 King + six flavours, keepsake box · 1.4 kg', price: '₹2,999', img: 'mood-snacking.png' },
]

export function GiftingSpotlight() {
  return (
    <section className="bg-night">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-12 py-24">
        <div className="w-full overflow-hidden">
          <img src="/assets/icons/kolam-gifting.svg" alt="" className="h-6 w-[1280px] max-w-none" />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <p className="eyebrow text-gold">FESTIVE &amp; PERSONAL GIFTING</p>
          <h2 className="font-display text-[40px] font-semibold leading-[1.15] text-ivory md:text-h1">Gift the good kind</h2>
          <p className="max-w-[560px] text-base leading-relaxed text-sand md:text-body-l">
            Gold-foiled tins and boxes, filled with graded whole cashews and a handwritten card.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-3">
          {BOXES.map((b) => (
            <article key={b.name} className="flex flex-col gap-4 rounded-card border border-gold/50 p-4">
              <div className="flex h-[300px] items-center justify-center rounded-2xl bg-[#2A1F1A]">
                <img src={`/assets/images/${b.img}`} alt="" className="h-[260px] w-[300px] max-w-full object-contain" />
              </div>
              <div className="flex flex-col gap-1.5 px-2 pb-2 pt-1">
                <h3 className="font-display text-2xl font-semibold text-ivory">{b.name}</h3>
                <p className="text-sm leading-normal text-sand">{b.desc}</p>
                <p className="font-mono text-sm text-gold">from {b.price}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button>Build a gift box</Button>
          <Button variant="onDark">Corporate gifting</Button>
        </div>
      </div>
    </section>
  )
}
