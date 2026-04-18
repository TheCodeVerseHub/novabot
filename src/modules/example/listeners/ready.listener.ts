import { listener } from "../../../core/listener";
import { Client, Events } from "discord.js";

export default listener(Events.ClientReady, async (client: Client) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
});
