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
      console.log(data.args);
      console.log("Received event:", data.event);
      data.args = JSON.parse(data.args);
      console.log("Received message:", data.args);
      if (data.event === "notification") {
        notify.showNotification(data.args.title, data.args.message, data.args.color, data.args.delay);
        return;
      } else if (data.event === "showComponent") {
        webView.showComponent(data.args);
        return;
      } else if (data.event === "hideComponent") {
        webView.hideComponent(data.args);
        return;
      }
      webView.emit(data.event, data.args);
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    webView.showComponent("hud");
    /*setTimeout(() => {
      webView.showComponent("charcreator");
    }, 1000);*/
  }, []);

  return (
    <div>
      {webView.getActiveComponents().map((component, index) => (
        <div key={index}>
          {component.view}
        </div>
      ))}
    </div>
  );
};

export default App;