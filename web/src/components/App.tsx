import React, { useEffect, useState } from "react";
import "./App.css";
import { useWebView } from "../contexts/webViewContext";
import { useNotification } from "../contexts/notificationContext";


const App: React.FC = () => {
  const webView = useWebView();
  const notify = useNotification();

  function handleMessage(event: MessageEvent) {
    const data = event.data;
    if (data.event !== undefined) {
      if (data.event === "notification") {
        data.args = JSON.parse(data.args);
        notify.showNotification(data.args.title, data.args.message, data.args.color, data.args.delay);
        return;
      } else if (data.event === "showComponent") {
        webView.showComponent(data.args);
        return;
      } else if (data.event === "hideComponent") {
        webView.hideComponent(data.args);
        return;
      }
      webView.emit(data.event, JSON.parse(data.args));
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      notify.showNotification("Test", "This is a test notification", "green", 5000);
      webView.showComponent("hud");
    }, 1000);
    setTimeout(() => {
      notify.showNotification("Test", "This is a test 35z", "green", 5000);
    }, 2000);
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