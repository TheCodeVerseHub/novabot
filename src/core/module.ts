import type EventListener from "./listener.ts";

/**
 * A container for instances of commands and event listeners.
 *
 * Example usage:
 * ```ts
 * const module = new Module();
 * module.addCommand(new MyCommand());
 * module.addListener(new MyListener());
 * ```
 *
 * It should be initialized by a Feature.
 * @see {@link Feature}
 */
export default class Module {
  // TODO: Command system integration
  private readonly commands: any[];
  private readonly listeners: EventListener<any[]>[];

  constructor() {
    this.commands = [];
    this.listeners = [];
  }

  // TODO: Command system integration
  public getCommands(): any[] {
    return this.commands;
  }

  public getListeners(): EventListener<any[]>[] {
    return this.listeners;
  }

  // TODO: Command system integration
  public addCommand(command: any): void {
    this.commands.push(command);
  }

  public addListener(listener: EventListener<any[]>): void {
    this.listeners.push(listener);
  }
}
