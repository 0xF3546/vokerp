export interface IViewComponent {
    hide: () => void;
    show: () => void;
    emit: (eventName: string, ...args: any[]) => void;
  }
  