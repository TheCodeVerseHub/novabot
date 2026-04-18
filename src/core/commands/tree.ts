import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption, OptionType, OptionTypeMap } from "./arguments";

interface RunnableCommand {
  execute(interaction: ChatInputCommandInteraction, options: Record<string, any>): Promise<void>;
  getOptions(): CommandOption<OptionType>[];
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

abstract class LeafCommandNode extends CommandNode implements RunnableCommand {
  private readonly options: CommandOption<OptionType>[] = [];

  protected addOption<T extends OptionType>(
    name: string,
    description: string,
    type: T,
    required: boolean,
    defaultValue?: OptionTypeMap[T]
  ) {
    this.options.push({ name, description, type, required, defaultValue });
  }

  public getOptions(): CommandOption<OptionType>[] {
    return this.options;
  }

  abstract execute(interaction: ChatInputCommandInteraction, options: Record<string, any>): Promise<void>;
}

abstract class RootCommand extends LeafCommandNode {}

abstract class SubCommand extends LeafCommandNode {}

class SubCommandGroup extends CommandNode {
  private readonly subCommands: SubCommand[];

  public constructor(name: string, description: string, subCommands?: SubCommand[]) {
    super(name, description);
    this.subCommands = subCommands ?? [];
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
    this.subCommands = subCommands ?? [];
    this.subCommandGroups = subCommandGroups ?? [];
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
