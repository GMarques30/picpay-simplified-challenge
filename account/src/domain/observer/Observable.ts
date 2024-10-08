import { DomainEvent } from "../event/DomainEvent";

export class Observable {
  observers: { event: string; callback: Function }[];

  constructor() {
    this.observers = [];
  }

  register(event: string, callback: Function) {
    this.observers.push({ event, callback });
  }

  async notify(event: DomainEvent) {
    for (const observer of this.observers) {
      if (observer.event === event.event) {
        await observer.callback(event);
      }
    }
  }
}
