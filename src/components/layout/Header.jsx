import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Icon } from '@/components/shared/Icon'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/context/CartContext'
import { SearchDialog } from './SearchDialog'

const NAV = [
  { label: 'Shop', to: '/shop' },
  { label: 'Grades', to: '/grades' },
  { label: 'Gifting', to: '/gifting' },
  { label: 'Subscribe', to: '/subscribe' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'Our Story', to: '/our-story' },
  { label: 'Journal', to: '/journal' },
]

// Figma: current page is Manrope Bold with a 2px underline
const navClass = ({ isActive }) =>
  isActive ? 'font-bold underline decoration-2 underline-offset-[6px]' : 'hover:text-primary'

export function Header() {
  const { count, setDrawer } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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

        <nav className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={navClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-[22px]">
          <button aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Icon name="search" />
          </button>
          <Link to="/account" aria-label="Account" className="hidden sm:block">
            <Icon name="user" />
          </Link>
          <button aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`} className="relative" onClick={() => setDrawer(true)}>
            <Icon name="bag" />
            {count > 0 && (
              <span className="absolute -top-1 left-3 rounded-full bg-primary px-[5px] py-px text-[10px] font-bold text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="p-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
          <nav className="mt-10 flex flex-col gap-5 text-lg font-medium">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={navClass} onClick={() => setMenuOpen(false)}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
