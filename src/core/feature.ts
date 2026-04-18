import Module from "./module";
import type EventListener from "./listener";

/**
 * A feature is a class responsible for initializing a Module.
 *
 * Example usage:
 * ```ts
 * class MyFeature extends Feature {
 *   constructor() {
 *     super("myFeature", "My feature description");
 *
 *     const someService = new SomeService();
 *
 *     this.module.addCommand(new MyCommand());
 *     this.module.addCommand(new MyCommandThatWantsAService(someService));
 *     this.module.addListener(new MyListener());
 *   }
 * }
 * ```
 *
 * @see {@link Module}
 */
export default abstract class Feature {
  private readonly name: string;
  private readonly description: string;
  private readonly module: Module;

  constructor(name: string, description: string, module: Module | undefined = undefined) {
    this.name = name;
    this.description = description;
    this.module = module || new Module();
  }

  public getModule(): Module {
    return this.module;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }
}

/**
 * A builder for simple features.
 *
 * Example usage:
 * ```
 * // index.ts of the feature
 * export default new FeatureBuilder()
 *     .withName("myFeature")
 *     .withDescription("My feature description")
 *     .addListener(() => new MyListener())
 *     .build();
 * ```
 *
 * ## On the topic of instantiating services
 *
 * If you need to instantiate services in the constructor or more advanced setup (for example, sharing a single service instance between multiple listeners), you have two options:
 *   1. Extend the Feature class manually and initialize the service in the constructor.
 *   Example:
 * ```ts
 * class MyFeature extends Feature {
 *   constructor() {
 *     super("myFeature", "My feature description");
 *
 *     const someService = new SomeService();
 *
 *     this.module.addCommand(new MyCommand(someService));
 *     this.module.addListener(new MyListener(someService));
 *   }
 * }
 * ```
 * In the example above, `someService` will be initialized in the constructor of `MyFeature`. As such, every instance of this feature will have it's own instance of `someService`.
 *
 *   2. If the service can be initialized as a singleton (i.e., it can be safely shared between multiple instances of this feature), you can provide it as an argument to the listeners and commands without extending the class.
 *   Example:
 * ```ts
 * const someService = new SomeService(); // Will be shared between all created instances of the feature!
 * const Feature = new FeatureBuilder()
 *   .withName("myFeature")
 *   .withDescription("My feature description")
 *   .addListener(() => new MyListener(someService))
 *   .addCommand(() => new MyCommand(someService))
 *   .build();
 * const featureOne = new Feature();
 * const featureTwo = new Feature();
 * ```
 * In the example above, `someService` will be shared between both `featureOne` and `featureTwo`.
 */
export class FeatureBuilder {
  private name: string | null;
  private description: string | null;
  private listenerProviders: (() => EventListener<any[]>)[];
  private commandProviders: (() => any)[];

  constructor() {
    this.name = null;
    this.description = null;
    this.listenerProviders = [];
    this.commandProviders = [];
  }

  public withName(name: string): FeatureBuilder {
    this.name = name;
    return this;
  }

  public withDescription(description: string): FeatureBuilder {
    this.description = description;
    return this;
  }

  public addListener(listenerProvider: () => EventListener<any[]>): FeatureBuilder {
    this.listenerProviders.push(listenerProvider);
    return this;
  }

  public addCommand(commandProvider: () => any): FeatureBuilder {
    this.commandProviders.push(commandProvider);
    return this;
  }

  public build(): new () => Feature {
    if (this.name === null || this.description === null) {
      throw new Error("Name and description must be set before building the feature");
    }
    const name = this.name;
    const description = this.description;
    const listenerProviders = this.listenerProviders;
    const commandProviders = this.commandProviders;
    return class extends Feature {
      constructor() {
        super(name, description);
        const module = this.getModule();
        listenerProviders.forEach((provider) => module.addListener(provider()));
        commandProviders.forEach((provider) => module.addCommand(provider()));
      }
    };
  }
}
