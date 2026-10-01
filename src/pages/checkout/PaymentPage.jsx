import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Icon } from '@/components/shared/Icon'
import { CheckoutLayout, SummaryCard } from '@/components/checkout/CheckoutLayout'
import { SummaryItems } from '@/components/checkout/SummaryItems'
import { PriceLines } from '@/components/checkout/PriceLines'
import { CodConfirm, PaymentFailed, UpiPending } from '@/components/checkout/states/CheckoutStates'
import { useCart } from '@/context/CartContext'
import { COD_LIMIT } from '@/data/products'
import { inr } from '@/lib/format'
import { cn } from '@/lib/utils'

const METHODS = [
  { id: 'upi', icon: 'upi', title: 'UPI', sub: 'Google Pay, PhonePe, Paytm, BHIM or any UPI app' },
  { id: 'card', icon: 'card', title: 'Credit / debit card', sub: 'Secure fields by Razorpay or Cashfree · saved cards are tokenised' },
  { id: 'netbanking', icon: 'bank', title: 'Netbanking', sub: 'All major Indian banks' },
  { id: 'wallet', icon: 'wallet', title: 'Wallets', sub: 'Paytm, Amazon Pay, Mobikwik' },
  { id: 'cod', icon: 'cash', title: 'Cash on Delivery', sub: `Pay in cash or UPI on delivery · up to ${inr(COD_LIMIT)} · ₹0 fee` },
]
const UPI_APPS = ['GPay', 'PhonePe', 'Paytm', 'BHIM']
const BANKS = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Indian Bank']
const WALLETS = ['Paytm', 'Amazon Pay', 'Mobikwik']

