import type { ComponentType, SVGProps } from 'react'
import {
  BookIcon,
  BoltIcon,
  LayersIcon,
  LockIcon,
  RouteIcon,
  ShieldIcon,
  TerminalIcon,
  ClockIcon,
  GridIcon,
  CardIcon,
} from '@/components/Icons'

export type Icon = ComponentType<SVGProps<SVGSVGElement>>

export interface NavItem {
  label: string
  description: string
  href: string
  icon: Icon
}

export interface NavGroup {
  label: string
  items: NavItem[]
  footer?: { label: string; href: string }[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Solutions',
    items: [
      {
        label: 'Intelligent Routing',
        description: 'Rule, volume, and ML-driven routing across PSPs.',
        href: '#routing',
        icon: RouteIcon,
      },
      {
        label: 'Reconciliation',
        description: 'Automated matching with audit-ready output.',
        href: '#reconciliation',
        icon: BookIcon,
      },
      {
        label: 'Vault',
        description: 'Tokenize and store payment credentials securely.',
        href: '#vault',
        icon: LockIcon,
      },
      {
        label: 'Cost Observability',
        description: 'Full visibility into scheme and acquirer fees.',
        href: '#observability',
        icon: GridIcon,
      },
      {
        label: 'Revenue Recovery',
        description: 'Intelligent retries that recover failed charges.',
        href: '#revenue-recovery',
        icon: BoltIcon,
      },
      {
        label: 'Alternative Payment Methods',
        description: 'UPI, BNPL, A2A, and local rails as widgets.',
        href: '#apm',
        icon: CardIcon,
      },
    ],
    footer: [
      { label: 'Prism', href: '#prism' },
      { label: 'Secure Authentication', href: '#authentication' },
    ],
  },
  {
    label: 'Industries',
    items: [
      {
        label: 'Infrastructure, SaaS & Fintech',
        description: 'Banking-grade compliance at developer speed.',
        href: '#industry-isf',
        icon: LayersIcon,
      },
      {
        label: 'Banks',
        description: 'Ledger-grade primitives for regulated entities.',
        href: '#industry-banks',
        icon: ShieldIcon,
      },
      {
        label: 'Airlines',
        description: 'High-volume authorization and settlement.',
        href: '#industry-airlines',
        icon: BoltIcon,
      },
    ],
  },
  {
    label: 'Developers',
    items: [
      {
        label: 'Developer Docs',
        description: 'Guides for integrating the orchestration engine.',
        href: '#developers',
        icon: BookIcon,
      },
      {
        label: 'API Reference',
        description: 'Every endpoint, schema, and status code.',
        href: '#developers',
        icon: TerminalIcon,
      },
      {
        label: 'Open Source',
        description: 'Self-host and inspect the entire stack.',
        href: '#open-source',
        icon: LockIcon,
      },
    ],
  },
  {
    label: 'Resources',
    items: [
      {
        label: 'Blogs',
        description: 'Engineering notes on payments at scale.',
        href: '#resources',
        icon: BookIcon,
      },
      {
        label: 'Case Studies',
        description: 'How teams ship on LoomPay.',
        href: '#resources',
        icon: LayersIcon,
      },
      {
        label: 'Release Notes',
        description: 'What shipped, when, and why.',
        href: '#resources',
        icon: ClockIcon,
      },
    ],
  },
]

