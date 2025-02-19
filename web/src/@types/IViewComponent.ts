export interface IViewComponent {
    hide: (delay?: number) => void;
    show: (delay?: number) => void;
    emit: (eventName: string, ...args: any[]) => void;
  }
  