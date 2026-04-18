import { OptionType } from "../../../core/commands/arguments";
import { RootCommand } from "../../../core/commands/tree";
import { ChatInputCommandInteraction } from "discord.js";

export default class PingCommand extends RootCommand {
  public constructor() {
    super("ping", "Replies with Pong!");

    this.addOption("message", "Message to reply with", OptionType.String, false, "Pong!");
  }

  public async execute(
    interaction: ChatInputCommandInteraction,
    options: { message: string }
  ): Promise<void> {
    await interaction.reply({
      content: options.message,
      ephemeral: true
    });
  }
}