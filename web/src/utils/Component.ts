import { createRef } from "react";

export class Component {
    public name: string;
    public delay: number;
    public closeable: boolean;
    public hide: boolean;
    public view: JSX.Element;
    public ref?: React.RefObject<any>;
    public isActive?: boolean;
  
    constructor(
      component: JSX.Element,
      name: string,
      closeable: boolean = true,
      hide: boolean = true
    ) {
      this.view = component;
      this.name = name;
      this.delay = 500;
      this.closeable = closeable;
      this.hide = hide;
      this.ref = createRef<any>();
    }
  
    emit(eventName: string, ...args: any[]) {
      console.log(`Event "${eventName}" wird an ${this.name} gesendet`, args);
      this.ref?.current?.emit?.(eventName, ...args);
    }
  }