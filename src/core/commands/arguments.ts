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
export type ResolveOptions<T extends readonly CommandOption<OptionType>[]> = {
  [K in T[number] as K["name"]]: K["required"] extends true
    ? OptionTypeMap[K["type"]]
    : OptionTypeMap[K["type"]] | undefined;
};

export class OptionBuilder<T extends readonly CommandOption<OptionType>[] = []> {
  private options: CommandOption<OptionType>[] = [];

  private add<TType extends OptionType>(option: CommandOption<TType>): OptionBuilder<[...T, CommandOption<TType>]> {
    this.options.push(option);
    return this as any;
  }

  // There has to be a more efficient way to do this...

  public string(name: string, description: string, config?: { required?: boolean; default?: string }) {
    return this.add({
      name,
      description,
      type: OptionType.String,
      required: config?.required ?? false,
      defaultValue: config?.default,
    });
  }

  public integer(name: string, description: string, config?: { required?: boolean; default?: number }) {
    return this.add({
      name,
      description,
      type: OptionType.Integer,
      required: config?.required ?? false,
      defaultValue: config?.default,
    });
  }

  public boolean(name: string, description: string, config?: { required?: boolean; default?: boolean }) {
    return this.add({
      name,
      description,
      type: OptionType.Boolean,
      required: config?.required ?? false,
      defaultValue: config?.default,
    });
  }

  public user(name: string, description: string, config?: { required?: boolean; default?: User }) {
    return this.add({
      name,
      description,
      type: OptionType.User,
      required: config?.required ?? false,
      defaultValue: config?.default,
    });
  }

  public channel(name: string, description: string, config?: { required?: boolean; default?: Channel }) {
    return this.add({
      name,
      description,
      type: OptionType.Channel,
      required: config?.required ?? false,
      defaultValue: config?.default,
    });
  }

  public role(name: string, description: string, config?: { required?: boolean; default?: Role }) {
    return this.add({
      name,
      description,
      type: OptionType.Role,
      required: config?.required ?? false,
      defaultValue: config?.default,
    });
  }

  public mentionable(name: string, description: string, config?: { required?: boolean; default?: User | Role }) {
    return this.add({
      name,
      description,
      type: OptionType.Mentionable,
      required: config?.required ?? false,
      defaultValue: config?.default,
    });
  }

  public attachment(name: string, description: string, config?: { required?: boolean; default?: Attachment }) {
    return this.add({
      name,
      description,
      type: OptionType.Attachment,
      required: config?.required ?? false,
      defaultValue: config?.default,
    });
  }

  public build(): T {
    return this.options as unknown as T;
  }
}
