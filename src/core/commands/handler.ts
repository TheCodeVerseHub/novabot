import { Events, Interaction } from "discord.js";
import EventListener from "../listener";
import type CommandService from "./service";
import { OptionType } from "./arguments";

export default class CommandHandler extends EventListener<[Interaction]> {
  private readonly service: CommandService;

  public constructor(service: CommandService) {
    super(Events.InteractionCreate);
    this.service = service;
  }

  public async listener(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = this.service.getCommand(interaction.commandName);

    if (!command) {
      console.warn(`Command ${interaction.commandName} not found`);
      await interaction.reply({
        content: "Command not found.",
        ephemeral: true,
      });
      return;
    }

    const resolvedOptions: Record<string, any> = {};

    for (const opt of command.getOptions()) {
      let value;

      switch (opt.type) {
        case OptionType.String:
          value = interaction.options.getString(opt.name);
          break;
        case OptionType.Integer:
          value = interaction.options.getNumber(opt.name);
          break;
        case OptionType.Boolean:
          value = interaction.options.getBoolean(opt.name);
          break;
      }

      if (value == null) {
        if (opt.required && opt.defaultValue === undefined) {
          // TODO: Logger? (Unless it's already logged in a higher layer, meaning, as of this commit, in the Client, where it's registered)
          throw new Error(`Missing required option: ${opt.name}`);
        }
        value = opt.defaultValue;
      }

      resolvedOptions[opt.name] = value;
    }

    await command.execute(interaction, resolvedOptions);
  }
}
