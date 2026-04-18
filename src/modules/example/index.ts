import Feature, { FeatureBuilder } from "../../core/feature";
import SimpleListener from "./listeners/ready.listener";
import AdvancedListener from "./listeners/advanced.listener";
import PingCommand from "./commands/ping.command";

export default new FeatureBuilder()
  .withName("example")
  .withDescription("Example feature")
  .addCommand(() => new PingCommand())
  .addListener(() => new SimpleListener())
  .addListener(
    () =>
      // Instantiation of a listener with the injection of an inline service exposing a doSomething method
      new AdvancedListener(new class {
        public doSomething(): string {
          return "Hello world!";
        }
      }())
  )
  .build();
