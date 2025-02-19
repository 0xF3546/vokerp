import { createContext, useContext, useState, useRef, createRef, cloneElement } from "react";
import { ReactNode } from "react";
import { Component } from "../utils/Component";

interface WebViewContextProps {
  activeComponents: Component[];
  addComponent: (component: Component) => void;
  showComponent: (name: string, delay?: number) => void;
  hideComponent: (name: string, delay?: number) => void;
  hideAllWebViews: () => void;
  getComponents: () => Component[];
  getComponent: (name: string) => Component | undefined;
  getRef: (name: string) => React.RefObject<any> | undefined;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  emit: (eventName: string, ...args: any[]) => void;
}

const webViewContext = createContext<WebViewContextProps>({
  activeComponents: [],
  addComponent: () => {},
  showComponent: () => {},
  hideComponent: () => {},
  hideAllWebViews: () => {},
  getComponents: () => [],
  getComponent: () => undefined,
  getRef: () => undefined,
  on: () => {},
  emit: () => {},
});

export const useWebView = () => useContext(webViewContext);

export const WebViewProvider = ({ children }: { children: ReactNode }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [listeners, setListeners] = useState<{ [key: string]: ((...args: any[]) => void)[] }>({});
  const refs = useRef<{ [key: string]: React.RefObject<any> }>({});

  function addComponent(component: Component) {
    if (!component.name) return;
    
    if (!refs.current[component.name]) {
        refs.current[component.name] = createRef<any>();
    }
    
    component.ref = refs.current[component.name];
    
    const clonedComponent = cloneElement(component.component, { ref: component.ref });
    component.component = clonedComponent;
    
    setComponents((prevComponents) => [...prevComponents, component]);
}


  function showComponent(name: string, delay = 500) {
    setComponents((prevComponents) =>
      prevComponents.map((component) => {
        if (component.name === name) {
          component.Visible = true;
          component.delay = delay;
          component.ref?.current?.show?.(delay);
        }
        return component;
      })
    );
  }

  function hideComponent(name: string, delay = 500) {
    setComponents((prevComponents) =>
      prevComponents.map((component) => {
        if (component.name === name) {
          component.Visible = false;
          component.delay = delay;
          component.ref?.current?.hide?.(delay);
        }
        return component;
      })
    );
  }

  function hideAllWebViews() {
    setComponents((prevComponents) =>
      prevComponents.map((component) => {
        if (component.closeable) {
          component.Visible = false;
          component.ref?.current?.hide?.();
        }
        return component;
      })
    );
  }

  function getComponent(name: string) {
    return components.find(
      (component) => component.name === name
    );
  }

  function getComponents() {
    return components;
  }

  function getRef(name: string) {
    return refs.current[name];
  }

  function on(eventName: string, callback: (...args: any[]) => void) {
    setListeners((prevListeners) => ({
      ...prevListeners,
      [eventName]: [...(prevListeners[eventName] || []), callback],
    }));
  }

  function emit(eventName: string, ...args: any[]) {
    components.forEach((component) => {
        component.emit(eventName, ...args);
    });
}


  return (
    <webViewContext.Provider
      value={{
        activeComponents: components,
        addComponent,
        showComponent,
        hideComponent,
        hideAllWebViews,
        getComponent,
        getComponents,
        getRef,
        on,
        emit,
      }}
    >
      {children}
    </webViewContext.Provider>
  );
};
