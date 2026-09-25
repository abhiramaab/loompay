import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { LoomPayLogo, LoomPayMark } from '@/brand/Logo'
import { MarketingNav } from '@/components/MarketingNav'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/Reveal'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { useAuth } from '@/hooks/useAuth'
import { BUILD_CAPABILITIES, COMPLIANCES, FOOTER_COLUMNS, SOLUTIONS } from '@/lib/site'
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  ExternalIcon,
  LayersIcon,
  ShieldIcon,
} from '@/components/Icons'
import { cn } from '@/lib/utils'

export function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div id="top" className="min-h-screen bg-ink-950">
      <MarketingNav authed={isAuthenticated} />
      <Hero authed={isAuthenticated} />
      <LogoBand />
      <DeployYourWay />
      <TrustEngineered />
      <SolutionsSection />
      <IndustriesSection />
      <DeveloperFirst />
      <BuildAndScale />
      <PricingSection />
      <ResourcesSection />
      <CTASection authed={isAuthenticated} />
      <Footer />
    </div>
  )
}

/* ------------------------------------------------------------------ Hero */

function Hero({ authed }: { authed: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94])

  return (
    <section ref={ref} className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <motion.div
        style={{ y, opacity, scale }}
        className="relative mx-auto w-full max-w-[1200px] px-5 sm:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-ink-700 bg-ink-850 px-3.5 py-1.5 shadow-card"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-pulse-ring rounded-full bg-brand-500" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          <span className="text-xs font-medium text-mist-400">
            Open source · Composable · Full-stack payment orchestration
          </span>
        </motion.div>

        <h1 className="mx-auto mt-7 max-w-4xl text-center font-display text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-mist-100 sm:text-6xl lg:text-[4.2rem]">
          {['Composable,', 'Open Source Payments.'].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {i === 1 ? (
                <span className="text-gradient">Open Source Payments.</span>
              ) : (
                line
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto mt-7 max-w-2xl text-center text-base leading-relaxed text-mist-400 sm:text-lg"
        >
          Build or enhance your payments stack while keeping control — with an open-source,
          full-stack, modular infrastructure. Idempotent writes, distributed locks, and a
          double-entry ledger, in one control plane.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link to={authed ? '/dashboard' : '/login'} className="btn-primary w-full sm:w-auto">
            {authed ? 'Open the console' : 'Get started'}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <a href="#open-source" className="btn-ghost w-full sm:w-auto">
            Deploy open source
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <HeroConsole />
        </motion.div>
      </motion.div>
    </section>
  )
}

function HeroConsole() {
  const rows = [
    { id: 'ord_7f2a91c4', merchant: 'merchant_nova', amount: '₹1,50,000', status: 'SUCCESS', tone: 'mint' },
    { id: 'ord_2b8e04dd', merchant: 'merchant_atlas', amount: '$2,500.00', status: 'PROCESSING', tone: 'brand' },
    { id: 'ord_9c1d55a0', merchant: 'merchant_orbit', amount: '€980.00', status: 'CREATED', tone: 'neutral' },
  ]

  return (
    <div className="card overflow-hidden !rounded-3xl shadow-lift">
      <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-850 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rosex-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amberx-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint-400" />
        <div className="ml-3 flex-1 rounded-md bg-ink-750 px-3 py-1 text-center font-mono text-2xs text-mist-500">
          console.loompay.io/payments
        </div>
      </div>

      <div className="grid gap-4 bg-ink-900 p-4 sm:grid-cols-3 sm:p-5">
        {[
          { label: 'Volume settled', value: 124800000, fmt: 'inr', tone: 'text-mint-500' },
          { label: 'Processing', value: 3, fmt: 'int', tone: 'text-brand-500' },
          { label: 'Success rate', value: 99.4, fmt: 'pct', tone: 'text-mist-100' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.12 }}
            className="rounded-2xl border border-ink-700 bg-ink-800 p-4"
          >
            <p className="text-2xs uppercase tracking-wider text-mist-500">{m.label}</p>
            <p className={cn('mt-1.5 font-display text-xl font-bold', m.tone)}>
              <AnimatedNumber
                value={m.value}
                format={(v) =>
                  m.fmt === 'inr'
                    ? `₹${(v / 100000).toFixed(1)}L`
                    : m.fmt === 'pct'
                      ? `${v.toFixed(1)}%`
                      : String(Math.round(v))
                }
              />
            </p>
          </motion.div>
        ))}

        <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-800 sm:col-span-3">
          {rows.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.15 + i * 0.12 }}
              className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-ink-700/70 px-4 py-3 last:border-0 sm:grid-cols-3"
            >
              <span className="font-mono text-xs text-mist-300">{r.id}</span>
              <span className="hidden text-xs text-mist-500 sm:block">{r.merchant}</span>
              <div className="flex items-center justify-end gap-3">
                <span className="font-mono text-xs text-mist-100">{r.amount}</span>
                <span
                  className={cn(
                    'chip',
                    r.tone === 'mint'
                      ? 'border-mint-500/30 bg-mint-500/10 text-mint-500'
                      : r.tone === 'brand'
                        ? 'border-brand-500/30 bg-brand-500/10 text-brand-600'
                        : 'border-ink-600 bg-ink-750 text-mist-400',
                  )}
                >
                  {r.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- Logo band */

function LogoBand() {
  const companies = ['Northwind', 'Atlas', 'Vertex', 'Lumen', 'Kepler', 'Meridian', 'Reload', 'Narvar']
  return (
    <section className="border-y border-ink-700/60 bg-ink-900 py-10">
      <p className="text-center text-2xs font-medium uppercase tracking-[0.2em] text-mist-500">
        Trusted by the fastest growing businesses globally
      </p>
      <div className="relative mt-6 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-14 px-7">
          {[...companies, ...companies].map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="whitespace-nowrap font-display text-xl font-semibold tracking-tight text-mist-600"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-900 to-transparent" />
      </div>
    </section>
  )
}

/* ------------------------------------------------------- Deploy your way */

function DeployYourWay() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">Deployment</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Maintain control. Deploy your way.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
          Deploy anywhere — cloud or on-prem — and self-manage the infrastructure, or use a
          fully managed service with out-of-the-box compliance and enterprise SLAs.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {[
          {
            title: 'Self-host (on-prem / cloud)',
            body: 'Run the orchestrator, ledger, and outbox publisher on your own infrastructure. Inspect every line and own your data.',
            points: ['Docker-compose local setup', 'Postgres + Redis backing', 'No vendor lock-in'],
            icon: LayersIcon,
          },
          {
            title: 'Hosted by LoomPay',
            body: 'Consume the engine as APIs and SDKs with managed infrastructure, compliance, and enterprise-grade SLAs.',
            points: ['Managed Postgres + Redis', '99.99% uptime target', 'Support and upgrades included'],
            icon: BoltIcon,
          },
        ].map((card, i) => (
          <Reveal key={card.title} delay={i * 0.12}>
            <div className="card card-hover flex h-full flex-col p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-500">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-mist-100">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-400">{card.body}</p>
              <ul className="mt-5 space-y-2.5">
                {card.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-mist-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-500/15 text-mint-500">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------- Trust engineered */

function TrustEngineered() {
  const stats = [
    { value: '100%', label: 'Open source' },
    { value: '99.99', label: 'Uptime target', suffix: '%' },
    { value: '2000', label: 'TPS traffic spike' },
    { value: '3', label: 'PSP/acquirer rails' },
  ]
  return (
    <section id="open-source" className="border-y border-ink-700/60 bg-ink-900 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="label">Trust engineered</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
            Trust engineered in every line of code
          </h2>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="card h-full p-6 text-left">
                <p className="font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-4xl">
                  {s.value}
                  {s.suffix && <span className="text-brand-500">{s.suffix}</span>}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-mist-500">
                  {s.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-mist-500">
              Globally compliant
            </span>
            {COMPLIANCES.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-3.5 py-2"
              >
                <ShieldIcon className="h-4 w-4 text-brand-500" />
                <span className="text-xs font-semibold text-mist-200">{c.label}</span>
                <span className="text-2xs text-mist-500">{c.sub}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Solutions */

function SolutionsSection() {
  return (
    <section id="solutions" className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">Modular solutions</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Independent, open source and composable payments
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
          Engineered to put control back in your hands. Pick the modules you need — plug and
          play — and compose the rest around them.
        </p>
      </Reveal>

      <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2">
        {SOLUTIONS.map((s, i) => (
          <StaggerItem key={s.id} className={i === 0 ? 'md:col-span-2' : ''}>
            <article
              id={s.id}
              className={cn(
                'card card-hover group flex h-full flex-col p-7',
                i === 0 && 'md:flex-row md:items-center md:gap-10',
              )}
            >
              <div className={cn(i === 0 && 'md:flex-1')}>
                <span className="label">{s.eyebrow}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-mist-100">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-mist-400">{s.body}</p>
                <a
                  href="#developers"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-500 transition-colors hover:text-brand-600"
                >
                  {s.link}
                  <ExternalIcon className="h-3.5 w-3.5" />
                </a>
              </div>
              <div
                className={cn(
                  'mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-500/25 bg-brand-500/10 text-brand-500',
                  i === 0 && 'md:mt-0 md:h-24 md:w-24',
                )}
              >
                <s.icon className={cn('h-6 w-6', i === 0 && 'md:h-10 md:w-10')} />
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}

/* ------------------------------------------------------------ Industries */

function IndustriesSection() {
  const industries = [
    {
      id: 'industry-isf',
      name: 'Infrastructure, SaaS & Fintech',
      body: 'Banking-grade compliance at developer speed. Ship subscription billing, usage metering, and payouts on one ledger.',
      icon: LayersIcon,
      stat: 'PCI DSS · SOC 2',
    },
    {
      id: 'industry-banks',
      name: 'Banks',
      body: 'Ledger-grade primitives for regulated entities, with immutable journal entries and deterministic reconciliation.',
      icon: ShieldIcon,
      stat: 'On-prem deployable',
    },
    {
      id: 'industry-airlines',
      name: 'Airlines',
      body: 'High-volume authorization and settlement, with rate protection and consistent routing across acquirer rails.',
      icon: BoltIcon,
      stat: '2000 TPS spikes',
    },
  ]

  return (
    <section id="industries" className="border-y border-ink-700/60 bg-ink-900 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="label">Industries</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
            Powering payments across industries
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
            From banking-grade compliance to airline-scale volumes, LoomPay adapts to the rules
            your industry plays by.
          </p>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {industries.map((ind) => (
            <StaggerItem key={ind.id}>
              <article id={ind.id} className="card card-hover flex h-full flex-col p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-500">
                  <ind.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-mist-100">
                  {ind.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-400">{ind.body}</p>
                <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-ink-600 bg-ink-750 px-3 py-1 text-2xs font-medium text-mist-400">
                  <CheckIcon className="h-3 w-3 text-mint-500" />
                  {ind.stat}
                </span>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- Developer first */

function DeveloperFirst() {
  const code = `POST /api/v1/payments
X-Merchant-Id: merchant_123

{
  "merchantId": "merchant_123",
  "amount": 150000,
  "currency": "INR",
  "idempotencyKey": "idem_9f2c1a7b3d4e5f60"
}`

  return (
    <section id="developers" className="border-y border-ink-700/60 bg-ink-900 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="label">Developer first</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
            Everything you need for whatever you build
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
            Developer-first APIs to build a scalable payments stack from the ground up using
            the modules of your choice. Plug and play.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal delay={0.1}>
            <div className="card overflow-hidden !rounded-2xl shadow-lift">
              <div className="flex items-center justify-between border-b border-ink-700 bg-ink-850 px-4 py-3">
                <span className="font-mono text-2xs text-mist-500">request</span>
                <span className="chip border-brand-500/30 bg-brand-500/10 text-brand-600">
                  idempotent
                </span>
              </div>
              <pre className="overflow-x-auto bg-ink-800 px-5 py-5 font-mono text-xs leading-relaxed text-mist-300">
                {code}
              </pre>
              <div className="flex items-center justify-between border-t border-ink-700 bg-ink-850 px-4 py-3">
                <span className="font-mono text-2xs text-mist-500">201 Created</span>
                <span className="font-mono text-2xs text-mint-500">ord_020761b0c3ef</span>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap gap-2">
              {[
                'REST',
                'Idempotency-Key',
                'HTTP 429',
                'Outbox events',
                'Signed webhooks',
                'Docker',
                'Postgres',
                'Redis',
              ].map((tag) => (
                <span key={tag} className="chip border-ink-600 bg-ink-850 text-mist-400">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-6 text-base leading-relaxed text-mist-400">
              Predictable REST semantics, explicit state transitions, and idempotency keys that
              make retries safe by construction. Ship an integration in an afternoon.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="btn-primary">
                Get API access
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a href="#open-source" className="btn-ghost">
                Read the docs
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- Build and scale */

function BuildAndScale() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -7, 7]), {
    stiffness: 80,
    damping: 20,
  })

  const nodes = [
    { label: 'API Gateway', x: '12%', y: '18%' },
    { label: 'Idempotency', x: '50%', y: '8%' },
    { label: 'Rate Limiter', x: '88%', y: '18%' },
    { label: 'Lock Manager', x: '22%', y: '52%' },
    { label: 'Ledger', x: '50%', y: '44%' },
    { label: 'Outbox', x: '78%', y: '52%' },
    { label: 'Reconciler', x: '50%', y: '84%' },
  ]
  const connections: [number, number][] = [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 4],
    [2, 5],
    [3, 4],
    [4, 5],
    [5, 6],
    [3, 6],
  ]

  return (
    <section id="architecture" className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">Build &amp; scale</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Build and scale your payment strategy
        </h2>
      </Reveal>

      <div className="mt-14 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-5">
          {BUILD_CAPABILITIES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 font-display text-sm font-bold text-brand-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {i < BUILD_CAPABILITIES.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-ink-700" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-display text-lg font-semibold text-mist-100">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-400">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <motion.div
          ref={ref}
          style={{ rotateX: rotate, transformPerspective: 1200 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="card relative aspect-[16/12] overflow-hidden !rounded-3xl bg-ink-900 shadow-lift lg:aspect-[16/13]"
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(0,122,255,0.14) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {connections.map(([a, b], i) => (
              <motion.line
                key={`${a}-${b}`}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                stroke="#007AFF"
                strokeOpacity="0.22"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
              />
            ))}
          </svg>
          {nodes.map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
              style={{ left: n.x, top: n.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-850 px-3.5 py-2 shadow-card">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                <span className="whitespace-nowrap text-xs font-medium text-mist-200">
                  {n.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Pricing */

function PricingSection() {
  const tiers = [
    {
      name: 'Open Source',
      price: 'Free',
      period: 'forever',
      body: 'Self-host the full engine and own your infrastructure.',
      points: ['Unlimited orders', 'Double-entry ledger', 'Redis locks & rate limits', 'Community support'],
      cta: 'Deploy open source',
      primary: false,
    },
    {
      name: 'Growth',
      price: '$0.04',
      period: 'per transaction',
      body: 'Managed infrastructure with compliance and SLAs.',
      points: ['Managed Postgres + Redis', '99.99% uptime SLA', 'Webhook retries & outbox', 'Priority support'],
      cta: 'Get started',
      primary: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: "let's talk",
      body: 'For regulated entities and high-volume processors.',
      points: ['PCI DSS & SOC 2 reports', 'Dedicated infrastructure', 'On-prem or private cloud', 'Named solutions team'],
      cta: 'Contact sales',
      primary: false,
    },
  ]

  return (
    <section id="pricing" className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">Pricing</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Start free. Scale when you do.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
          Transparent pricing with no lock-in. Self-host for free, or let us run the
          infrastructure for you.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.1}>
            <div
              className={cn(
                'card relative flex h-full flex-col p-7',
                tier.primary && 'border-brand-500/40 shadow-glow',
              )}
            >
              {tier.primary && (
                <span className="absolute -top-3 left-7 rounded-full border border-brand-500/30 bg-brand-soft px-3 py-1 text-2xs font-semibold text-brand-600">
                  Most popular
                </span>
              )}
              <p className="font-display text-lg font-semibold text-mist-100">{tier.name}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tracking-tight text-mist-100">
                  {tier.price}
                </span>
                <span className="text-xs text-mist-500">{tier.period}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mist-400">{tier.body}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-mist-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-500/15 text-mint-500">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className={cn('mt-7 w-full', tier.primary ? 'btn-primary' : 'btn-ghost')}
              >
                {tier.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- Resources */

function ResourcesSection() {
  const items = [
    {
      tag: 'Blog',
      title: 'Designing idempotency that survives concurrent retries',
      read: '6 min read',
    },
    {
      tag: 'Case study',
      title: 'How a marketplace cut duplicate charges to zero',
      read: '4 min read',
    },
    {
      tag: 'Release notes',
      title: 'Transactional outbox and the reconciliation worker',
      read: '3 min read',
    },
  ]
  return (
    <section id="resources" className="border-y border-ink-700/60 bg-ink-900 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="label">Resources</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
            Learn how teams ship on LoomPay
          </h2>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <article className="card card-hover group flex h-full flex-col p-6">
                <span className="chip w-fit border-brand-500/25 bg-brand-500/10 text-brand-600">
                  {item.tag}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-mist-100">
                  {item.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-6 text-xs text-mist-500">
                  <span>{item.read}</span>
                  <ExternalIcon className="h-4 w-4 text-mist-600 transition-colors group-hover:text-brand-500" />
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- CTA */

function CTASection({ authed }: { authed: boolean }) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-500/20 bg-brand-soft px-8 py-16 text-center shadow-lift sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-cyanx-400/10 blur-3xl" />
          <div className="relative">
            <LoomPayMark size={52} className="mx-auto" />
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.5rem] sm:leading-[1.1]">
              Start orchestrating payments today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-mist-400">
              Spin up the engine, create your first order, and watch it flow through the
              lifecycle — no credit card required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={authed ? '/dashboard' : '/login'} className="btn-primary w-full sm:w-auto">
                {authed ? 'Open the console' : 'Create your account'}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a href="#open-source" className="btn-ghost w-full sm:w-auto">
                Explore the product
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------- Footer */

function Footer() {
  const columns = FOOTER_COLUMNS
  return (
    <footer className="border-t border-ink-700/70 bg-ink-900">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <LoomPayLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-500">
              Open-source payment orchestration with a double-entry ledger, built for teams
              that move real money.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {COMPLIANCES.slice(0, 3).map((c) => (
                <span
                  key={c.label}
                  className="rounded-lg border border-ink-700 bg-ink-850 px-2.5 py-1 text-2xs font-medium text-mist-500"
                >
                  {c.label}
                </span>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-mist-300">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-mist-500 transition-colors hover:text-brand-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 border-t border-ink-700/70 pt-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex flex-wrap items-center gap-5 text-xs text-mist-500">
            <span>© {new Date().getFullYear()} LoomPay. All rights reserved.</span>
            <a href="#top" className="transition-colors hover:text-brand-500">
              Privacy Policy
            </a>
            <a href="#top" className="transition-colors hover:text-brand-500">
              Terms of Use
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-mist-500">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
