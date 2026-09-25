/**
 * Content model for the LoomPay marketing site.
 *
 * Every claim here maps to something that exists in the backend under
 * `src/main/java`. Items that are designed but not yet wired are marked
 * `roadmap: true` so the UI can label them honestly.
 */

export const SITE = {
  name: 'LoomPay',
  domain: 'loompay.abhiram.tech',
  tagline: 'Payment orchestration infrastructure for modern engineering teams.',
  repo: 'https://github.com/anomalyco/opencode',
  docs: '#developer-experience',
} as const

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Orchestration', href: '#orchestration' },
  { label: 'Routing', href: '#routing' },
  { label: 'Lifecycle', href: '#lifecycle' },
  { label: 'Developers', href: '#developer-experience' },
  { label: 'Architecture', href: '#architecture' },
]

/* ------------------------------------------------------------ Problems */

export const PROBLEMS = [
  {
    title: 'Multiple providers',
    body: 'Different APIs, response formats, webhooks, and failure codes for every gateway you add.',
  },
  {
    title: 'Failures',
    body: 'A provider outage or a temporary decline can turn a successful transaction into lost revenue.',
  },
  {
    title: 'No central control',
    body: 'Routing logic gets scattered across application code and provider integrations.',
  },
  {
    title: 'Fragmented operations',
    body: 'Transactions, refunds, failures, and settlements become difficult to track across providers.',
  },
]

/* ---------------------------------------------------------- Capabilities */

export interface Capability {
  id: string
  title: string
  body: string
  detail: string
  roadmap?: boolean
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'unified-api',
    title: 'Unified payment API',
    body: 'Integrate your application with LoomPay instead of building a separate integration for every provider.',
    detail: 'POST /api/v1/payments',
  },
  {
    id: 'idempotency',
    title: 'Idempotent requests',
    body: 'A Redis-backed mutex with double-checked idempotency keys guarantees a payment is created once, even under concurrent retries.',
    detail: 'SET NX + double-check',
  },
  {
    id: 'routing',
    title: 'Partition routing',
    body: 'A deterministic consistent-hash ring distributes merchant traffic across storage partitions with minimal rehashing when nodes change.',
    detail: 'MD5-style hash ring',
  },
  {
    id: 'ledger',
    title: 'Double-entry ledger',
    body: 'Every financial movement writes immutable debit and credit rows. Consistency is verifiable by asserting total debits equal total credits.',
    detail: 'Append-only journal',
  },
  {
    id: 'outbox',
    title: 'Transactional outbox',
    body: 'Domain events are written in the same transaction as the payment and published by a scheduled dispatcher with bounded retries.',
    detail: 'at-least-once publish',
  },
  {
    id: 'reconciliation',
    title: 'Reconciliation worker',
    body: 'Orders stuck in PROCESSING past a threshold are detected on a schedule and resolved deterministically instead of hanging forever.',
    detail: 'auto-resolve stale orders',
  },
]

/* ------------------------------------------------------------ Flow steps */

export const FLOW_STEPS = [
  { step: '01', key: 'CREATE', body: 'Your application creates a payment through the LoomPay API.' },
  { step: '02', key: 'ORCHESTRATE', body: 'LoomPay acquires a distributed lock and checks the idempotency key.' },
  { step: '03', key: 'ROUTE', body: 'The request is assigned to a partition by the routing layer.' },
  { step: '04', key: 'RECORD', body: 'The order, ledger entries, and outbox event are written in one transaction.' },
  { step: '05', key: 'TRACK', body: 'Every state transition is persisted so the lifecycle stays observable.' },
]

export const FLOW_DIAGRAM = [
  'Application',
  'LoomPay API',
  'Idempotency + Lock',
  'Routing Layer',
  'Transaction Store',
  'Outbox Publisher',
]

/* -------------------------------------------------------- Routing engine */

export const ROUTING_PARAMETERS = [
  'Merchant partition key',
  'Order idempotency key',
  'Consistent-hash ring position',
  'Virtual node replicas',
]

export const ROUTING_RULES = [
  'Partition assignment by merchant key',
  'Deterministic re-routing on ring change',
  'Locked execution per idempotency key',
  'Stale-order reconciliation',
]

/** Illustrative counters used in the routing visual. Clearly demo-only. */
export const ROUTING_DEMO = [
  { label: 'Hash ring health', value: 98 },
  { label: 'Partition coverage', value: 100 },
  { label: 'Lock acquisition', value: 99 },
]

/* ------------------------------------------------------- Provider adapters */

export const ADAPTER_INTERFACE = [
  { method: 'authorize', note: 'map request to provider call' },
  { method: 'capture', note: 'confirm the authorization' },
  { method: 'refund', note: 'reverse a captured payment' },
  { method: 'parseWebhook', note: 'normalize provider events' },
]

