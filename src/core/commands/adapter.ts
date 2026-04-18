import { RootCommand, type RootCommandGroup, type RunnableCommand } from "./tree";
import { type RegistryCommand } from "./registry";
import { type ChatInputCommandInteraction } from "discord.js";

export default class CommandTreeAdapter {
  /**
   * Collects all commands in the given tree and returns them as a map of their full name to the command itself.
   *
   * @param root The root of the command tree.
   * @returns A map of the full name of the commands to the commands themselves.
   */
  public collectCommands(root: RootCommand | RootCommandGroup): Map<string, RegistryCommand> {
    const map = new Map<string, RegistryCommand>();

    if (root instanceof RootCommand) {
      map.set(root.getName(), this.adapt(root, root.getName()));
      return map;
    }

    const rootName = root.getName();

    for (const sub of root.getSubCommands()) {
      const fullName = `${rootName} ${sub.getName()}`;
      map.set(fullName, this.adapt(sub, fullName));
    }

    for (const group of root.getSubCommandGroups()) {
      const namePrefix = `${rootName} ${group.getName()}`;
      for (const sub of group.getSubCommands()) {
        const fullName = `${namePrefix} ${sub.getName()}`;
        map.set(fullName, this.adapt(sub, fullName));
      }
    }

    return map;
  }

  private adapt(command: RunnableCommand, name: string): RegistryCommand {
    return {
      getFullName: () => name,
      getOptions: () => command.getOptions(),
      execute: (interaction: ChatInputCommandInteraction, options: Record<string, any>) => command.execute(interaction, options),
    };
  }
}
