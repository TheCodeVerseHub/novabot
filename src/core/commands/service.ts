import type { RunnableCommand, CommandNode } from "./tree";
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

export default class CommandService {
  private readonly registry: CommandRegistry;
  private readonly adapter: CommandTreeAdapter;
  private readonly handler: CommandHandler;

  private readonly roots: (RootCommand | RootCommandGroup)[];

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
      const builder = new SlashCommandBuilder();
      builder.setName(root.getName());
      builder.setDescription(root.getDescription());
      if (root instanceof RootCommandGroup) {
        for (const group of root.getSubCommandGroups()) {
          const groupBuilder = new SlashCommandSubcommandGroupBuilder();
          groupBuilder.setName(group.getName());
          groupBuilder.setDescription(group.getDescription());
          for (const command of group.getSubCommands()) {
            const commandBuilder = new SlashCommandSubcommandBuilder();
            commandBuilder.setName(command.getName());
            commandBuilder.setDescription(command.getDescription());
            groupBuilder.addSubcommand(commandBuilder);
          }
          builder.addSubcommandGroup(groupBuilder);
        }
        for (const command of root.getSubCommands()) {
          const commandBuilder = new SlashCommandSubcommandBuilder();
          commandBuilder.setName(command.getName());
          commandBuilder.setDescription(command.getDescription());
          builder.addSubcommand(commandBuilder);
        }
      }
      array.push(builder);
    }
    return array.map((builder) => builder.toJSON());
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
