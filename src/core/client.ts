import { Client, type ClientEvents, Events, GatewayIntentBits } from "discord.js";
import FeatureLoader from "./loader";
import config, { Config as ConfigurationType } from "./config";
import type Feature from "./feature";
import CommandService from "./commands/service";
import CommandRegistry from "./commands/registry";

type FeatureConstructor = new () => Feature;

type FeatureModule = ReturnType<Feature["getModule"]>;

type FeatureListeners = ReturnType<FeatureModule["getListeners"]>;
type FeatureCommands = ReturnType<FeatureModule["getCommands"]>;

export default class BotClient {
  private readonly client: Client;
  private readonly loader = new FeatureLoader();
  private readonly configuration: ConfigurationType;
  private readonly commandService = new CommandService(new CommandRegistry());
  private readonly availableFeatures: Map<string, FeatureConstructor>;

  public constructor(configuration?: ConfigurationType, intents: GatewayIntentBits[] = [GatewayIntentBits.Guilds]) {
    this.client = new Client({ intents });
    this.configuration = configuration ?? config;
    this.availableFeatures = this.loader.discoverFeatures();
    // TODO: Logger
    console.log("Available features:", this.availableFeatures.keys().toArray().join(", "));

    this.client.on(Events.InteractionCreate, this.commandService.getHandler().listener);
  }

  public start(): void {
    this.setup();
    this.client.login(this.configuration.token);
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
      this.client.on(listener.getEvent() as keyof ClientEvents, listener.listener);
    }
  }

  private registerCommands(commands: FeatureCommands): void {
    for (const command of commands) {
      this.commandService.registerCommands(command);
    }
  }
}
