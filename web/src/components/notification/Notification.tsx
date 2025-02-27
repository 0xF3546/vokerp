import type React from "react"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import "./notification.css"

export interface NotificationProps {
  id: number
  title: string | null
  message: string | null
  color: string
  delay: number
  isFadingOut?: boolean
  type?: "success" | "error" | "info" | "warning"
}

const Notification = ({ title, message, color, isFadingOut, type = "info" }: NotificationProps) => {
  // Konvertiere Hex zu RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
      : "255, 62, 62" // Fallback rot
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4" />
      case "error":
        return <AlertCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "info":
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const style = {
    "--notification-color": color,
    "--notification-rgb": hexToRgb(color),
  } as React.CSSProperties

  return (
    <div className={`notification ${isFadingOut ? "fadeOut" : ""}`} style={style}>
      <div className="notification-glow" />
      <div className="notification-border-glow" />
      <div className="notification-content">
        <div className="notification-icon-wrapper">{getIcon()}</div>
        <div className="notification-text">
          {title && <div className="notification-title">{title}</div>}
          <p className="notification-message">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default Notification

