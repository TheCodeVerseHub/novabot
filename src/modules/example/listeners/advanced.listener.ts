import { Client, Events } from "discord.js";
import EventListener from "../../../core/listener";

export default class AdvancedListener extends EventListener<[Client]> {
  private readonly someService: any;

  public constructor(someService: any) {
    super(Events.ClientReady);
    this.someService = someService;
  }

  public async listener(client: Client): Promise<void> {
    console.log(this.someService.doSomething());
  }
}
