import { DomTemplateEngine } from "./DomTemplateEngine";

const EngineList = {
  dom: DomTemplateEngine,
};

export class TemplateEngine {
  static compile(engine, template, params = []) {
    const currentEngine = EngineList[engine] || EngineList["dom"];

    return currentEngine.compile(template, params);
  }
}
