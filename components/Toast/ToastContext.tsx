'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastType = 'success' | 'error'

type ToastItem = {
  id: number
  message: string
  type: ToastType
}

type ToastContextValue = {
  showToast: (message: string, type: ToastType) => void
  toasts: ToastItem[]
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      const id = ++nextId
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => removeToast(id), 2500)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
