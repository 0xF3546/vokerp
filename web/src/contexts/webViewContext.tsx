import { createContext, useContext, useState, useRef, createRef, cloneElement, useEffect, useCallback } from "react";
import { ReactNode } from "react";
import { Component } from "../utils/Component";
import CharCreator from "../views/CharCreator";
import Hud from "../views/hud/Hud";
import { ViewComponent } from "../@types/ViewComponent";

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

const useWebView = () => useContext(webViewContext);

const WebViewProvider = ({ children }: { children: ReactNode }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const refs = useRef<{ [key: string]: React.RefObject<any> }>({});

  useEffect(() => {
    if (components.length === 0) {
      console.log("Adding components...");
      const charCreatorComponent = new Component(<CharCreator />, "charcreator");
      const hudComponent = new Component(<Hud />, "hud");
      console.log("CharCreator Component:", charCreatorComponent);
      console.log("Hud Component:", hudComponent);
      addComponent(charCreatorComponent);
      addComponent(hudComponent);
    }
  }, []);
  

  const addComponent = useCallback((component: Component) => {
    if (!component.name || typeof component.name !== "string") {
      console.error("Component benötigt einen gültigen Namen als String.");
      return;
    }
  
    setComponents((prevComponents) => {
      if (prevComponents.some((c) => c.name === component.name)) {
        console.warn(`Component mit Name "${component.name}" existiert bereits.`);
        return prevComponents;
      }
  
      if (!refs.current[component.name]) {
        refs.current[component.name] = createRef<ViewComponent>();
      }
  
      component.ref = refs.current[component.name];
      const clonedComponent = cloneElement(component.view, { ref: component.ref });
      component.view = clonedComponent;
  
      return [...prevComponents, component];
    });
  }, []);
  

  const showComponent = useCallback((name: string, delay = 500) => {
    console.log(`Showing component: ${name}`);
    setComponents((prevComponents) =>
      prevComponents.map((component) => {
        if (component.name === name) {
          console.log(`Setting ${name} to active`);
          component.delay = delay;
          component.isActive = true;
          component.ref?.current?.show?.(delay);
        }
        return component;
      })
    );
  }, []);
  
  const hideComponent = useCallback((name: string, delay = 500) => {
    console.log(`Hiding component: ${name}`);
    setComponents((prevComponents) =>
      prevComponents.map((component) => {
        if (component.name === name) {
          console.log(`Setting ${name} to inactive`);
          component.delay = delay;
          component.isActive = false;
          component.ref?.current?.hide?.(delay);
        }
        return component;
      })
    );
  }, []);
  
  const hideAllWebViews = useCallback(() => {
    console.log("Hiding all web views");
    setComponents((prevComponents) =>
      prevComponents.map((component) => {
        console.log(`Hiding ${component.name}`);
        component.isActive = false;
        component.ref?.current?.hide?.();
        return component;
      })
    );
  }, []);

  const getComponent = useCallback((name: string) => {
    return components.find((component) => component.name === name);
  }, [components]);

  const getComponents = useCallback(() => {
    return components;
  }, [components]);

  const getRef = useCallback((name: string) => {
    return refs.current[name];
  }, []);

  const emit = useCallback((eventName: string, ...args: any[]) => {
    console.log(`Emitting event: ${eventName}, aktuelle Komponenten:`, components);
  
    if (components.length === 0) {
      console.warn("❌ Keine Komponenten vorhanden!");
      return;
    }
  
    components.forEach((component) => {
      console.log(`🔹 Event "${eventName}" an ${component.name} senden`);
      if (!component.emit) {
        console.warn(`⚠ Component ${component.name} hat keine emit-Methode.`);
        return;
      }
      component.emit(eventName, ...args);
    });
  }, [components]);
  

  const getActiveComponents = useCallback(() => {
    return components.filter((component) => component.isActive);
  }, [components]);

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

export { WebViewProvider, useWebView };