import { createContext, ReactNode, useContext, useState } from "react";
import Notification, { NotificationProps } from "../components/notification/Notification";

interface NotificationContextProps {
    showNotification: (title: string | null, message: string | null, color: string, delay: number) => void;
}

const notificationContext = createContext<NotificationContextProps>({
    showNotification: () => { },
});

const useNotification = () => useContext(notificationContext);

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    const showNotification = (title: string | null, message: string | null, color: string, delay: number) => {
        const notification: NotificationProps = {
            id: Date.now(), // Eindeutige ID für jede Benachrichtigung
            title,
            message,
            color,
            delay,
        };
        setNotifications((prev) => [...prev, notification]);

        // Starte den Timer für das Ausblenden
        setTimeout(() => {
            // Markiere die Benachrichtigung als "ausblendend"
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notification.id ? { ...n, isFadingOut: true } : n
                )
            );

            // Entferne die Benachrichtigung nach der Animation
            setTimeout(() => {
                setNotifications((prev) =>
                    prev.filter((n) => n.id !== notification.id)
                );
            }, 500); // Wartezeit für die fadeOut-Animation (0.5s)
        }, delay);
    };

    return (
        <notificationContext.Provider value={{ showNotification }}>
            <div id="notifications">
                {notifications.map((notification) => (
                    <Notification key={notification.id} {...notification} />
                ))}
            </div>
            {children}
        </notificationContext.Provider>
    );
};

export { NotificationProvider, useNotification };