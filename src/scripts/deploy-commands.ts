import BotClient from "../core/client";

const client = new BotClient();

(async () => {
    await client.syncSlashCommands();
})();
