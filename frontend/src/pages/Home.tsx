import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { LoomPayLogo } from '@/brand/Logo'
import { MarketingNav } from '@/components/MarketingNav'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/Reveal'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { useAuth } from '@/hooks/useAuth'
import {
  ADAPTER_INTERFACE,
  ARCHITECTURE_LAYERS,
  CAPABILITIES,
  FAILOVER_STEPS,
  FLOW_DIAGRAM,
  FLOW_STEPS,
  FOOTER_LINKS,
  LIFECYCLE_STATES,
  LIFECYCLE_TRANSITIONS,
  PROBLEMS,
  RELIABILITY_FEATURES,
  ROUTING_DEMO,
  ROUTING_PARAMETERS,
  ROUTING_RULES,
  SECURITY_ITEMS,
  SITE,
  TECH_STACK,
  TERMINAL_STATES,
  USE_CASES,
} from '@/lib/site'
import { ArrowRightIcon, CheckIcon, ExternalIcon } from '@/components/Icons'
import { cn } from '@/lib/utils'

export function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div id="top" className="min-h-screen bg-ink-950">
      <MarketingNav authed={isAuthenticated} />
      <Hero />
      <ProblemSection />
      <CapabilitiesSection />
      <FlowSection />
      <RoutingSection />
      <AdapterSection />
      <LifecycleSection />
      <DeveloperSection />
      <ArchitectureSection />
      <ReliabilitySection />
      <ObservabilitySection />
      <SecuritySection />
      <UseCasesSection />
      <CTASection authed={isAuthenticated} />
      <Footer />
    </div>
  )
}

/* ------------------------------------------------------------------ Hero */

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto w-full max-w-[1200px] px-5 sm:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center font-mono text-2xs font-medium uppercase tracking-[0.22em] text-brand-500"
        >
          Payment orchestration infrastructure
        </motion.p>

        <h1 className="mx-auto mt-5 max-w-4xl text-center font-display text-[2.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-mist-100 sm:text-6xl lg:text-[4rem]">
          <motion.span
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            One payment integration.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="block text-gradient"
          >
            Every provider under control.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="mx-auto mt-7 max-w-2xl text-center text-base leading-relaxed text-mist-400 sm:text-lg"
        >
          LoomPay is a payment orchestration layer that connects your application to multiple
          payment providers through a unified API — with routing, idempotent writes, and complete
          transaction visibility.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.46 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a href={SITE.docs} className="btn-primary w-full sm:w-auto">
            Explore documentation
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost w-full sm:w-auto"
          >
            View on GitHub
            <ExternalIcon className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-center font-mono text-2xs tracking-wide text-mist-500"
        >
          Unified API · Idempotency · Partition Routing · Ledger · Observability
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <OrchestrationDiagram />
        </motion.div>
      </motion.div>
    </section>
  )
}

/**
 * Hero visual: the request path through the orchestration layer to providers.
 * Deliberately schematic — labels match real components in the codebase.
 */