/* ------------------------------------------------------------ Lifecycle */

/** Mirrors tech.abhiram.loompay.enums.PaymentStatus exactly. */
export const LIFECYCLE_STATES = ['CREATED', 'PROCESSING', 'SUCCESS'] as const
export const TERMINAL_STATES = ['FAILED', 'REFUNDED'] as const

export const LIFECYCLE_TRANSITIONS = [
  { from: 'CREATED', to: 'PROCESSING', note: 'evaluated and dispatched' },
  { from: 'PROCESSING', to: 'SUCCESS', note: 'provider confirms the charge' },
  { from: 'PROCESSING', to: 'FAILED', note: 'terminal failure' },
  { from: 'SUCCESS', to: 'REFUNDED', note: 'compensating reversal' },
] as const

/* ----------------------------------------------------------- Architecture */

export const ARCHITECTURE_LAYERS = [
  {
    tier: 'Client',
    nodes: ['Application', 'SDK / HTTP client'],
  },
  {
    tier: 'API',
    nodes: ['PaymentController', 'RateLimitInterceptor'],
  },
  {
    tier: 'Orchestration',
    nodes: ['PaymentService', 'IdempotencyService', 'DistributedLockService'],
  },
  {
    tier: 'Routing',
    nodes: ['ConsistentHashRouter'],
  },
  {
    tier: 'Persistence',
    nodes: ['PaymentOrder', 'LedgerEntry', 'OutboxEvent', 'PaymentAttempt'],
  },
  {
    tier: 'Background',
    nodes: ['OutboxPublisherService', 'ReconciliationService'],
  },
]

export const TECH_STACK = [
  { name: 'Java 21', note: 'language' },
  { name: 'Spring Boot 3.4', note: 'framework' },
  { name: 'PostgreSQL', note: 'primary store' },
  { name: 'Redis', note: 'locks + rate limits' },
  { name: 'H2', note: 'local profile' },
  { name: 'Docker Compose', note: 'local stack' },
  { name: 'JUnit 5 + Mockito', note: 'tests' },
]

/* ------------------------------------------------------------- Reliability */

export const FAILOVER_STEPS = [
  { label: 'Provider A', state: 'timeout', tone: 'danger' },
  { label: 'Lock acquired', state: 'held', tone: 'muted' },
  { label: 'State persisted', state: 'recorded', tone: 'brand' },
  { label: 'Reconciliation', state: 'evaluated', tone: 'brand' },
  { label: 'Order resolved', state: 'FAILED / SUCCESS', tone: 'mint' },
]

export const RELIABILITY_FEATURES = [
  { title: 'Idempotent retries', body: 'Safe to retry a request with the same key without creating a duplicate charge.' },
  { title: 'Distributed locks', body: 'Serialized execution per idempotency key with a bounded TTL.' },
  { title: 'Stale-order recovery', body: 'Orders stuck in PROCESSING are reconciled on a schedule.' },
  { title: 'Outbox dispatch', body: 'Events survive process restarts and retry up to a bounded limit.' },
  { title: 'Failure visibility', body: 'Terminal states and processing timeouts are persisted and queryable.' },
]

/* ------------------------------------------------------------ Security */

export const SECURITY_ITEMS = [
  { title: 'Idempotency keys', body: 'Duplicate submissions are detected and collapsed to a single order.' },
  { title: 'Distributed locks', body: 'Concurrent writes for the same key are serialized across workers.' },
  { title: 'Rate limiting', body: 'Per-merchant request windows reject excess traffic with HTTP 429 and Retry-After.' },
  { title: 'Request validation', body: 'Inbound payloads are validated before they reach the orchestration layer.' },
  { title: 'Immutable ledger', body: 'Financial movements are append-only and never mutated in place.' },
  { title: 'Bounded retries', body: 'Outbox events stop after a configured retry limit and are marked FAILED.' },
]

/* ------------------------------------------------------------- Use cases */

export const USE_CASES = [
  {
    id: 'ecommerce',
    title: 'E-commerce',
    body: 'Route transactions across providers while maintaining a single integration and consistent order state.',
  },
  {
    id: 'marketplaces',
    title: 'Marketplaces',
    body: 'Centralize payment flow and provider logic across a complex commerce platform.',
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    body: 'Keep recurring payment state observable and recover stale processing orders deterministically.',
  },
  {
    id: 'global',
    title: 'Global commerce',
    body: 'Abstract provider-specific behavior as payment infrastructure expands across regions.',
  },
]

export const FOOTER_LINKS = [
  { label: 'Documentation', href: '#developer-experience' },
  { label: 'GitHub', href: SITE.repo, external: true },
  { label: 'API Reference', href: '#developer-experience' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Changelog', href: SITE.repo, external: true },
]
