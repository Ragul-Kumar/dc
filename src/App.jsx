import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { useScrollTop } from '@/hooks/useScrollTop'
import HomePage from '@/pages/home/HomePage'
import CartPage from '@/pages/checkout/CartPage'
import DeliveryPage from '@/pages/checkout/DeliveryPage'
import PaymentPage from '@/pages/checkout/PaymentPage'
import ConfirmedPage from '@/pages/checkout/ConfirmedPage'
import StatesPage from '@/pages/dev/StatesPage'

export default function App() {
  useScrollTop()

  return (
    <>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/checkout" element={<Navigate to="/checkout/cart" replace />} />
        <Route path="/checkout/cart" element={<CartPage />} />
        <Route path="/checkout/delivery" element={<DeliveryPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
        <Route path="/order/confirmed" element={<ConfirmedPage />} />
        <Route path="/dev/states" element={<StatesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CartDrawer />
    </>
  )
}
