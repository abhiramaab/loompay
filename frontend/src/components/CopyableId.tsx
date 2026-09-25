import { useState } from 'react'
import { CheckIcon, CopyIcon } from './Icons'
import { cn, copyToClipboard } from '@/lib/utils'

export function CopyableId({
  value,
  display,
  className,
}: {
  value: string
  display?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await copyToClipboard(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy"
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-md font-mono text-xs text-mist-300 transition-colors hover:text-mist-100',
        className,
      )}
    >
      <span className="truncate">{display ?? value}</span>
      <span className="text-mist-600 transition-colors group-hover:text-brand-500">
        {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
      </span>
    </button>
  )
}
