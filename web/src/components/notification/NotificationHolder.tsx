import "./notification.css";

interface NotificationHolderProps {
    title: string | null;
    message: string | null;
    color: string;
}

const NotificationHolder = ({ title, message, color }: NotificationHolderProps) => {
    return (
        <>
            <div className="notification-title" style={{ color: color }}>{title}</div>
            <p className="notification-message">{message}</p>
        </>
    );
};

export default NotificationHolder;