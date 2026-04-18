import type { RunnableCommand, CommandNode, SubCommand, CommandProps } from "./tree";
import { RootCommand, RootCommandGroup } from "./tree";
import CommandRegistry from "./registry";
import CommandTreeAdapter from "./adapter";
import CommandHandler from "./handler";
import {
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { CommandOption, OptionType } from "./arguments";

const optionAppliers = {
  [OptionType.String]: "addStringOption",
  [OptionType.Integer]: "addIntegerOption",
  [OptionType.Number]: "addNumberOption",
  [OptionType.Boolean]: "addBooleanOption",
  [OptionType.User]: "addUserOption",
  [OptionType.Channel]: "addChannelOption",
  [OptionType.Role]: "addRoleOption",
  [OptionType.Mentionable]: "addMentionableOption",
  [OptionType.Attachment]: "addAttachmentOption",
} as const;

export default class CommandService {
  private readonly registry: CommandRegistry;
  private readonly adapter: CommandTreeAdapter;
  private readonly handler: CommandHandler;

  private readonly roots: (RootCommand<CommandProps> | RootCommandGroup)[];

  public constructor() {
    this.registry = new CommandRegistry();
    this.adapter = new CommandTreeAdapter();
    this.roots = [];
    this.handler = new CommandHandler(this);
  }

  /**
   * Collects all slash commands in the given tree and returns them as a JSON body.
   *
   * @returns A JSON body containing all the slash commands in the service.
   */
  public collectSlashCommands(): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    const array = [];
    for (const root of this.roots) {
      if (root instanceof RootCommandGroup) {
        const builder = new SlashCommandBuilder();
        builder.setName(root.getName());
        builder.setDescription(root.getDescription());
        for (const group of root.getSubCommandGroups()) {
          const groupBuilder = new SlashCommandSubcommandGroupBuilder();
          groupBuilder.setName(group.getName());
          groupBuilder.setDescription(group.getDescription());
          for (const command of group.getSubCommands()) {
            const commandBuilder = new SlashCommandSubcommandBuilder();
            groupBuilder.addSubcommand(this.collectLeaf(command) as SlashCommandSubcommandBuilder);
          }
          builder.addSubcommandGroup(groupBuilder);
        }
        for (const command of root.getSubCommands()) {
          const commandBuilder = new SlashCommandSubcommandBuilder();
          builder.addSubcommand(this.collectLeaf(command) as SlashCommandSubcommandBuilder);
        }
        array.push(builder);
      } else {
        array.push(this.collectLeaf(root) as SlashCommandBuilder);
      }
    }
    return array.map((builder) => builder.toJSON());
  }

  private collectLeaf(
    command: SubCommand<CommandProps> | RootCommand<CommandProps>
  ): SlashCommandBuilder | SlashCommandSubcommandBuilder {
    const builder = command instanceof RootCommand ? new SlashCommandBuilder() : new SlashCommandSubcommandBuilder();

    builder.setName(command.getName()).setDescription(command.getDescription());

    for (const option of command.getOptions()) {
      this.applyOption(builder, option);
    }

    return builder;
  }

  private applyOption(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder, option: CommandOption<OptionType>) {
    const method = optionAppliers[option.type];

    // Yes, it uses any. You don't get to judge me.
    (builder as any)[method]((b: any) =>
      b.setName(option.name).setDescription(option.description).setRequired(option.required)
    );
  }

  public registerCommands(tree: RootCommand<CommandProps> | RootCommandGroup): void {
    this.roots.push(tree);
    const commands = this.adapter.collectCommands(tree);
    for (const command of commands.values()) {
      this.registry.registerCommand(command);
    }
  }

  public unregisterCommands(tree: RootCommand<CommandProps> | RootCommandGroup): void {
    this.roots.splice(this.roots.indexOf(tree), 1);
    const commands = this.adapter.collectCommands(tree);
    for (const command of commands.values()) {
      this.registry.unregisterCommand(command.getFullName());
    }
  }

  public getCommand(fullName: string): RunnableCommand<CommandProps> | undefined {
    return this.registry.getCommand(fullName);
  }

  public getTrees(): readonly CommandNode[] {
    return this.roots as readonly CommandNode[];
  }

  public getHandler(): CommandHandler {
    return this.handler;
  }
}
