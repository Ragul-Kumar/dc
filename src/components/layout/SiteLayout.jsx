import { Outlet } from 'react-router-dom'
import { OfferBar } from './OfferBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { CompareBar } from './CompareBar'

export function SiteLayout() {
  return (
    <>
      <OfferBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
    </>
  )
}
