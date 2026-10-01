import { Link, Navigate, useParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { PolicyBody } from './FaqPage'
import { POLICIES, getPolicy } from './policies'

// Figma 19 · Policy page template
export default function PolicyPage() {
  const { slug } = useParams()
  const policy = getPolicy(slug)
  if (!policy) return <Navigate to="/policies/shipping" replace />

  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[72px] lg:flex-row lg:gap-16">
      <nav aria-label="Policies" className="flex flex-col gap-1 lg:w-[260px] lg:shrink-0">
        <p className="mb-1 text-xs font-bold tracking-[0.12em] text-muted-foreground">POLICIES</p>
        {POLICIES.map((p) => (
          <Link
            key={p.slug}
            to={`/policies/${p.slug}`}
            aria-current={p.slug === slug ? 'page' : undefined}
            className={cn('rounded-lg px-4 py-3 text-[15px]', p.slug === slug ? 'bg-sand font-bold' : 'font-medium hover:bg-sand/60')}
          >
            {p.title}
          </Link>
        ))}
      </nav>
      <PolicyBody policy={policy} />
    </section>
  )
}
