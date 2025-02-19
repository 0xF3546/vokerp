import { createContext, useContext, useState, useRef, createRef, cloneElement, useEffect } from "react";
import { ReactNode } from "react";
import { Component } from "../utils/Component";
import CharCreator from "../views/CharCreator";
import Hud from "../views/Hud";

interface WebViewContextProps {
  getActiveComponents: () => Component[];
  addComponent: (component: Component) => void;
  showComponent: (name: string, delay?: number) => void;
  hideComponent: (name: string, delay?: number) => void;
  hideAllWebViews: () => void;
  getComponents: () => Component[];
  getComponent: (name: string) => Component | undefined;
  getRef: (name: string) => React.RefObject<any> | undefined;
  emit: (eventName: string, ...args: any[]) => void;
}

const webViewContext = createContext<WebViewContextProps>({
  getActiveComponents: () => [],
  addComponent: () => {},
  showComponent: () => {},
  hideComponent: () => {},
  hideAllWebViews: () => {},
  getComponents: () => [],
  getComponent: () => undefined,
  getRef: () => undefined,
  emit: () => {},
});

export const useWebView = () => useContext(webViewContext);

export const WebViewProvider = ({ children }: { children: ReactNode }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const refs = useRef<{ [key: string]: React.RefObject<any> }>({});

  useEffect(() => {
    console.log("Adding components...");
    const charCreatorComponent = new Component(<CharCreator />, "charcreator");
    const hudComponent = new Component(<Hud />, "hud");
    console.log("CharCreator Component:", charCreatorComponent);
    console.log("Hud Component:", hudComponent);
    addComponent(charCreatorComponent);
    addComponent(hudComponent);
    showComponent("hud");
  }, []);
  
  function addComponent(component: Component) {
    if (!component.name) return;
  
    if (components.some((c) => c.name === component.name)) {
      console.warn(`Component with name "${component.name}" already exists.`);
      return;
    }
  
    if (!refs.current[component.name]) {
      refs.current[component.name] = createRef<any>();
    }
  
    component.ref = refs.current[component.name];
  
    const clonedComponent = cloneElement(component.view, { ref: component.ref });
    component.view = clonedComponent;

    component.isActive = false;
    component.ref?.current?.hide?.();
  
    setComponents((prevComponents) => [...prevComponents, component]);
  }

  function showComponent(name: string, delay = 500) {
    setComponents((prevComponents) =>
      prevComponents.map((component) => {
        if (component.name === name) {
          component.delay = delay;
          component.isActive = true;
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
          component.delay = delay;
          component.isActive = false;
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
          component.isActive = false;
          component.ref?.current?.hide?.();
        }
        return component;
      })
    );
  }

  function getComponent(name: string) {
    return components.find((component) => component.name === name);
  }

  function getComponents() {
    return components;
  }

  function getRef(name: string) {
    return refs.current[name];
  }

  function emit(eventName: string, ...args: any[]) {
    components.forEach((component) => {
      component.emit(eventName, ...args);
    });
  }

  function getActiveComponents() {
    return components.filter((component) => component.isActive);
  }

  return (
    <webViewContext.Provider
      value={{
        addComponent,
        showComponent,
        hideComponent,
        hideAllWebViews,
        getComponent,
        getComponents,
        getRef,
        emit,
        getActiveComponents
      }}
    >
      {children}
    </webViewContext.Provider>
  );
};