export const SOLUTIONS: Array<{
  id: string
  eyebrow: string
  title: string
  body: string
  icon: Icon
  link: string
}> = [
  {
    id: 'routing',
    eyebrow: 'Routing',
    title: 'Intelligent Routing',
    body: 'Improve authorization rates and reduce cost with rule-based, volume-based, and ML-driven routing that drops into your existing multi-PSP setup.',
    icon: RouteIcon,
    link: 'Explore',
  },
  {
    id: 'reconciliation',
    eyebrow: 'Ledger',
    title: 'Reconciliation Engine',
    body: 'A unified framework that fetches from processors and banks, handles exceptions in real time, and produces audit-ready, balanced output.',
    icon: BookIcon,
    link: 'Explore',
  },
  {
    id: 'revenue-recovery',
    eyebrow: 'Retries',
    title: 'Revenue Recovery',
    body: 'Minimize involuntary churn with a retry engine tuned on decline codes, error type, region, payment method, and ticket size.',
    icon: BoltIcon,
    link: 'Explore',
  },
  {
    id: 'vault',
    eyebrow: 'Security',
    title: 'Vault',
    body: 'Store and manage network tokens, PSP tokens, and payment credentials to deliver seamless checkout for repeat users.',
    icon: LockIcon,
    link: 'Explore',
  },
  {
    id: 'observability',
    eyebrow: 'Observability',
    title: 'Cost Observability',
    body: 'Drill into scheme, interchange, and acquirer fees to detect anomalies and optimize payment cost from a self-serve dashboard.',
    icon: GridIcon,
    link: 'Explore',
  },
  {
    id: 'apm',
    eyebrow: 'Checkout',
    title: 'Alternative Payment Methods',
    body: 'Embed UPI, BNPL, A2A rails, and local payment methods as buttons with on-us routing to save cost and boost conversion.',
    icon: CardIcon,
    link: 'Explore',
  },
  {
    id: 'authentication',
    eyebrow: 'Fraud',
    title: 'Secure Authentication',
    body: 'Customizable, PSP-agnostic 3DS workflows tuned to risk scores — reducing fraud while keeping friction low.',
    icon: ShieldIcon,
    link: 'Explore',
  },
  {
    id: 'prism',
    eyebrow: 'Interop',
    title: 'Prism',
    body: 'An interoperability layer that lets you compose payment flows from modular building blocks — plug and play.',
    icon: LayersIcon,
    link: 'Explore',
  },
]

export const BUILD_CAPABILITIES = [
  {
    title: 'Enterprise-grade & globally compliant',
    body: 'Operate at scale with built-in security, regulatory compliance (PCI DSS, GDPR), and the performance enterprises demand.',
  },
  {
    title: 'Resilience, scalability & low latency',
    body: 'Handle peak load without downtime. The engine keeps ultra-fast response times even across multiple regions.',
  },
  {
    title: 'Modular architecture, tailored to you',
    body: 'Plug-and-play components let you pick exactly what you need — no one-size-fits-all. Adapt without rewrites.',
  },
  {
    title: 'Partner like an in-house team',
    body: 'Co-build with top-tier support, collaboration, and expertise at every stage of your payments roadmap.',
  },
  {
    title: 'Simplified payment workflows',
    body: 'Eliminate complexity with easy-to-integrate flows that reduce developer overhead and speed time-to-market.',
  },
]

export const COMPLIANCES = [
  { label: 'PCI DSS 4.0', sub: 'Level 1' },
  { label: 'ISO 27001', sub: 'Certified' },
  { label: 'SOC 2', sub: 'Type 2' },
  { label: 'GDPR', sub: 'Aligned' },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Solutions',
    links: [
      { label: 'Prism', href: '#prism' },
      { label: 'Intelligent Routing', href: '#routing' },
      { label: 'Vault', href: '#vault' },
      { label: 'Alternative Payment Methods', href: '#apm' },
      { label: 'Cost Observability', href: '#observability' },
      { label: 'Reconciliation', href: '#reconciliation' },
      { label: 'Revenue Recovery', href: '#revenue-recovery' },
    ],
  },
  {
    title: 'Compliances',
    links: [
      { label: 'Vulnerability Disclosure', href: '#resources' },
      { label: 'PCI DSS 4.0 (US)', href: '#resources' },
      { label: 'PCI DSS 4.0 (EU)', href: '#resources' },
      { label: 'ISO 27001:2022', href: '#resources' },
      { label: 'SOC 2 Type 2', href: '#resources' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Case Studies', href: '#resources' },
      { label: 'Community', href: '#resources' },
      { label: 'Developer Docs', href: '#developers' },
      { label: 'Blogs', href: '#resources' },
      { label: 'Newsroom', href: '#resources' },
      { label: 'Integrations', href: '#routing' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'About LoomPay', href: '#top' },
      { label: 'Careers', href: '#top' },
      { label: 'Contact', href: '#top' },
    ],
  },
]
