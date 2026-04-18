import { ResolveOptions, OptionBuilder } from "../../../core/commands/arguments";
import { RootCommand } from "../../../core/commands/tree";
import { ChatInputCommandInteraction } from "discord.js";

const props = new OptionBuilder().string("message", "Message to reply with", { default: "Pong!" }).build();

export default class PingCommand extends RootCommand<typeof props> {
  constructor() {
    super("ping", "Replies with Pong!", props);
  }

  async execute(interaction: ChatInputCommandInteraction, options: ResolveOptions<typeof props>) {
    await interaction.reply({
      content: `${options.message}\n${options.number}`,
      ephemeral: true,
    });
  }
}
