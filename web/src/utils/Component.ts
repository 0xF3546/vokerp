import { createRef } from "react";
import { useWebView } from "../contexts/webViewContext";
import { ViewComponent } from "../@types/ViewComponent";

export class Component {
    public name: string | null;
    public delay;
    public closeable;
    public hide;
    public component: JSX.Element;
    public ref?: React.RefObject<ViewComponent>;

    constructor(component: JSX.Element, name: string | null = null, closeable: boolean = true, hide: boolean = true) {
        this.component = component;
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
