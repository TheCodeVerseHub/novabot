import path from "node:path";
import fs from "node:fs";
import Feature from "./feature";

export default class FeatureLoader {
  private readonly modulesPath = path.join(__dirname, "../modules");

  public discoverFeatures(): Map<string, new (...args: any[]) => Feature> {
    return fs.readdirSync(this.modulesPath).reduce((map, filename) => {
      const modulePath = path.join(this.modulesPath, filename);
      const m = require(modulePath);
      const feature = m.default??m;
      // If the module is a feature, otherwise it's ignored
      if (Feature.prototype.isPrototypeOf(feature.prototype)) {
        map.set(filename, feature);
      } else {
        // TODO: Logger
        console.warn("Ignored feature", filename, "as it does not export a Feature");
      }
      return map;
    }, new Map<string, new (...args: any[]) => Feature>());
  }
}
