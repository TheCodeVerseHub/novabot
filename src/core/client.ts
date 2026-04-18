import { Client, REST, Routes, type ClientEvents, Events, GatewayIntentBits } from "discord.js";
import FeatureLoader from "./loader";
import config, { Config as ConfigurationType } from "./config";
import type Feature from "./feature";
import CommandService from "./commands/service";

type FeatureConstructor = new () => Feature;

type FeatureModule = ReturnType<Feature["getModule"]>;

type FeatureListeners = ReturnType<FeatureModule["getListeners"]>;
type FeatureCommands = ReturnType<FeatureModule["getCommands"]>;

export default class BotClient {
  private readonly client: Client;
  private readonly loader = new FeatureLoader();
  private readonly configuration: ConfigurationType;
  private readonly commandService = new CommandService();
  private readonly availableFeatures: Map<string, FeatureConstructor>;
  private setupCompleted: boolean = false;

  public constructor(configuration?: ConfigurationType, intents: GatewayIntentBits[] = [GatewayIntentBits.Guilds]) {
    this.client = new Client({ intents });
    this.configuration = configuration ?? config;
    this.availableFeatures = this.loader.discoverFeatures();
    // TODO: Logger
    console.log("Available features:", this.availableFeatures.keys().toArray().join(", "));

    this.client.on(
      Events.InteractionCreate,
      async (interaction) => await this.commandService.getHandler().listener(interaction)
    );
  }

  public start(): void {
    if (!this.setupCompleted) {
      this.setup();
    }
    this.client.login(this.configuration.token);
  }

  /**
   * Syncs all loaded slash commands to discord.
   * This can either be called on it's own or after the bot has been started.
   *
   * @returns A promise that resolves once the commands have been reloaded.
   */
  public async syncSlashCommands(): Promise<void> {
    if (!this.setupCompleted) {
      this.setup();
    }
    const commands = this.commandService.collectSlashCommands();
    const rest = new REST().setToken(this.configuration.token);
    try {
      const data = await rest.put(
        Routes.applicationGuildCommands(this.configuration.client_id, this.configuration.guild_id),
        { body: commands }
      );
      // TODO: Logging
      console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
      // TODO: Logging
      console.error(error);
    }
  }

  private setup(): void {
    // Loads features based on the autoload array in configuration
    for (const name of this.configuration.autoload) {
      const FeatureCtor = this.availableFeatures.get(name);

      if (!FeatureCtor) {
        throw new Error(`Autoload feature "${name}" not found`);
      }

      const feature = new FeatureCtor();
      const module = feature.getModule();

      this.registerListeners(module.getListeners());
      this.registerCommands(module.getCommands());
    }
  }

  private registerListeners(listeners: FeatureListeners): void {
    for (const listener of listeners) {
      this.client.on(listener.getEvent() as keyof ClientEvents, async (...args) => await listener.listener(...args));
    }
  }

  private registerCommands(commands: FeatureCommands): void {
    for (const command of commands) {
      this.commandService.registerCommands(command);
    }
  }
}
