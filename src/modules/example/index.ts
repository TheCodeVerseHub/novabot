import { FeatureBuilder } from "../../core/feature";
import SimpleListener from "./listeners/ready.listener";
import AdvancedListener from "./listeners/advanced.listener";

export default new FeatureBuilder()
  .withName("example")
  .withDescription("Example feature")
  .addListener(() => new SimpleListener())
  .addListener(
    () =>
      // Instantiation of a listener with the injection of an inline service exposing a doSomething method
      new AdvancedListener({
        doSomething: () => "Hello world",
      })
  )
  .build();
