import { Logo } from '@/components/shared/Logo'
import { Icon } from '@/components/shared/Icon'
import { SITE, whatsappUrl } from '@/data/site'

export function CheckoutHeader() {
  return (
    <header className="border-b border-line bg-ivory">
      <div className="page-x mx-auto flex max-w-[1440px] items-center justify-between gap-4 py-[18px]">
        <Logo />
        <div className="hidden items-center gap-2 sm:flex">
          <Icon name="lock" size={18} />
          <span className="text-label font-bold text-leaf">SECURE CHECKOUT</span>
        </div>
        <a href={whatsappUrl('Hi Durai Cashew, I need help with my order')} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium">
          <Icon name="wa" size={18} />
          <span className="hidden sm:inline">Need help? {SITE.phone ? SITE.phone : 'WhatsApp us'}</span>
          <span className="sm:hidden">Help</span>
        </a>
      </div>
    </header>
  )
}
