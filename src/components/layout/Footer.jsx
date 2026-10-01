import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { Icon } from '@/components/shared/Icon'
import { SITE, whatsappUrl } from '@/data/site'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      ['All cashews', '/shop'],
      ['By grade', '/grades'],
      ['By flavour', '/flavours'],
      ['Combos', '/gifting'],
      ['Subscribe and save', '/subscribe'],
    ],
  },
  {
    title: 'Gifting',
    links: [
      ['Gifting hub', '/gifting'],
      ['Build a gift box', '/gifting/build'],
      ['Corporate gifting', '/gifting/corporate'],
      ['Wholesale', '/wholesale'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['Our story', '/our-story'],
      ['Quality & lab testing', '/quality'],
      ['Sustainability', '/sustainability'],
      ['Careers', '/careers'],
      ['Press', '/press'],
      ['Find a store', '/stores'],
    ],
  },
  {
    title: 'Help',
    links: [
      ['Track order', '/track-order'],
      ['FAQ', '/faq'],
      ['Shipping', '/policies/shipping'],
      ['Returns', '/policies/returns'],
      ['Contact', '/contact'],
    ],
  },
]
const SOCIAL = [
  ['ig-gold', 'Instagram', SITE.social.instagram],
  ['fb-gold', 'Facebook', SITE.social.facebook],
  ['yt-gold', 'YouTube', SITE.social.youtube],
  ['wa-gold', 'WhatsApp', whatsappUrl('Hi Durai Cashew')],
]
const PAYMENTS = ['UPI', 'RuPay', 'Visa', 'Mastercard', 'COD']

export function Footer() {
  return (
    <footer className="bg-roast">
      <div className="overflow-hidden pt-5">
        <img src="/assets/icons/kolam-footer.svg" alt="" className="h-6 w-[1440px] max-w-none" />
      </div>

      <div className="page-x mx-auto grid max-w-[1440px] gap-10 pb-12 pt-16 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_1fr_auto] lg:gap-10">
        <div className="flex flex-col gap-4">
          <Logo dark />
          <p className="w-[260px] text-sm leading-relaxed text-sand">
            Master of the Cashew. Graded, roasted and packed in-house in Tamil Nadu.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <p className="text-label font-bold uppercase text-gold">{col.title}</p>
            {col.links.map(([label, to]) => (
              <Link key={label} to={to} className="text-sm text-ivory hover:text-gold">
                {label}
              </Link>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-3 text-sm text-ivory">
          <p className="text-label font-bold uppercase text-gold">Contact</p>
          {SITE.phone && <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>}
          <a href={`mailto:${SITE.email}`} className="hover:text-gold">
            {SITE.email}
          </a>
          <p className="w-[220px] leading-normal">{SITE.address ? `Factory: ${SITE.address}` : 'Factory: Tamil Nadu'}</p>
          <div className="flex gap-2.5">
            {SOCIAL.map(([icon, label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="rounded-full border border-gold p-2" aria-label={label}>
                <Icon name={icon} size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-4 border-t border-ivory/15 pb-7 pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-sand">
          © {new Date().getFullYear()} Durai Cashew{SITE.fssai ? ` · FSSAI Lic. No. ${SITE.fssai}` : ''} ·{' '}
          <Link to="/policies/privacy" className="hover:text-gold">Privacy</Link> ·{' '}
          <Link to="/policies/terms" className="hover:text-gold">Terms</Link> ·{' '}
          <Link to="/policies/shipping" className="hover:text-gold">Shipping</Link> ·{' '}
          <Link to="/policies/returns" className="hover:text-gold">Returns</Link> ·{' '}
          <Link to="/sitemap" className="hover:text-gold">Sitemap</Link>
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
