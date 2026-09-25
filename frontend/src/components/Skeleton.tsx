import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-lg bg-gradient-to-r from-ink-800 via-ink-750 to-ink-800 bg-[length:200%_100%]',
        className,
      )}
    />
  )
}
