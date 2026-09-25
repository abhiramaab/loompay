import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/AppShell'
import { ToastProvider } from '@/hooks/useToasts'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Payments } from '@/pages/Payments'
import { PaymentDetail } from '@/pages/PaymentDetail'
import { Ledger } from '@/pages/Ledger'
import { Developer } from '@/pages/Developer'

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Protected({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <AppShell>{children}</AppShell>
}

function protectedPage(element: ReactNode) {
  return (
    <Protected>
      <Page>{element}</Page>
    </Protected>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <ToastProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
            <Route
              path="/login"
              element={
                <Page>
                  <Login />
                </Page>
              }
            />
            <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
            <Route path="/payments" element={protectedPage(<Payments />)} />
            <Route path="/payments/:orderId" element={protectedPage(<PaymentDetail />)} />
            <Route path="/ledger" element={protectedPage(<Ledger />)} />
            <Route path="/developer" element={protectedPage(<Developer />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </ToastProvider>
    </AuthProvider>
  )
}
