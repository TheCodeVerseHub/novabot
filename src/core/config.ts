import dotenv from "dotenv";

dotenv.config();

export interface Config {
    token: string;
    autoload: string[];
}

export default {
    token: process.env.BOT_TOKEN,
    autoload: process.env.AUTOLOAD?.split(",")??[]
} as Config;
