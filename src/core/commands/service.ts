import type { RootCommand, RootCommandGroup, RunnableCommand, CommandNode } from "./tree";
import CommandRegistry from "./registry";
import CommandTreeAdapter from "./adapter";
import CommandHandler from "./handler";

export default class CommandService {
  private readonly registry: CommandRegistry;
  private readonly adapter: CommandTreeAdapter;
  private readonly handler: CommandHandler;

  private readonly roots: (RootCommand | RootCommandGroup)[];

  public constructor(registry: CommandRegistry) {
    this.registry = registry;
    this.adapter = new CommandTreeAdapter();
    this.roots = [];
    this.handler = new CommandHandler(this);
  }

  public registerCommands(tree: RootCommand | RootCommandGroup): void {
    this.roots.push(tree);
    const commands = this.adapter.collectCommands(tree);
    for (const command of commands.values()) {
      this.registry.registerCommand(command);
    }
  }

  public unregisterCommands(tree: RootCommand | RootCommandGroup): void {
    this.roots.splice(this.roots.indexOf(tree), 1);
    const commands = this.adapter.collectCommands(tree);
    for (const command of commands.values()) {
      this.registry.unregisterCommand(command.getFullName());
    }
  }

  public getCommand(fullName: string): RunnableCommand | undefined {
    return this.registry.getCommand(fullName);
  }

  public getTrees(): readonly CommandNode[] {
    return this.roots as readonly CommandNode[];
  }

  public getHandler(): CommandHandler {
    return this.handler;
  }
}
