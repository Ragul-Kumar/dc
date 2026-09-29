import { CheckoutHeader } from '@/components/layout/CheckoutHeader'
import { CheckoutStepper } from './CheckoutStepper'

// Two-column checkout shell: main column + 420px sticky summary
export function CheckoutLayout({ step, main, aside }) {
  return (
    <div className="min-h-screen bg-ivory">
      <CheckoutHeader />
      {step !== undefined && <CheckoutStepper current={step} />}
      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-6 pb-24 pt-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-6">{main}</div>
        <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-6 lg:w-[420px] lg:shrink-0">{aside}</aside>
      </div>
    </div>
  )
}

// White summary card with 24px radius, as in the Figma "Order summary (sticky)"
export function SummaryCard({ children }) {
  return <div className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 md:p-7">{children}</div>
}
