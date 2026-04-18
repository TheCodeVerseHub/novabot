import { Attachment, Channel, Role, User } from "discord.js";

enum OptionType {
  String,
  Integer,
  Boolean,
  User,
  Channel,
  Role,
  Mentionable,
  Number,
  Attachment,
}

type OptionTypeMap = {
  [OptionType.String]: string;
  [OptionType.Integer]: number;
  [OptionType.Number]: number;
  [OptionType.Boolean]: boolean;
  // Discord types
  [OptionType.User]: User;
  [OptionType.Channel]: Channel;
  [OptionType.Role]: Role;
  [OptionType.Mentionable]: User | Role;
  [OptionType.Attachment]: Attachment;
};

interface CommandOption<T extends OptionType> {
  name: string;
  description: string;
  required: boolean;
  type: T;
  defaultValue?: OptionTypeMap[T];
}

export type { CommandOption, OptionTypeMap };
export { OptionType };
