import { useEffect, useState } from 'react'
import { probeBackend, type ProbeResult } from '@/api/client'

export function useBackendHealth(intervalMs = 15000) {
  const [health, setHealth] = useState<ProbeResult | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    let active = true
    const run = async () => {
      setChecking(true)
      const result = await probeBackend()
      if (active) {
        setHealth(result)
        setChecking(false)
      }
    }
    run()
    const id = setInterval(run, intervalMs)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [intervalMs])

  return { health, checking }
}
