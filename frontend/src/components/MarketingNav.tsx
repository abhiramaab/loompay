import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LoomPayLogo } from '@/brand/Logo'
import { NAV_LINKS, SITE } from '@/lib/site'
import { cn } from '@/lib/utils'
import { ArrowRightIcon, ExternalIcon } from './Icons'

export function MarketingNav({ authed }: { authed: boolean }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 16))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-ink-700/70 bg-ink-850/85 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="shrink-0">
          <LoomPayLogo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-mist-400 transition-colors hover:text-mist-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href={SITE.docs}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-mist-400 transition-colors hover:text-mist-100"
          >
            Docs
          </a>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !py-2 text-sm"
          >
            GitHub
            <ExternalIcon className="h-3.5 w-3.5" />
          </a>
          <Link to={authed ? '/dashboard' : '/login'} className="btn-primary !py-2 text-sm">
            {authed ? 'Open console' : 'Get started'}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-mist-300 lg:hidden"
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1.5">
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink-700 bg-ink-850 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-mist-300 hover:bg-ink-750"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={SITE.repo}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-mist-300 hover:bg-ink-750"
              >
                GitHub
              </a>
              <div className="mt-2 flex flex-col gap-2">
                <Link to={authed ? '/dashboard' : '/login'} className="btn-primary w-full">
                  {authed ? 'Open console' : 'Get started'}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
