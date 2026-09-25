import { motion } from 'framer-motion'
import type { PaymentStatus } from '@/api/types'
import { statusMeta } from '@/lib/status'
import { cn } from '@/lib/utils'

const FLOW: { status: PaymentStatus; x: number; y: number }[] = [
  { status: 'CREATED', x: 60, y: 40 },
  { status: 'PROCESSING', x: 200, y: 40 },
  { status: 'SUCCESS', x: 340, y: 40 },
  { status: 'FAILED', x: 200, y: 130 },
  { status: 'REFUNDED', x: 340, y: 130 },
]

const TRANSITIONS: [PaymentStatus, PaymentStatus][] = [
  ['CREATED', 'PROCESSING'],
  ['PROCESSING', 'SUCCESS'],
  ['PROCESSING', 'FAILED'],
  ['SUCCESS', 'REFUNDED'],
]

export function StateMachine({ active }: { active?: PaymentStatus }) {
  const pos = (status: PaymentStatus) => FLOW.find((n) => n.status === status)!
  const nodeW = 88
  const nodeH = 34

  return (
    <svg viewBox="0 0 460 175" className="h-auto w-full" role="img" aria-label="Payment lifecycle">
      <defs>
        <linearGradient id="sm-edge" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <marker id="sm-arrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#4f4f6a" />
        </marker>
      </defs>

      {TRANSITIONS.map(([from, to]) => {
        const a = pos(from)
        const b = pos(to)
        const isBackEdge = a.y !== b.y
        const isActive = active === from || active === to
        let d: string
        if (isBackEdge) {
          const midY = (a.y + b.y) / 2
          d = `M ${a.x} ${a.y + nodeH / 2} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y - nodeH / 2}`
        } else {
          d = `M ${a.x + nodeW / 2} ${a.y} L ${b.x - nodeW / 2} ${b.y}`
        }
        return (
          <motion.path
            key={`${from}-${to}`}
            d={d}
            fill="none"
            stroke={isActive ? 'url(#sm-edge)' : '#33334a'}
            strokeWidth={isActive ? 2 : 1.5}
            markerEnd="url(#sm-arrow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
        )
      })}

      {FLOW.map(({ status, x, y }, i) => {
        const meta = statusMeta(status)
        const isActive = active === status
        return (
          <motion.g
            key={status}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 320, damping: 24 }}
          >
            {isActive && (
              <motion.rect
                x={x - nodeW / 2 - 3}
                y={y - nodeH / 2 - 3}
                width={nodeW + 6}
                height={nodeH + 6}
                rx="12"
                fill="none"
                stroke="#6366f1"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                animate={{ opacity: [0.35, 0.9, 0.35] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <rect
              x={x - nodeW / 2}
              y={y - nodeH / 2}
              width={nodeW}
              height={nodeH}
              rx="10"
              className={cn(isActive ? 'fill-ink-750' : 'fill-ink-850')}
              stroke={isActive ? '#818cf8' : '#33334a'}
              strokeWidth="1.25"
            />
            <circle cx={x - nodeW / 2 + 14} cy={y} r="3" className={meta.dot} />
            <text
              x={x + 6}
              y={y + 3.5}
              textAnchor="middle"
              className={cn('font-mono', isActive ? 'fill-mist-100' : 'fill-mist-400')}
              style={{ fontSize: 9.5, letterSpacing: '0.02em' }}
            >
              {meta.label.toUpperCase()}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}