function OrchestrationDiagram() {
  const providers = ['Provider A', 'Provider B', 'Provider C']
  const labels = [
    { text: 'Route', x: '30%' },
    { text: 'Retry', x: '50%' },
    { text: 'Failover', x: '70%' },
    { text: 'Monitor', x: '88%' },
  ]

  return (
    <div className="card relative overflow-hidden !rounded-3xl p-6 shadow-lift sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-brand-soft opacity-40" />
      <svg viewBox="0 0 900 360" className="relative h-auto w-full" role="img" aria-label="LoomPay orchestration architecture">
        <defs>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#007aff" />
            <stop offset="1" stopColor="#5ac8fa" />
          </linearGradient>
          <marker id="hero-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#007aff" />
          </marker>
        </defs>

        {/* Application node */}
        <motion.g
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <rect x="360" y="6" width="180" height="40" rx="10" className="fill-ink-800" stroke="#d5d6de" />
          <text x="450" y="31" textAnchor="middle" className="fill-mist-100 font-mono" style={{ fontSize: 12 }}>
            Application
          </text>
        </motion.g>

        {/* Request flow arrow */}
        <motion.line
          x1="450"
          y1="46"
          x2="450"
          y2="92"
          stroke="url(#hero-line)"
          strokeWidth="2"
          markerEnd="url(#hero-arrow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        />

        {/* LoomPay layer */}
        <motion.g
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.95 }}
        >
          <rect x="250" y="94" width="400" height="76" rx="14" className="fill-brand-500" />
          <text x="450" y="123" textAnchor="middle" className="fill-white font-display" style={{ fontSize: 17, fontWeight: 700 }}>
            LoomPay
          </text>
          <text x="450" y="145" textAnchor="middle" className="fill-white/75 font-mono" style={{ fontSize: 10, letterSpacing: '0.14em' }}>
            ORCHESTRATION LAYER
          </text>
        </motion.g>

        {/* Fan-out lines */}
        {[150, 450, 750].map((cx, i) => (
          <motion.path
            key={cx}
            d={`M450 170 C450 205, ${cx} 200, ${cx} 232`}
            fill="none"
            stroke="#007aff"
            strokeOpacity="0.4"
            strokeWidth="1.5"
            markerEnd="url(#hero-arrow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
          />
        ))}

        {/* Provider nodes */}
        {providers.map((p, i) => {
          const cx = [150, 450, 750][i]
          return (
            <motion.g
              key={p}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.35 + i * 0.1 }}
            >
              <rect x={cx - 85} y="234" width="170" height="48" rx="10" className="fill-ink-800" stroke="#d5d6de" />
              <circle cx={cx - 65} cy="258" r="4" fill="#007aff" />
              <text x={cx + 4} y="262" textAnchor="middle" className="fill-mist-200 font-mono" style={{ fontSize: 11 }}>
                {p}
              </text>
              <text x={cx} y="306" textAnchor="middle" className="fill-mist-500 font-mono" style={{ fontSize: 9, letterSpacing: '0.12em' }}>
                PAYMENTS
              </text>
            </motion.g>
          )
        })}
      </svg>

      {/* Small operational labels */}
      <div className="relative mt-2 hidden grid-cols-4 gap-2 sm:grid">
        {labels.map((l, i) => (
          <motion.div
            key={l.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 + i * 0.1 }}
            className="rounded-lg border border-ink-700 bg-ink-800 px-3 py-2 text-center"
          >
            <span className="font-mono text-2xs uppercase tracking-wider text-mist-400">
              {l.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- Problem */

function ProblemSection() {
  return (
    <section className="border-t border-ink-700/60 bg-ink-900 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="label">The problem</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
            Payments get complicated when you add more providers.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
            Integrating a single payment provider is straightforward. Operating several of them is
            not.
          </p>
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-700 bg-ink-700 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => (
            <StaggerItem key={p.title} className="bg-ink-850">
              <div className="h-full p-6">
                <span className="font-mono text-2xs text-mist-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-mist-100">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400">{p.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center font-display text-lg font-medium text-mist-300">
            LoomPay puts that complexity behind one orchestration layer.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- Capabilities */

function CapabilitiesSection() {
  return (
    <section id="orchestration" className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">What LoomPay does</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Your payment stack, behind one API.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
          Integrate once. Connect multiple providers. Control how every transaction flows.
        </p>
      </Reveal>

      <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((cap) => (
          <StaggerItem key={cap.id}>
            <article className="card card-hover flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-mist-100">{cap.title}</h3>
                {cap.roadmap && (
                  <span className="chip shrink-0 border-amberx-500/30 bg-amberx-500/10 text-amberx-500">
                    Roadmap
                  </span>
                )}
              </div>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-mist-400">{cap.body}</p>
              <p className="mt-5 font-mono text-2xs text-mist-500">{cap.detail}</p>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}

/* ------------------------------------------------------------------ Flow */

function FlowSection() {
  return (
    <section className="border-t border-ink-700/60 bg-ink-900 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="label">How it works</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
            From payment request to recorded transaction.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-ink-700 bg-ink-700">
            {FLOW_STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.05}>
                <div className="flex gap-5 bg-ink-850 p-6">
                  <span className="font-display text-2xl font-bold text-brand-500">{step.step}</span>
                  <div>
                    <p className="font-mono text-2xs uppercase tracking-[0.16em] text-mist-300">
                      {step.key}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist-400">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <FlowDiagram />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function FlowDiagram() {
  return (
    <div className="card sticky top-24 p-6">
      <p className="label mb-5">Request path</p>
      <div className="flex flex-col">
        {FLOW_DIAGRAM.map((node, i) => (
          <div key={node} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.09 }}
              className="w-full rounded-xl border border-ink-700 bg-ink-800 px-4 py-3 text-center"
            >
              <span className="font-mono text-xs text-mist-200">{node}</span>
            </motion.div>
            {i < FLOW_DIAGRAM.length - 1 && (
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.09 + 0.05 }}
                className="my-1 h-5 w-px origin-top bg-brand-500/50"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- Routing */

function RoutingSection() {
  return (
    <section id="routing" className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">Routing</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Control how payments are routed.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
          LoomPay assigns traffic deterministically so partitions stay balanced and rehashing stays
          cheap when the ring changes.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <HashRingVisual />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card flex h-full flex-col p-6">
            <p className="label">Routing inputs</p>
            <ul className="mt-4 space-y-3">
              {ROUTING_PARAMETERS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-mist-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <p className="label mt-7">Behaviour</p>
            <ul className="mt-4 space-y-2">
              {ROUTING_RULES.map((r) => (
                <li key={r} className="font-mono text-2xs leading-relaxed text-mist-500">
                  · {r}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="card mt-6 p-6">
          <div className="flex items-center justify-between">
            <p className="label">Partition distribution</p>
            <span className="chip border-amberx-500/30 bg-amberx-500/10 text-amberx-500">
              demo data
            </span>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {ROUTING_DEMO.map((m, i) => (
              <div key={m.label}>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium text-mist-300">{m.label}</span>
                  <span className="font-mono text-xs text-mist-200">{m.value}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-750">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.value}%` }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyanx-400"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-2xs text-mist-500">
            Illustrative values for layout only — not live production metrics.
          </p>
        </div>
      </Reveal>
    </section>
  )
}

function HashRingVisual() {
  const reduce = useReducedMotion()
  const nodes = [0, 60, 130, 205, 275, 330]
  return (
    <div className="card h-full p-6">
      <p className="label">Consistent hash ring</p>
      <div className="mt-4 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48" role="img" aria-label="Hash ring">
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#007aff" />
              <stop offset="1" stopColor="#5ac8fa" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="72" fill="none" stroke="#e5e6ec" strokeWidth="1.5" />
          {!reduce &&
            nodes.map((deg, i) => (
              <motion.circle
                key={deg}
                cx={100 + 72 * Math.cos((deg * Math.PI) / 180)}
                cy={100 + 72 * Math.sin((deg * Math.PI) / 180)}
                r="6"
                fill="#007aff"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
              />
            ))}
          <motion.circle
            cx="100"
            cy="100"
            r="30"
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="2"
            strokeDasharray="6 6"
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '100px 100px' }}
          />
          <text x="100" y="96" textAnchor="middle" className="fill-mist-400 font-mono" style={{ fontSize: 9 }}>
            merchant key
          </text>
          <text x="100" y="108" textAnchor="middle" className="fill-brand-500 font-mono" style={{ fontSize: 9 }}>
            → partition
          </text>
        </svg>

        <div className="space-y-3">
          {[
            { k: 'hash(key) & MAX_VALUE', v: 'ring position' },
            { k: 'tailMap(pos).firstKey()', v: 'target node' },
            { k: 'virtual nodes', v: 'even distribution' },
            { k: 'node change', v: 'minimal rehash' },
          ].map((row) => (
            <div
              key={row.k}
              className="flex flex-col gap-0.5 rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-mono text-2xs text-mist-300">{row.k}</span>
              <span className="font-mono text-2xs text-mist-500">{row.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- Adapters */

function AdapterSection() {
  return (
    <section className="border-t border-ink-700/60 bg-ink-900 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <p className="label">Provider adapters</p>
              <span className="chip border-amberx-500/30 bg-amberx-500/10 text-amberx-500">
                interface defined · roadmap
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
              Add providers without rewriting your payment layer.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mist-400">
              Each payment provider speaks a different API. LoomPay normalizes those differences
              behind a common orchestration layer.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mist-500">
              Provider adapters isolate gateway-specific authentication, request formats, response
              mapping, and webhook handling from the rest of the application. The interface is
              defined; concrete gateway adapters are on the roadmap.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card overflow-hidden !rounded-2xl">
              <div className="border-b border-ink-700 bg-ink-850 px-5 py-3">
                <span className="font-mono text-2xs uppercase tracking-wider text-mist-500">
                  loompay core → ProviderAdapter
                </span>
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  {ADAPTER_INTERFACE.map((m) => (
                    <div
                      key={m.method}
                      className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-850 px-4 py-2.5"
                    >
                      <span className="font-mono text-xs text-brand-500">{m.method}()</span>
                      <span className="text-2xs text-mist-500">{m.note}</span>
                    </div>
                  ))}
                </div>
                <div className="my-4 h-px bg-ink-700" />
                <div className="grid grid-cols-2 gap-2">
                  {['Provider A', 'Provider B', 'Provider C', 'Add your own'].map((p, i) => (
                    <motion.div
                      key={p}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className={cn(
                        'rounded-lg border px-3 py-2.5 text-center font-mono text-2xs',
                        p === 'Add your own'
                          ? 'border-dashed border-brand-500/40 text-brand-500'
                          : 'border-ink-700 bg-ink-850 text-mist-300',
                      )}
                    >
                      {p}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Lifecycle */

function LifecycleSection() {
  return (
    <section id="lifecycle" className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">Transaction lifecycle</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Every payment has a traceable lifecycle.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
          LoomPay maintains a normalized transaction lifecycle so provider-specific responses can be
          represented through a consistent payment state model.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-6">
            <p className="label mb-5">Happy path</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              {LIFECYCLE_STATES.map((state, i) => (
                <div key={state} className="flex flex-1 items-center gap-3">
                  <div className="flex-1 rounded-xl border border-ink-700 bg-ink-850 px-4 py-3 text-center">
                    <span className="font-mono text-xs font-semibold text-mist-100">{state}</span>
                  </div>
                  {i < 2 && (
                    <ArrowRightIcon className="hidden h-4 w-4 shrink-0 text-mist-600 sm:block" />
                  )}
                </div>
              ))}
            </div>

            <p className="label mb-5 mt-8">Transitions</p>
            <div className="space-y-2">
              {LIFECYCLE_TRANSITIONS.map((t, i) => (
                <motion.div
                  key={`${t.from}-${t.to}`}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-2.5"
                >
                  <span className="font-mono text-2xs text-mist-300">{t.from}</span>
                  <ArrowRightIcon className="h-3 w-3 text-mist-600" />
                  <span className="font-mono text-2xs text-mist-100">{t.to}</span>
                  <span className="ml-auto text-2xs text-mist-500">{t.note}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <p className="label mb-5">Terminal states</p>
            <div className="flex flex-col gap-3">
              {TERMINAL_STATES.map((s) => (
                <div
                  key={s}
                  className={cn(
                    'rounded-xl border px-4 py-3 font-mono text-xs font-semibold',
                    s === 'FAILED'
                      ? 'border-rosex-500/30 bg-rosex-500/10 text-rosex-500'
                      : 'border-amberx-500/30 bg-amberx-500/10 text-amberx-500',
                  )}
                >
                  {s}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-ink-700 bg-ink-850 p-4">
              <div className="flex items-center gap-2 text-mint-500">
                <CheckIcon className="h-4 w-4" />
                <span className="text-xs font-semibold text-mist-100">Idempotent payment requests</span>
              </div>
              <p className="mt-2 text-2xs leading-relaxed text-mist-500">
                Reusing an idempotency key returns the existing order instead of creating a second
                charge.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------- Developer */

function DeveloperSection() {
  const request = `POST /api/v1/payments
Content-Type: application/json
X-Merchant-Id: merchant_123

{
  "merchantId": "merchant_123",
  "amount": 4999,
  "currency": "INR",
  "idempotencyKey": "idem_9f2c1a7b3d4e5f60"
}`

  const response = `201 Created

{
  "orderId": "ord_a1b2c3d4e5f6",
  "merchantId": "merchant_123",
  "amount": 4999,
  "currency": "INR",
  "status": "CREATED",
  "createdAt": "2026-01-01T10:00:00"
}`

  return (
    <section
      id="developer-experience"
      className="border-t border-ink-700/60 bg-ink-900 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="label">Developer experience</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
            Built for developers who own the payment stack.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
            One API surface. Provider-specific complexity stays behind the orchestration layer.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <CodePanel title="Request" code={request} />
          </Reveal>
          <Reveal delay={0.08}>
            <CodePanel title="Response" code={response} accent />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#developer-experience" className="btn-primary">
              Read the API docs
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#architecture" className="btn-ghost">
              Explore the architecture
            </a>
          </div>
          <p className="mt-5 font-mono text-2xs text-mist-500">
            GET /api/v1/payments/{'{orderId}'} · amount in minor units (paise / cents) · currency INR, USD, EUR
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function CodePanel({ title, code, accent }: { title: string; code: string; accent?: boolean }) {
  return (
    <div className="card overflow-hidden !rounded-2xl">
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-850 px-4 py-2.5">
        <span className="font-mono text-2xs uppercase tracking-wider text-mist-500">{title}</span>
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            accent ? 'bg-mint-400' : 'bg-brand-500',
          )}
        />
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-mist-300">
        {code}
      </pre>
    </div>
  )
}

/* ----------------------------------------------------------- Architecture */

function ArchitectureSection() {
  const stack = TECH_STACK
  return (
    <section id="architecture" className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">Architecture</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Designed as a payment infrastructure layer.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
          Each concern is isolated into a service with a single responsibility so failures stay
          contained and recovery is deterministic.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {ARCHITECTURE_LAYERS.map((layer, i) => (
          <Reveal key={layer.tier} delay={i * 0.05}>
            <div className="card h-full p-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xs uppercase tracking-wider text-brand-500">
                  {layer.tier}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {layer.nodes.map((node) => (
                  <span
                    key={node}
                    className="rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 font-mono text-2xs text-mist-300"
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="card mt-6 p-6">
          <p className="label">Technology</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {stack.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-850 px-3.5 py-2"
              >
                <span className="text-sm font-semibold text-mist-100">{t.name}</span>
                <span className="text-2xs text-mist-500">{t.note}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------ Reliability */

function ReliabilitySection() {
  return (
    <section className="border-t border-ink-700/60 bg-ink-900 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="label">Reliability</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
              Payments need graceful failure.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mist-400">
              Provider failures should not force your entire payment system to fail. LoomPay keeps
              execution serialized, records every transition, and resolves stale orders on a
              schedule.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {RELIABILITY_FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.05}>
                  <div className="rounded-xl border border-ink-700 bg-ink-850 p-4">
                    <p className="text-sm font-semibold text-mist-100">{f.title}</p>
                    <p className="mt-1.5 text-2xs leading-relaxed text-mist-500">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card p-6">
              <p className="label mb-5">Failure handling path</p>
              <div className="flex flex-col">
                {FAILOVER_STEPS.map((step, i) => (
                  <div key={step.label} className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ delay: i * 0.09 }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-4 py-3',
                        step.tone === 'danger'
                          ? 'border-rosex-500/30 bg-rosex-500/10'
                          : step.tone === 'mint'
                            ? 'border-mint-500/30 bg-mint-500/10'
                            : step.tone === 'brand'
                              ? 'border-brand-500/25 bg-brand-500/10'
                              : 'border-ink-700 bg-ink-850',
                      )}
                    >
                      <span className="text-xs font-semibold text-mist-100">{step.label}</span>
                      <span className="font-mono text-2xs text-mist-500">{step.state}</span>
                    </motion.div>
                    {i < FAILOVER_STEPS.length - 1 && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: i * 0.09 + 0.05 }}
                        className="my-1 h-4 w-px origin-top bg-ink-600"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- Observability */

function ObservabilitySection() {
  const rows = [
    { id: 'pay_8f2c91', amount: '₹1,499', status: 'SUCCESS', tone: 'mint' },
    { id: 'pay_7c1a04', amount: '₹3,200', status: 'FAILED', tone: 'rose' },
    { id: 'pay_6d9e73', amount: '₹799', status: 'PROCESSING', tone: 'brand' },
  ]
  const metrics = [
    { label: 'Total transactions', value: 12842, fmt: (v: number) => v.toLocaleString('en-IN') },
    { label: 'Successful', value: 11946, fmt: (v: number) => v.toLocaleString('en-IN') },
    { label: 'Failed', value: 896, fmt: (v: number) => v.toLocaleString('en-IN') },
    { label: 'Success rate', value: 93.0, fmt: (v: number) => `${v.toFixed(2)}%` },
  ]

  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <p className="label">Observability</p>
          <span className="chip border-amberx-500/30 bg-amberx-500/10 text-amberx-500">
            demo data
          </span>
        </div>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Know what happened to every transaction.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
          The console surfaces transaction status, failures, and routing decisions in one place.
          The figures below illustrate the layout.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="card mt-12 overflow-hidden">
          <div className="grid grid-cols-2 divide-ink-700 border-b border-ink-700 sm:grid-cols-4 sm:divide-x">
            {metrics.map((m, i) => (
              <div key={m.label} className="p-5">
                <p className="text-2xs uppercase tracking-wider text-mist-500">{m.label}</p>
                <p className="mt-2 font-display text-2xl font-bold text-mist-100">
                  <AnimatedNumber value={m.value} format={m.fmt} />
                </p>
                {i === 3 && <span className="text-2xs text-mist-500">demo</span>}
              </div>
            ))}
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="label mb-3">Recent transactions</p>
              <div className="overflow-hidden rounded-xl border border-ink-700">
                {rows.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-ink-700/70 px-4 py-3 last:border-0"
                  >
                    <span className="font-mono text-xs text-mist-300">{r.id}</span>
                    <span className="font-mono text-xs text-mist-100">{r.amount}</span>
                    <span
                      className={cn(
                        'chip',
                        r.tone === 'mint'
                          ? 'border-mint-500/30 bg-mint-500/10 text-mint-500'
                          : r.tone === 'rose'
                            ? 'border-rosex-500/30 bg-rosex-500/10 text-rosex-500'
                            : 'border-brand-500/30 bg-brand-500/10 text-brand-600',
                      )}
                    >
                      {r.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <p className="label mb-3">Provider performance</p>
              <div className="space-y-4">
                {[
                  { name: 'Provider A', value: 94.2 },
                  { name: 'Provider B', value: 91.7 },
                  { name: 'Provider C', value: 89.8 },
                ].map((p, i) => (
                  <div key={p.name}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-mist-300">{p.name}</span>
                      <span className="font-mono text-xs text-mist-200">{p.value}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-750">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: i * 0.12 }}
                        className="h-full rounded-full bg-brand-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------- Security */

function SecuritySection() {
  return (
    <section className="border-t border-ink-700/60 bg-ink-900 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <p className="label">Security</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
            Security belongs in the infrastructure.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-400">
            The guarantees below are enforced in code today — not aspirational certifications.
          </p>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_ITEMS.map((item) => (
            <StaggerItem key={item.title}>
              <div className="flex h-full gap-3 rounded-xl border border-ink-700 bg-ink-850 p-5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-500/15 text-mint-500">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-mist-100">{item.title}</p>
                  <p className="mt-1 text-2xs leading-relaxed text-mist-500">{item.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Use cases */

function UseCasesSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label">Use cases</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.6rem] sm:leading-[1.1]">
          Built for multi-provider payment stacks.
        </h2>
      </Reveal>

      <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2">
        {USE_CASES.map((u) => (
          <StaggerItem key={u.id}>
            <article className="card card-hover h-full p-6">
              <p className="font-display text-lg font-semibold text-mist-100">{u.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-mist-400">{u.body}</p>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}

/* ------------------------------------------------------------------- CTA */

function CTASection({ authed }: { authed: boolean }) {
  return (
    <section className="border-t border-ink-700/60 bg-ink-900 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <div className="rounded-[2rem] border border-brand-500/20 bg-brand-soft px-8 py-16 sm:px-16">
            <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-[2.4rem] sm:leading-[1.1]">
              Take control of your payment infrastructure.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-mist-400">
              Integrate once. Connect your providers. Define your routing logic. Observe every
              transaction.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={authed ? '/dashboard' : '/login'} className="btn-primary">
                {authed ? 'Open the console' : 'Explore LoomPay'}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                View GitHub
                <ExternalIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Footer */

function Footer() {
  return (
    <footer className="border-t border-ink-700/70 bg-ink-900">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <LoomPayLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-500">
              {SITE.tagline}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-1 text-sm text-mist-500 transition-colors hover:text-brand-500"
              >
                {link.label}
                {link.external && <ExternalIcon className="h-3 w-3" />}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink-700/70 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-mist-500">© 2026 LoomPay</p>
          <div className="flex items-center gap-2 text-xs text-mist-500">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
            Built with Spring Boot, PostgreSQL, and Redis
          </div>
        </div>
      </div>
    </footer>
  )
}
