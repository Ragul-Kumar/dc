import { Logo } from '@/components/shared/Logo'
import { Icon } from '@/components/shared/Icon'

const COLUMNS = [
  { title: 'Shop', links: ['All cashews', 'By grade', 'By flavour', 'Combos', 'Subscribe and save'] },
  { title: 'Gifting', links: ['Gifting hub', 'Build a gift box', 'Corporate gifting', 'Wholesale'] },
  { title: 'Help', links: ['Track order', 'FAQ', 'Shipping', 'Returns', 'Contact'] },
]
const SOCIAL = ['ig-gold', 'fb-gold', 'yt-gold', 'wa-gold']
const PAYMENTS = ['UPI', 'RuPay', 'Visa', 'Mastercard', 'COD']

export function Footer() {
  return (
    <footer className="bg-roast">
      <div className="overflow-hidden pt-5">
        <img src="/assets/icons/kolam-footer.svg" alt="" className="h-6 w-[1440px] max-w-none" />
      </div>

      <div className="page-x mx-auto grid max-w-[1440px] gap-10 pb-12 pt-16 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto] lg:gap-12">
        <div className="flex flex-col gap-4">
          <Logo dark />
          <img src="/assets/icons/seal.svg" alt="" className="size-24" />
          <p className="w-[260px] text-sm leading-relaxed text-sand">
            Master of the Cashew. Graded, roasted and packed in-house in Tamil Nadu.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <p className="text-label font-bold uppercase text-gold">{col.title}</p>
            {col.links.map((l) => (
              <a key={l} href="#" className="text-sm text-ivory hover:text-gold">
                {l}
              </a>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-3 text-sm text-ivory">
          <p className="text-label font-bold uppercase text-gold">Contact</p>
          <p>WhatsApp +91 [confirm]</p>
          <p>hello@duraicashew.in [confirm]</p>
          <p className="w-[220px] leading-normal">Factory: [confirm address], Tamil Nadu</p>
          <div className="flex gap-2.5">
            {SOCIAL.map((s) => (
              <a key={s} href="#" className="rounded-full border border-gold p-2" aria-label={s.split('-')[0]}>
                <Icon name={s} size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-4 border-t border-ivory/15 pb-7 pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-sand">
          © 2026 Durai Cashew · FSSAI Lic. No. [confirm] · Privacy · Terms · Shipping · Returns
        </p>
        <div className="flex flex-wrap gap-2">
          {PAYMENTS.map((p) => (
            <span key={p} className="rounded-md border border-sand/40 px-2.5 py-[5px] font-mono text-[11px] text-ivory">
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
