// EventListener.ts
type Listener = (...args: any[]) => void;

class EventListener {
  private static instance: EventListener;
  private listeners: { [eventName: string]: Listener[] } = {};

  private constructor() {}

  public static getInstance(): EventListener {
    if (!EventListener.instance) {
      EventListener.instance = new EventListener();
    }
    return EventListener.instance;
  }

  public listen(eventName: string, listener: Listener): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  public remove(eventName: string, listener?: Listener): void {
    if (this.listeners[eventName]) {
      if (listener) {
        this.listeners[eventName] = this.listeners[eventName].filter(
          (l) => l !== listener
        );
      } else {
        this.listeners[eventName] = [];
      }
    }
  }

  public emit(eventName: string, ...args: any[]): void {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((listener) => listener(...args));
    }
  }
}

export const eventListener = EventListener.getInstance();