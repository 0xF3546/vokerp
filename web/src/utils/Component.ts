import { createRef } from "react";
import { useWebView } from "../contexts/webViewContext";
import { IViewComponent } from "../@types/IViewComponent";

export class Component {
    private _visible;
    public name: string | null;
    public delay;
    public closeable;
    public hide;
    public component: JSX.Element;
    public ref?: React.RefObject<IViewComponent>;

    constructor(component: JSX.Element, name: string | null = null, closeable: boolean = true, hide: boolean = true) {
        this._visible = false;
        this.component = component;
        this.name = name;
        this.delay = 500;
        this.closeable = closeable;
        this.hide = hide;
        this.ref = createRef<any>();
    }

    set Visible(value) {
        this._visible = value;
    }

    get Visible() {
        return this._visible;
    }

    emit(eventName: string, ...args: any[]) {
        this.ref?.current?.emit?.(eventName, ...args);
    }
}
