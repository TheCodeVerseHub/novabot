import { Events } from "discord.js";

/**
 * The base class for event listeners.
 *
 * Example usage:
 * ```ts
 * class MyListener extends EventListener<[Client]> {
 *   constructor() {
 *     super(Events.ClientReady);
 *   }
 *
 *   public async listener(client: Client): Promise<void> {
 *     console.log(`Ready! Logged in as ${client.user?.tag}`);
 *   }
 * }
 * ```
 *
 * @template TArgs The type of the arguments passed to the listener function.
 */
export default abstract class EventListener<TArgs extends any[]> {
  private readonly event: Events;

  constructor(event: Events) {
    this.event = event;
  }

  public getEvent(): Events {
    return this.event;
  }

  public abstract listener(...args: TArgs): Promise<void>;
}

/**
 * This bot provides two ways of creating listeners.
 * This method creates a new **simple** EventListener class based on the given event type and listener function.
 *
 * Example usage:
 * ```ts
 * const MyListener = listener(Events.ClientReady, async (client: Client) => {
 *   console.log(`Ready! Logged in as ${client.user?.tag}`);
 * });
 * ```
 *
 * Alternative declaration using base class:
 * ```ts
 * class MyListener extends EventListener<[Client]> {
 *   constructor() {
 *     super(Events.ClientReady);
 *   }
 *
 *   public async listener(client: Client): Promise<void> {
 *     console.log(`Ready! Logged in as ${client.user?.tag}`);
 *   }
 * }
 * ```
 *
 * @template TArgs The type of the arguments passed to the listener function.
 * @param eventType The event type to listen for.
 * @param listener The function to call when the event is triggered.
 * @returns A new EventListener class.
 */
export function listener<TArgs extends any[]>(
  eventType: Events,
  listener: (...args: TArgs) => Promise<void>
): new () => EventListener<TArgs> {
  return class extends EventListener<TArgs> {
    constructor() {
      super(eventType);
    }

    public async listener(...args: TArgs): Promise<void> {
      await listener(...args);
    }
  };
}
