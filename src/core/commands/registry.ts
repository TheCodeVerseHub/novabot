import { RunnableCommand } from "./tree";

export interface RegistryCommand extends RunnableCommand {
  getFullName(): string;
}

export default class CommandRegistry {
  private readonly commands: Map<string, RunnableCommand>;

  public constructor() {
    this.commands = new Map<string, RunnableCommand>();
  }

  public registerCommand(command: RegistryCommand): void {
    this.commands.set(command.getFullName(), command);
  }

  public unregisterCommand(fullName: string): void {
    this.commands.delete(fullName);
  }

  public getCommand(fullName: string): RunnableCommand | undefined {
    return this.commands.get(fullName);
  }
}
