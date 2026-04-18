import Module from "./module";

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
    private readonly name: string
    private readonly description: string
    private readonly module: Module

    constructor(name: string, description: string, module: Module | undefined = undefined) {
        this.name = name;
        this.description = description;
        this.module = module || new Module();
    };

    public getModule(): Module {
        return this.module
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }
}
