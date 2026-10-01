import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { useScrollTop } from '@/hooks/useScrollTop'
import HomePage from '@/pages/home/HomePage'
import ShopPage from '@/pages/shop/ShopPage'
import ProductPage from '@/pages/product/ProductPage'
import SubscribePage from '@/pages/subscribe/SubscribePage'
import GiftingHubPage from '@/pages/gifting/GiftingHubPage'
import GiftBuilderPage from '@/pages/gifting/GiftBuilderPage'
import CorporateGiftingPage from '@/pages/gifting/CorporateGiftingPage'
import WholesalePage from '@/pages/wholesale/WholesalePage'
import OurStoryPage from '@/pages/story/OurStoryPage'
import JournalPage from '@/pages/journal/JournalPage'
import JournalArticlePage from '@/pages/journal/JournalArticlePage'
import ContactPage from '@/pages/contact/ContactPage'
import AccountPage from '@/pages/account/AccountPage'
import TrackOrderPage from '@/pages/account/TrackOrderPage'
import FaqPage from '@/pages/help/FaqPage'
import SearchPage from '@/pages/search/SearchPage'
import ComparePage from '@/pages/shop/ComparePage'
import GradesPage from '@/pages/grades/GradesPage'
import FlavoursPage from '@/pages/grades/FlavoursPage'
import QualityPage from '@/pages/company/QualityPage'
import { CareersPage, NotFoundPage, PressPage, SitemapPage, StoresPage, SustainabilityPage } from '@/pages/company/CompanyPages'
import PolicyPage from '@/pages/help/PolicyPage'
import CartPage from '@/pages/checkout/CartPage'
import DeliveryPage from '@/pages/checkout/DeliveryPage'
import PaymentPage from '@/pages/checkout/PaymentPage'
import ConfirmedPage from '@/pages/checkout/ConfirmedPage'
import StatesPage from '@/pages/dev/StatesPage'
import { Toaster } from '@/components/shared/Toaster'

export default function App() {
  useScrollTop()

  return (
    <>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:id" element={<ProductPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/gifting" element={<GiftingHubPage />} />
          <Route path="/gifting/build" element={<GiftBuilderPage />} />
          <Route path="/gifting/corporate" element={<CorporateGiftingPage />} />
          <Route path="/wholesale" element={<WholesalePage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:slug" element={<JournalArticlePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/policies/:slug" element={<PolicyPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/flavours" element={<FlavoursPage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/checkout" element={<Navigate to="/checkout/cart" replace />} />
        <Route path="/checkout/cart" element={<CartPage />} />
        <Route path="/checkout/delivery" element={<DeliveryPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
        <Route path="/order/confirmed" element={<ConfirmedPage />} />
        <Route path="/dev/states" element={<StatesPage />} />
      </Routes>
      <CartDrawer />
      <Toaster />
    </>
  )
}
