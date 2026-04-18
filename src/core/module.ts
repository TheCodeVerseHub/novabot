import type EventListener from "./listener.ts";
import type { CommandProps, RootCommand, RootCommandGroup } from "./commands/tree";

type ModuleCommand = RootCommand<CommandProps> | RootCommandGroup;

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
  private readonly commands: ModuleCommand[];
  private readonly listeners: EventListener<any[]>[];

  public constructor() {
    this.commands = [];
    this.listeners = [];
  }

  public getCommands(): readonly ModuleCommand[] {
    return this.commands as readonly ModuleCommand[];
  }

  public getListeners(): readonly EventListener<any[]>[] {
    return this.listeners as readonly EventListener<any[]>[];
  }

  public addCommand(command: ModuleCommand): void {
    this.commands.push(command);
  }

  public addListener(listener: EventListener<any[]>): void {
    this.listeners.push(listener);
  }
}
