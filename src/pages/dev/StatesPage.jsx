import {
  CodConfirm,
  OutOfStock,
  PaymentFailed,
  PincodeNotServiceable,
  UpiPending,
} from '@/components/checkout/states/CheckoutStates'
import { Icon } from '@/components/shared/Icon'
import { getProduct } from '@/data/products'

// Side-by-side render of Figma "16f · Checkout states" for design QA. Not linked from the site.
export default function StatesPage() {
  const noop = () => {}
  const line = { product: getProduct('w180-king-whole'), grams: 1000, qty: 1 }

  return (
    <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 pb-24 pt-20">
      <p className="eyebrow">CHECKOUT STATES</p>
      <h1 className="font-display text-[36px] font-semibold md:text-[48px]">New states the mockup does not cover</h1>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <State label="PAYMENT FAILED OR CANCELLED">
          <PaymentFailed amount={300} onRetry={noop} onAnother={noop} />
        </State>
        <State label="UPI PENDING">
          <UpiPending upiId="ragul@okhdfcbank" onApproved={noop} onSwitch={noop} />
        </State>
        <State label="COD CONFIRMATION">
          <CodConfirm mobile="+91 98410 xxxxx" onConfirm={noop} onCancel={noop} />
        </State>
        <State label="COUPON INVALID OR EXPIRED">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl font-semibold">Coupon</h3>
            <div className="flex h-12 items-center justify-between rounded-input border-[1.5px] border-error px-3.5">
              <span className="font-mono text-sm">PONGAL50</span>
              <span className="text-[13px] font-bold text-primary">Apply</span>
            </div>
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-error">
              <Icon name="alert-error" size={16} />
              PONGAL50 expired on 20 Jan. Discount removed.
            </p>
          </div>
        </State>
        <State label="ITEM OUT OF STOCK DURING CHECKOUT">
          <OutOfStock line={line} swap={{ grams: 500, price: 1079, qty: 2 }} onSwap={noop} onRemove={noop} />
        </State>
        <State label="PINCODE NOT SERVICEABLE">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl font-semibold">Delivery address</h3>
            <div className="flex h-12 items-center rounded-input border-[1.5px] border-error px-3.5 font-mono">794001</div>
            <PincodeNotServiceable pincode="794001" onChange={noop} />
          </div>
        </State>
      </div>
    </div>
  )
}

function State({ label, children }) {
  return (
    <div className="flex flex-col gap-3.5">
      <p className="font-mono text-xs text-primary">{label}</p>
      <div className="rounded-3xl border border-line bg-white p-7">{children}</div>
    </div>
  )
}
