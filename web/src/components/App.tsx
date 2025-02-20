import React, { useEffect, useState } from "react";
import "./App.css";
import { useWebView } from "../contexts/webViewContext";


const App: React.FC = () => {
  const webView = useWebView();

  function handleMessage(event: MessageEvent) {
    const data = event.data;
    if (data.event !== undefined) {
      webView.emit(data.event, JSON.parse(data.args));
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      webView.showComponent("hud");
    }, 1000);
  }, []);

  return (
    <div>
      hi
      {webView.getActiveComponents().map((component, index) => (
        <div key={index}>
          {component.view}
        </div>
      ))}
    </div>
  );
};

export default App;