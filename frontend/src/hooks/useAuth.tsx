import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface Session {
  name: string
  email: string
  merchantId: string
  signedInAt: number
}

interface AuthContextValue {
  session: Session | null
  isAuthenticated: boolean
  signIn: (input: { name?: string; email: string; merchantId?: string }) => Session
  signOut: () => void
}

const STORAGE_KEY = 'loompay.session'

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    return parsed?.email ? parsed : null
  } catch {
    return null
  }
}

function deriveName(email: string): string {
  const local = email.split('@')[0] ?? 'operator'
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession())

  const signIn = useCallback((input: { name?: string; email: string; merchantId?: string }) => {
    const email = input.email.trim()
    const merchantId =
      input.merchantId?.trim() ||
      localStorage.getItem('loompay.merchantId') ||
      `merchant_${email.split('@')[0]?.replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'demo'}`
    const next: Session = {
      name: input.name?.trim() || deriveName(email),
      email,
      merchantId,
      signedInAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    localStorage.setItem('loompay.merchantId', merchantId)
    setSession(next)
    return next
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, isAuthenticated: session !== null, signIn, signOut }),
    [session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
