import React from "react";
import "./notification.css";

export interface NotificationProps {
    id: number; // Eindeutige ID
    title: string | null;
    message: string | null;
    color: string;
    delay: number;
    isFadingOut?: boolean; // Neuer Zustand für das Ausblenden
}

const Notification = ({ title, message, color, isFadingOut }: NotificationProps) => {
    return (
        <div
            className={`notification ${isFadingOut ? "fadeOut" : ""}`} // Füge die fadeOut-Klasse hinzu
            style={{ borderBottom: `5px solid ${color}` }}
        >
            <div className="notification-title" style={{ color }}>{title}</div>
            <p className="notification-message">{message}</p>
        </div>
    );
};

export default Notification;