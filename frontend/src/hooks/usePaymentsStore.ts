import { useCallback, useEffect, useState } from 'react'
import type { Payment } from '@/api/types'
import { loadPayments, savePayment, subscribePayments } from '@/lib/store'

export function usePaymentsStore() {
  const [payments, setPayments] = useState<Payment[]>(() => loadPayments())

  useEffect(() => {
    setPayments(loadPayments())
    return subscribePayments(() => setPayments(loadPayments()))
  }, [])

  const add = useCallback((payment: Payment) => {
    setPayments(savePayment(payment))
  }, [])

  return { payments, add }
}
