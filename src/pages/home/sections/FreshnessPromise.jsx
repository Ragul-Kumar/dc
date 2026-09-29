import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FreshnessPromise() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)

  const lookup = (e) => {
    e.preventDefault()
    if (!code.trim()) return
    // Placeholder until the batch API exists [confirm]
    setResult(
      /^D-\d{4}$/i.test(code.trim())
        ? `Batch ${code.toUpperCase()} · W240 · roasted 12 Sep · lab report passed`
        : 'We couldn’t find that code. It looks like D-0912.'
    )
  }

  return (
    <section className="bg-leaf">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-[88px]">
        <div className="flex flex-1 flex-col gap-2">
          <p className="eyebrow text-gold">FRESHNESS PROMISE</p>
          <p className="font-display text-[88px] leading-none text-ivory md:text-[120px]">7 days</p>
          <p className="max-w-[520px] text-base leading-relaxed text-sand md:text-body-l">
            From our roaster to your door. Every tin carries its roast date and batch code. [confirm real figure]
          </p>
        </div>

        <form onSubmit={lookup} className="flex w-full flex-col gap-4 rounded-card bg-ivory p-6 md:p-8 lg:w-[520px]">
          <h3 className="font-display text-[28px] font-semibold">Look up your batch</h3>
          <p className="text-[15px] leading-normal">
            Enter the code on your pack to see its roast date, grade and lab report.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. D-0912"
              aria-label="Batch code"
              className="h-[52px] font-mono text-sm"
            />
            <Button type="submit">Look up</Button>
          </div>
          {result && (
            <p className="font-mono text-[13px] text-leaf" role="status">
              {result}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
