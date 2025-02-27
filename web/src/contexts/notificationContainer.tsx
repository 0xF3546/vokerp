"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Notification, { type NotificationProps } from "../components/notification/Notification"
import "./notification.css"

interface NotificationsContainerProps {
  notifications: NotificationProps[]
  removeNotification: (id: number) => void
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({ notifications, removeNotification }) => {
  const [fadingNotifications, setFadingNotifications] = useState<number[]>([])

  // Handle notification removal with animation
  const handleRemove = useCallback(
    (id: number) => {
      setFadingNotifications((prev) => [...prev, id])
      setTimeout(() => {
        removeNotification(id)
        setFadingNotifications((prev) => prev.filter((notifId) => notifId !== id))
      }, 300)
    },
    [removeNotification],
  )

  // Set up automatic removal based on delay
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    notifications.forEach((notification) => {
      if (!fadingNotifications.includes(notification.id)) {
        const timer = setTimeout(() => {
          handleRemove(notification.id)
        }, notification.delay)
        timers.push(timer)
      }
    })

    // Cleanup function
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [notifications, fadingNotifications, handleRemove])

  // Add mouse move effect for glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const notifications = document.querySelectorAll(".notification")
      notifications.forEach((notification) => {
        const rect = (notification as HTMLElement).getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        ;(notification as HTMLElement).style.setProperty("--mouse-x", `${x}%`)
        ;(notification as HTMLElement).style.setProperty("--mouse-y", `${y}%`)
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div id="notifications">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          isFadingOut={fadingNotifications.includes(notification.id)}
        />
      ))}
    </div>
  )
}

export default NotificationsContainer

