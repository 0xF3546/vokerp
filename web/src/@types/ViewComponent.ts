export interface ViewComponent {
    hide: (delay?: number) => void;
    show: (delay?: number) => void;
    emit: (eventName: string, ...args: any[]) => void;
  }
  