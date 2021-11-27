export class Subscription {
  readonly id: string; // readonly once assigned CHECK THIS
  readonly arguments?: any; // readonly once assigned CHECK THIS

  constructor(id: string, args?: any) {
    this.id = id;
    this.arguments = args;
  }

  on() {}

  // Uses same parameters
  resubscribe(callback?: () => void) {}

  unsubscribe(callback?: () => void) {}
}
