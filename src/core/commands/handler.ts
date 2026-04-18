import { Events, Interaction } from "discord.js";
import EventListener from "../listener";
import type CommandService from "./service";

export default class CommandHandler extends EventListener<[Interaction]> {
  private readonly service: CommandService;

  public constructor(service: CommandService) {
    super(Events.InteractionCreate);
    this.service = service;
  }

  public async listener(interaction: Interaction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      const command = this.service.getCommand(interaction.commandName);
      if (command) {
        await command.execute(interaction);
      } else {
        // TODO: Log a warning
        console.warn(`Command ${interaction.commandName} not found, is the tree out of sync?`);
        await interaction.reply({ content: "Command not found.\n#- Try reloading your client, it's probably out of sync.", ephemeral: true });
      }
    }
  }
}
