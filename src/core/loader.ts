import path from "node:path";
import fs from "node:fs";
import Feature from "./feature";


export default class FeatureLoader {
  private readonly modulesPath = path.join(__dirname, "../modules");

  public discoverFeatures(): (new (...args: any[]) => Feature)[] {
    return fs
      .readdirSync(this.modulesPath)
      .map((filename) => {
        const modulePath = path.join(this.modulesPath, filename);
        const module = require(modulePath);
        return module.default || module;
      })
      .filter((module) => Feature.prototype.isPrototypeOf(module.prototype));
  }
}
