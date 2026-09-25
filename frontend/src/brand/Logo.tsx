import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '@/lib/utils'

interface MarkProps {
  size?: number
  className?: string
  animated?: boolean
  /**
   * Render a rounded tile behind the mark. When false the kite is drawn
   * directly on a transparent background.
   */
  tile?: boolean
  /** Force a colour. Defaults to the brand gradient. */
  tone?: 'brand' | 'current'
}

/**
 * LoomPay mark: a kite with a trailing tail and string.
 *
 * A kite (patang) is the motif — kept geometric and minimal so it stays sharp
 * at small sizes and reads on a transparent background.
 */
export function LoomPayMark({
  size = 36,
  className,
  animated = false,
  tile = false,
  tone = 'brand',
}: MarkProps) {
  const uid = useId().replace(/:/g, '')
  const fillGrad = `lp-kite-${uid}`
  const tailGrad = `lp-tail-${uid}`

  const isCurrent = tone === 'current'
  const bodyFill = tile ? '#FFFFFF' : isCurrent ? 'currentColor' : `url(#${fillGrad})`
  const tailStroke = tile ? 'rgba(255,255,255,0.92)' : isCurrent ? 'currentColor' : `url(#${tailGrad})`
  const spineStroke = tile ? 'rgba(10,132,255,0.55)' : 'rgba(255,255,255,0.5)'
  const stringStroke = tile ? 'rgba(255,255,255,0.55)' : isCurrent ? 'currentColor' : '#0A84FF'

  const draw = (delay: number, duration = 0.7) => ({
    initial: animated ? { pathLength: 0, opacity: 0 } : false,
    animate: animated ? { pathLength: 1, opacity: 1 } : undefined,
    transition: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="LoomPay"
    >
      <defs>
        <linearGradient id={fillGrad} x1="20" y1="8" x2="46" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A84FF" />
          <stop offset="1" stopColor="#32ADE6" />
        </linearGradient>
        <linearGradient id={tailGrad} x1="30" y1="30" x2="46" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5AC8FA" />
          <stop offset="1" stopColor="#32ADE6" />
        </linearGradient>
      </defs>

      {tile && (
        <>
          <rect x="0.5" y="0.5" width="63" height="63" rx="17" fill={`url(#${fillGrad})`} />
          <rect
            x="0.5"
            y="0.5"
            width="63"
            height="63"
            rx="17"
            fill={`url(#${tailGrad})`}
            fillOpacity="0.18"
          />
        </>
      )}

      {/* Tail ribbon hanging from the bottom of the kite, with two bows. */}
      <motion.path
        d="M32 46 C35 50.5 30 53 33 57.5"
        stroke={tailStroke}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
        {...draw(0.35, 0.6)}
      />
      {[
        'M27.4 49.6 C29.6 48.6 31.4 49.4 32.9 51.2',
        'M36.6 50.4 C34.4 49.4 32.6 50.2 31.1 52',
        'M27.6 54.6 C29.8 53.6 31.6 54.4 33.1 56.2',
        'M36.8 55.4 C34.6 54.4 32.8 55.2 31.3 57',
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke={tailStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          {...draw(0.5 + i * 0.05, 0.35)}
        />
      ))}

      {/* String trailing from the right corner. */}
      <motion.path
        d="M49 27 C54 31 54.5 38 50.5 43"
        stroke={stringStroke}
        strokeOpacity={tile ? 0.55 : 0.45}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        {...draw(0.6, 0.5)}
      />

      {/* Kite body: a modern diamond with a centre spine. */}
      <motion.path
        d="M32 8 L49 27 L32 46 L15 27 Z"
        fill={bodyFill}
        initial={animated ? { opacity: 0, scale: 0.9 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.05, type: 'spring', stiffness: 220, damping: 18 }}
        style={{ transformOrigin: '32px 27px' }}
      />
      <motion.path
        d="M32 8 L32 46"
        stroke={spineStroke}
        strokeWidth="1.3"
        strokeLinecap="round"
        {...draw(0.3, 0.5)}
      />
    </svg>
  )
}

interface LogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
  /** Colour scheme for the wordmark and mark. */
  variant?: 'default' | 'light'
}

export function LoomPayLogo({
  className,
  size = 34,
  showWordmark = true,
  variant = 'default',
}: LogoProps) {
  const isLight = variant === 'light'
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LoomPayMark
        size={size}
        tile={false}
        tone={isLight ? 'current' : 'brand'}
        className={isLight ? 'text-white' : undefined}
      />
      {showWordmark && (
        <span
          className={cn(
            'font-display text-[1.3rem] font-bold leading-none tracking-tight',
            isLight ? 'text-white' : 'text-mist-100',
          )}
          style={{ letterSpacing: '-0.03em' }}
        >
          Loom
          <span className={isLight ? 'text-brand-300' : 'text-brand-500'}>Pay</span>
        </span>
      )}
    </div>
  )
}
