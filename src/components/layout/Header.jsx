import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Icon } from '@/components/shared/Icon'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/context/CartContext'

const NAV = ['Shop', 'Grades', 'Gifting', 'Wholesale', 'Our Story', 'Journal']

export function Header() {
  const { count, setDrawer } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  // Deep link: /#cart opens the cart drawer (e.g. from emails or WhatsApp)
  useEffect(() => {
    if (window.location.hash === '#cart') setDrawer(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory">
      <div className="page-x mx-auto flex max-w-[1440px] items-center justify-between py-[18px]">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="size-6 text-roast" strokeWidth={1.5} />
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-9 text-[15px] font-medium lg:flex">
          {NAV.map((n) => (
            <a key={n} href="#" className="hover:text-primary">
              {n}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-[22px]">
          <button aria-label="Search" className="hidden sm:block">
            <Icon name="search" />
          </button>
          <button aria-label="Account" className="hidden sm:block">
            <Icon name="user" />
          </button>
          <button aria-label={`Cart, ${count} items`} className="relative" onClick={() => setDrawer(true)}>
            <Icon name="bag" />
            {count > 0 && (
              <span className="absolute -top-1 left-3 rounded-full bg-primary px-[5px] py-px text-[10px] font-bold text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="p-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
          <nav className="mt-10 flex flex-col gap-5 text-lg font-medium">
            {NAV.map((n) => (
              <a key={n} href="#" onClick={() => setMenuOpen(false)}>
                {n}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
