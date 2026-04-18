import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption, OptionType, ResolveOptions } from "./arguments";

export type CommandProps = readonly CommandOption<OptionType>[];

interface RunnableCommand<TOptions extends CommandProps = []> {
  execute(interaction: ChatInputCommandInteraction, options: Record<string, any>): Promise<void>;
  getOptions(): TOptions;
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

abstract class LeafCommandNode<TOptions extends CommandProps = []>
  extends CommandNode
  implements RunnableCommand<TOptions>
{
  private readonly options: TOptions;

  public constructor(name: string, description: string, options: TOptions) {
    super(name, description);
    this.options = options;
  }

  public getOptions(): TOptions {
    return this.options;
  }

  abstract execute(interaction: ChatInputCommandInteraction, options: ResolveOptions<TOptions>): Promise<void>;
}

abstract class RootCommand<TOptions extends CommandProps> extends LeafCommandNode<TOptions> {}

abstract class SubCommand<TOptions extends CommandProps> extends LeafCommandNode<TOptions> {}

class SubCommandGroup extends CommandNode {
  private readonly subCommands: SubCommand<CommandProps>[];

  public constructor(name: string, description: string, subCommands?: SubCommand<CommandProps>[]) {
    super(name, description);
    this.subCommands = subCommands ?? [];
  }

  public getSubCommands(): readonly SubCommand<CommandProps>[] {
    return this.subCommands as readonly SubCommand<CommandProps>[];
  }

  public addSubCommand(command: SubCommand<CommandProps>): void {
    this.subCommands.push(command);
  }
}

class RootCommandGroup extends CommandNode {
  private readonly subCommands: SubCommand<CommandProps>[];
  private readonly subCommandGroups: SubCommandGroup[];

  public constructor(
    name: string,
    description: string,
    subCommands?: SubCommand<CommandProps>[],
    subCommandGroups?: SubCommandGroup[]
  ) {
    super(name, description);
    this.subCommands = subCommands ?? [];
    this.subCommandGroups = subCommandGroups ?? [];
  }

  public getSubCommands(): readonly SubCommand<CommandProps>[] {
    return this.subCommands as readonly SubCommand<CommandProps>[];
  }

  public getSubCommandGroups(): readonly SubCommandGroup[] {
    return this.subCommandGroups as readonly SubCommandGroup[];
  }

  public addSubCommand(command: SubCommand<CommandProps>): void {
    this.subCommands.push(command);
  }

  public addSubCommandGroup(group: SubCommandGroup): void {
    this.subCommandGroups.push(group);
  }
}

export { CommandNode, RootCommand, SubCommand, SubCommandGroup, RootCommandGroup, RunnableCommand };
