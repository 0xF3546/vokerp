import React, { useEffect, useState } from "react";
import "./App.css";
import { useWebView } from "../contexts/webViewContext";
import { useNotification } from "../contexts/notificationContext";
import { setInternalBufferSize } from "typeorm/driver/mongodb/bson.typings";


const App: React.FC = () => {
  const webView = useWebView();
  const notify = useNotification();

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