import React, { useEffect, useState } from "react";
import "./App.css";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { useWebView } from "../contexts/webViewContext";
import { Component } from "../utils/Component";
// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

interface ReturnClientDataCompProps {
  data: unknown;
}

const ReturnClientDataComp: React.FC<ReturnClientDataCompProps> = ({
  data,
}) => (
  <>
    <h5>Returned Data:</h5>
    <pre>
      <code>{JSON.stringify(data, null)}</code>
    </pre>
  </>
);

interface ReturnData {
  x: number;
  y: number;
  z: number;
}

const App: React.FC = () => {
  const [clientData, setClientData] = useState<ReturnData | null>(null);
  const webView = useWebView();

  window.addEventListener('message', function (event) {
    const data = event.data;
    if (data.event !== undefined) {
      webView.emit(data.event, data.args);
    }
  })

  const handleGetClientData = () => {
    fetchNui<ReturnData>("getClientData")
      .then((retData) => {
        console.log("Got return data from client scripts:");
        console.dir(retData);
        setClientData(retData);
      })
      .catch((e) => {
        console.error("Setting mock data due to error", e);
        setClientData({ x: 500, y: 300, z: 200 });
      });
  };

  return (
    <div className="nui-wrapper">
      {webView.getActiveComponents().map((component, index) => (
        <div key={index}>
          {component.view}
        </div>
      ))}
    </div>
  );
};

export default App;
