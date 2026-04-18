import dotenv from "dotenv";

dotenv.config();

export interface Config {
    token: string;
    autoload: string[];
    client_id: string;
    guild_id: string;
}

export default {
    token: process.env.BOT_TOKEN,
    autoload: process.env.AUTOLOAD?.split(",")??[],
    client_id: process.env.CLIENT_ID,
    guild_id: process.env.GUILD_ID??"0"
} as Config;
