import icon from "elf/editor/icon/icon";
import { Component } from "elf/editor/model/Component";

const DEFAULT_TEMPLATE = `
  <svg>
    <rect width="100%" height="100%" fill="black" />
  </svg>
`;

export class TemplateModel extends Component {
  getIcon() {
    return icon.auto_awesome;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "template",
      name: "New Template",
      engine: "dom",
      template: DEFAULT_TEMPLATE,
      params: [],
      ...obj,
    });
  }

  get template() {
    return this.get("template");
  }

  set template(value) {
    this.set("template", value);
  }

  get params() {
    return this.get("params");
  }

  set params(value) {
    this.set("params", value);
  }

  get engine() {
    return this.get("engine");
  }

  set engine(value) {
    this.set("engine", value);
  }

  enableHasChildren() {
    return false;
  }

  getDefaultTitle() {
    return "Template";
  }

  editable(editablePropertyName) {
    switch (editablePropertyName) {
      case "font":
        return true;
    }

    return super.editable(editablePropertyName);
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("template", "engine", "params"),
  //   };
  // }
}
