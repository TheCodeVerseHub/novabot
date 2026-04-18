import { ChatInputCommandInteraction } from "discord.js";

interface RunnableCommand {
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

abstract class CommandNode {
  private readonly name: string;
  private readonly description: string;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }
}

abstract class RootCommand extends CommandNode implements RunnableCommand {
  abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

abstract class SubCommand extends CommandNode implements RunnableCommand {
  abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

class SubCommandGroup extends CommandNode {
  private readonly subCommands: SubCommand[];

  public constructor(name: string, description: string, subCommands?: SubCommand[]) {
    super(name, description);
    this.subCommands = subCommands??[];
  }

  public getSubCommands(): readonly SubCommand[] {
    return this.subCommands as readonly SubCommand[];
  }

  public addSubCommand(command: SubCommand): void {
    this.subCommands.push(command);
  }
}

class RootCommandGroup extends CommandNode {
  private readonly subCommands: SubCommand[];
  private readonly subCommandGroups: SubCommandGroup[];

  public constructor(
    name: string,
    description: string,
    subCommands?: SubCommand[],
    subCommandGroups?: SubCommandGroup[]
  ) {
    super(name, description);
    this.subCommands = subCommands??[];
    this.subCommandGroups = subCommandGroups??[];
  }

  public getSubCommands(): readonly SubCommand[] {
    return this.subCommands as readonly SubCommand[];
  }

  public getSubCommandGroups(): readonly SubCommandGroup[] {
    return this.subCommandGroups as readonly SubCommandGroup[];
  }

  public addSubCommand(command: SubCommand): void {
    this.subCommands.push(command);
  }

  public addSubCommandGroup(group: SubCommandGroup): void {
    this.subCommandGroups.push(group);
  }
}

export { CommandNode, RootCommand, SubCommand, SubCommandGroup, RootCommandGroup, RunnableCommand };
