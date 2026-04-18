import Feature from "@/core/feature";
import SimpleListener from "./listeners/ready.listener";
import AdvancedListener from "./listeners/advanced.listener";

export default class ExampleFeature extends Feature {
    constructor() {
        super("example", "Example feature");
        this.getModule().addListener(new SimpleListener());
        this.getModule().addListener(new AdvancedListener({
            doSomething: () => "Hello world"
        }));
    }
}
