import { Logo } from '@/components/shared/Logo'
import { Icon } from '@/components/shared/Icon'

export function CheckoutHeader() {
  return (
    <header className="border-b border-line bg-ivory">
      <div className="page-x mx-auto flex max-w-[1440px] items-center justify-between gap-4 py-[18px]">
        <Logo />
        <div className="hidden items-center gap-2 sm:flex">
          <Icon name="lock" size={18} />
          <span className="text-label font-bold text-leaf">SECURE CHECKOUT</span>
        </div>
        <a href="#" className="flex items-center gap-2 text-sm font-medium">
          <Icon name="wa" size={18} />
          <span className="hidden sm:inline">Need help? +91 [confirm]</span>
          <span className="sm:hidden">Help</span>
        </a>
      </div>
    </header>
  )
}
