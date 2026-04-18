import { RootCommand } from "../../../core/commands/tree";
import { ChatInputCommandInteraction } from "discord.js";

export default class PingCommand extends RootCommand {
  public constructor() {
    super("ping", "Replies with Pong!");
  }
  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({ content: "Pong!", ephemeral: true });
  }
}
