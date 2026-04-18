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

    const resolved: Record<string, any> = {};

    for (const opt of command.getOptions()) {
      let value;

      switch (opt.type) {
        case OptionType.String:
          value = interaction.options.getString(opt.name);
          break;
        case OptionType.Integer:
          value = interaction.options.getInteger(opt.name);
          break;
        case OptionType.Number:
          value = interaction.options.getNumber(opt.name);
          break;
        case OptionType.Boolean:
          value = interaction.options.getBoolean(opt.name);
          break;
        case OptionType.User:
          value = interaction.options.getUser(opt.name);
          break;
        case OptionType.Channel:
          value = interaction.options.getChannel(opt.name);
          break;
        case OptionType.Role:
          value = interaction.options.getRole(opt.name);
          break;
        case OptionType.Mentionable:
          value = interaction.options.getMentionable(opt.name);
          break;
        case OptionType.Attachment:
          value = interaction.options.getAttachment(opt.name);
          break;
      }

      if (value == null) {
        if (opt.required && opt.defaultValue === undefined) {
          throw new Error(`Missing required option: ${opt.name}`);
        }
        value = opt.defaultValue;
      }

      resolved[opt.name] = value;
    }

    await command.execute(interaction, resolved);
  }
}
