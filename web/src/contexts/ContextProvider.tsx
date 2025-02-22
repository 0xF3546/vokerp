import { ReactNode } from "react";
import { WebViewProvider } from "./webViewContext";
import { NotificationProvider } from "./notificationContext";

const ContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <WebViewProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </WebViewProvider>
        </>
    )
}

export default ContextProvider;