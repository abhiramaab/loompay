import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/AppShell'
import { ToastProvider } from '@/hooks/useToasts'
import { Dashboard } from '@/pages/Dashboard'
import { Payments } from '@/pages/Payments'
import { PaymentDetail } from '@/pages/PaymentDetail'
import { Ledger } from '@/pages/Ledger'
import { Developer } from '@/pages/Developer'

function Page({ children }: { children: React.ReactNode }) {
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

export default function App() {
  const location = useLocation()

  return (
    <ToastProvider>
      <AppShell>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Page>
                  <Dashboard />
                </Page>
              }
            />
            <Route
              path="/payments"
              element={
                <Page>
                  <Payments />
                </Page>
              }
            />
            <Route
              path="/payments/:orderId"
              element={
                <Page>
                  <PaymentDetail />
                </Page>
              }
            />
            <Route
              path="/ledger"
              element={
                <Page>
                  <Ledger />
                </Page>
              }
            />
            <Route
              path="/developer"
              element={
                <Page>
                  <Developer />
                </Page>
              }
            />
          </Routes>
        </AnimatePresence>
      </AppShell>
    </ToastProvider>
  )
}
