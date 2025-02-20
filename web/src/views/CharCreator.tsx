import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";

const CharCreator = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
  
    useImperativeHandle(ref, () => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
      emit: (eventName: string, ...args: any[]) => {
        if (eventName === "CHAR_UPDATE") {
          console.log("Charakterdaten aktualisieren mit:", args);
        }
      },
    }));
  
    return visible ? (
      <div>
        <h2>CharCreator UI</h2>
        <p>Hier kommen die Inhalte des CharCreators hin!</p>
      </div>
    ) : null;
  });
  

export default CharCreator;
