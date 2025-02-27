"use client"

import type React from "react"
import { createContext, useContext, useCallback, useState } from "react"
import NotificationsContainer from "./NotificationContainer"
import type { NotificationProps } from "../components/notification/Notification"

interface NotificationContextType {
  addNotification: (options: AddNotificationOptions) => void
  removeNotification: (id: number) => void
}

interface AddNotificationOptions {
  type?: "success" | "error" | "info" | "warning"
  title?: string | null
  message: string
  color?: string
  delay?: number
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const colors = {
    success: "#00c853", // GTA V Grün
    error: "#ff3e3e", // GTA V Rot
    info: "#2979ff", // GTA V Blau
    warning: "#ffd600", // GTA V Gelb
  }

  const addNotification = useCallback(
    ({ type = "info", title = null, message, color, delay = 5000 }: AddNotificationOptions) => {
      const newNotification: NotificationProps = {
        id: Date.now(),
        title,
        message,
        color: color || colors[type],
        delay,
        type,
      }

      setNotifications((prev) => [...prev, newNotification])
    },
    [],
  )

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <NotificationsContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  )
}

// Custom Hook für einfache Verwendung
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }

  // Vordefinierte Methoden für häufige Anwendungsfälle
  return {
    // Basis-Methode
    add: context.addNotification,

    // Vordefinierte Methoden
    success: (message: string, title?: string) => context.addNotification({ type: "success", message, title }),

    error: (message: string, title?: string) => context.addNotification({ type: "error", message, title }),

    info: (message: string, title?: string) => context.addNotification({ type: "info", message, title }),

    warning: (message: string, title?: string) => context.addNotification({ type: "warning", message, title }),

    // Custom Notification mit eigener Farbe
    custom: (message: string, color: string, title?: string) => context.addNotification({ message, color, title }),
  }
}