// Figma "16d · Checkout — Payment" (27:3458)
export default function PaymentPage() {
  const cart = useCart()
  const navigate = useNavigate()
  const { checkout, updateCheckout, lines, count, totals, coupon, address, placeOrder } = cart
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), []) // a pending payment must not fire after leaving the page
  const [upiVerified, setUpiVerified] = useState(false)
  const [bank, setBank] = useState('')
  const [modal, setModal] = useState(null) // 'upi' | 'cod' | 'failed' | 'processing'

  if (lines.length === 0) return <Navigate to="/checkout/cart" replace />
  if (!address) return <Navigate to="/checkout/delivery" replace />

  const method = checkout.payment
  const codBlocked = method === 'cod' && totals.total > COD_LIMIT
  const upiValid = /^[\w.-]+@\w+$/.test(checkout.upiId)
  const bill = checkout.billing
  const billingBad = !checkout.billingSame && (!bill.name.trim() || !/^\d{6}$/.test(bill.pincode) || !bill.line1.trim())
  const upiBlocked = method === 'upi' && !upiValid
  const setBill = (patch) => updateCheckout({ billing: { ...bill, ...patch } })

  const finish = (paidVia) => {
    placeOrder({
      id: `DC-${10000 + Math.floor(Math.random() * 90000)}`,
      lines,
      totals,
      coupon,
      count,
      address,
      gift: checkout.gift,
      whatsapp: checkout.whatsapp,
      mobile: checkout.mobile,
      paidVia,
      billing: checkout.billingSame ? null : checkout.billing,
      gst: checkout.gst.enabled ? checkout.gst : null,
      deliveryDate: checkout.deliveryDate || null,
      email: checkout.email || null,
      placedAt: new Date().toISOString(),
    })
    navigate('/order/confirmed')
  }

  const pay = () => {
    if (method === 'cod') return setModal('cod')
    if (method === 'upi') return setModal('upi')
    // Card / netbanking / wallet: the gateway handles it. Simulated here.
    setModal('processing')
    timer.current = setTimeout(() => finish(METHODS.find((m) => m.id === method).title), 1200)
  }

  const onUpiApproved = () => {
    // Demo: any UPI ID containing "fail" simulates a declined payment (16f state)
    if (/fail/i.test(checkout.upiId)) setModal('failed')
    else finish('UPI')
  }

  return (
    <>
    <CheckoutLayout
      step={2}
      main={
        <>
          <div className="flex items-center gap-3 rounded-2xl bg-sand px-5 py-3.5">
            <Icon name="pin-lg" size={18} />
            <p className="min-w-0 flex-1 text-sm font-medium">
              {count} {count === 1 ? 'item' : 'items'} · Deliver to {address.name.split(' ')[0]},{' '}
              {address.area}, {address.city} {address.pincode}
            </p>
            <Link to="/checkout/delivery" className="text-[13px] font-bold text-primary underline">
              Edit
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-[18px] pt-[18px]">
              <RadioGroup value={method} onValueChange={(v) => updateCheckout({ payment: v })} className="gap-[18px]">
                {METHODS.map((m) => {
                  const selected = method === m.id
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex flex-col gap-4 rounded-2xl p-[18px]',
                        selected ? 'border-[1.5px] border-roast bg-ivory' : 'border border-line bg-white'
                      )}
                    >
                      <label htmlFor={`pm-${m.id}`} className="flex cursor-pointer items-center gap-3.5">
                        <RadioGroupItem id={`pm-${m.id}`} value={m.id} className="size-[18px]" />
                        <Icon name={m.icon} size={22} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-bold">{m.title}</span>
                          <span className="block text-[13px] text-muted-foreground">{m.sub}</span>
                        </span>
                        {!selected && <Icon name="chev-right" size={18} />}
                      </label>

                      {selected && m.id === 'upi' && (
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                          <div className="hidden flex-col items-center gap-2 rounded-xl border border-line bg-white p-3 sm:flex">
                            <img src="/assets/icons/qr.svg" alt="UPI QR code" className="size-[126px]" />
                            <p className="text-[11px] font-medium text-muted-foreground">Scan with any UPI app</p>
                          </div>
                          <div className="flex flex-1 flex-col gap-3">
                            <Label htmlFor="upi-id">Or pay with UPI ID</Label>
                            <div className="flex h-12 items-center rounded-input border border-line bg-white pr-3.5">
                              <input
                                id="upi-id"
                                value={checkout.upiId}
                                onChange={(e) => {
                                  updateCheckout({ upiId: e.target.value.trim() })
                                  setUpiVerified(false)
                                }}
                                placeholder="yourname@okhdfcbank"
                                className="h-full min-w-0 flex-1 bg-transparent px-3.5 font-mono text-sm outline-none"
                              />
                              {upiVerified ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-success">
                                  <Icon name="check-green" size={14} /> Verified
                                </span>
                              ) : (
                                <button
                                  disabled={!upiValid}
                                  onClick={() => setUpiVerified(true)}
                                  className="text-[13px] font-bold text-primary disabled:opacity-40"
                                >
                                  Verify
                                </button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {UPI_APPS.map((a) => (
                                <button
                                  key={a}
                                  onClick={() => setModal('upi')}
                                  disabled={!upiValid}
                                  title={upiValid ? undefined : 'Enter your UPI ID first'}
                                  className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-bold hover:border-roast disabled:opacity-40"
                                >
                                  {a}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {selected && m.id === 'card' && (
                        <p className="rounded-xl bg-white p-4 text-[13px] text-muted-foreground">
                          You’ll enter card details in the gateway’s secure window after tapping Pay.
                        </p>
                      )}

                      {selected && (m.id === 'netbanking' || m.id === 'wallet') && (
                        <div className="flex flex-wrap gap-2">
                          {(m.id === 'netbanking' ? BANKS : WALLETS).map((b) => (
                            <button
                              key={b}
                              onClick={() => setBank(b)}
                              className={cn(
                                'rounded-full border px-3.5 py-2 text-xs font-bold',
                                bank === b ? 'border-roast bg-roast text-ivory' : 'border-line bg-white hover:border-roast'
                              )}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      )}

                      {selected && m.id === 'cod' && codBlocked && (
                        <p className="text-[13px] font-medium text-error">
                          COD is available up to {inr(COD_LIMIT)}. Please choose another method.
                        </p>
                      )}
                    </div>
                  )
                })}
              </RadioGroup>
              <p className="text-xs leading-normal text-muted-foreground">
                Durai never sees or stores your card number. Card details are handled by the payment gateway (RBI
                tokenisation).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing address</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-[18px] pt-[18px]">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="billing-same"
                  checked={checkout.billingSame}
                  onCheckedChange={(v) => updateCheckout({ billingSame: !!v })}
                  className="size-[18px]"
                />
                <Label htmlFor="billing-same" className="cursor-pointer text-sm font-medium">
                  Same as delivery address
                </Label>
              </div>
              {checkout.billingSame ? (
                <p className="text-sm text-muted-foreground">
                  {address.name} · {address.line1}, {address.area}, {address.city}, {address.state} {address.pincode}
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Full name" aria-label="Billing name" value={bill.name} onChange={(e) => setBill({ name: e.target.value })} />
                  <Input placeholder="Pincode" aria-label="Billing pincode" inputMode="numeric" className="font-mono" value={bill.pincode} onChange={(e) => setBill({ pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
                  <Input placeholder="Address" aria-label="Billing address" className="sm:col-span-2" value={bill.line1} onChange={(e) => setBill({ line1: e.target.value })} />
                </div>
              )}
            </CardContent>
          </Card>
        </>
      }
      aside={
        <SummaryCard>
          <h2 className="font-display text-2xl font-semibold">Price details</h2>
          <SummaryItems lines={lines} />
          <Separator />
          <PriceLines totals={totals} count={count} coupon={coupon} totalLabel="To pay" showSavings={false} />
          <Button
            variant="gold"
            className="h-14 w-full text-base text-night"
            onClick={pay}
            disabled={codBlocked || billingBad || upiBlocked || (method === 'netbanking' || method === 'wallet' ? !bank : false)}
          >
            <Icon name="lock-dark" size={16} />
            {method === 'cod'
              ? `Place order · Pay ${inr(totals.total)} on delivery`
              : `Pay ${inr(totals.total)} securely`}
          </Button>
          <div className="flex justify-center gap-1.5">
            {['UPI', 'RuPay', 'Visa', 'Mastercard'].map((p) => (
              <span key={p} className="rounded-md border border-line bg-white px-2 py-1 font-mono text-[11px]">
                {p}
              </span>
            ))}
          </div>
        </SummaryCard>
      }
    />

    <Dialog open={!!modal} onOpenChange={(open) => !open && modal !== 'processing' && setModal(null)}>
      <DialogContent hideClose={modal === 'processing'} className="max-w-[420px] p-7">
        <DialogTitle className="sr-only">Payment</DialogTitle>
        <DialogDescription className="sr-only">Complete your payment</DialogDescription>
        {modal === 'upi' && (
          <UpiPending
            upiId={checkout.upiId}
            onApproved={onUpiApproved}
            onSwitch={() => setModal(null)}
            onExpire={() => setModal('failed')}
          />
        )}
        {modal === 'cod' && (
          <CodConfirm mobile={checkout.mobile} onConfirm={() => finish('Cash on Delivery')} onCancel={() => setModal(null)} />
        )}
        {modal === 'failed' && (
          <PaymentFailed amount={totals.total} onRetry={pay} onAnother={() => setModal(null)} />
        )}
        {modal === 'processing' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="size-10 animate-spin rounded-full border-4 border-sand border-t-primary" />
            <p className="font-display text-xl font-semibold">Connecting to your bank…</p>
            <p className="text-sm text-muted-foreground">Don’t close this window.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
