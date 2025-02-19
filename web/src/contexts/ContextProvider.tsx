import { ReactNode } from "react";
import { WebViewProvider } from "./webViewContext";

const ContextProvider = ({children} : {children: ReactNode}) => {
    return (
        <>
        <WebViewProvider>
            {children}
        </WebViewProvider>
        </>
    )
}

export default ContextProvider;