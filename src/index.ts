import { Client, ClientEvents, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

import Loader from "./core/loader";

const loader = new Loader();

for (const feature of loader.discoverFeatures()) {
  const instance = new feature();
  for (const eventListener of instance.getModule().getListeners()) {
    client.on(eventListener.getEvent() as keyof ClientEvents, async (...args) => {
      await eventListener.listener(...args);
    });
  }
}

client.login(token);
