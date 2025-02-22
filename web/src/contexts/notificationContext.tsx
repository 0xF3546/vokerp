import { createContext, ReactNode, useContext, useState } from "react";
import Notification, { NotificationProps } from "../components/notification/Notification";
import { useWebView } from "./webViewContext";

interface NotificationContextProps {
    showNotification: (title: string | null, message: string | null, color: string, delay: number) => void;
}

const notificationContext = createContext<NotificationContextProps>({
    showNotification: () => { },
});

const useNotification = () => useContext(notificationContext);

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);
    const webView = useWebView();

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

    const isChatActive = () => {
        return webView.getActiveComponents().filter(x => x.name === 'chat').length > 0;
    }

    return (
        <notificationContext.Provider value={{ showNotification }}>
            <div id={`notifications`} className={`${isChatActive() && 'mt-10'}`}>
                {notifications.map((notification) => (
                    <Notification key={notification.id} {...notification} />
                ))}
            </div>
            {children}
        </notificationContext.Provider>
    );
};

export { NotificationProvider, useNotification };