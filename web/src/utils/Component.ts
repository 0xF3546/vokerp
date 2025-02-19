import { createRef } from "react";

export class Component {
    public name: string | null;
    public delay: number;
    public closeable: boolean;
    public hide: boolean;
    public view: JSX.Element;
    public ref?: React.RefObject<any>;
    public isActive?: boolean;
  
    constructor(
      component: JSX.Element,
      name: string | null = null,
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
      this.ref?.current?.emit?.(eventName, ...args);
    }
  }