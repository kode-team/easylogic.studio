import icon from "elf/editor/icon/icon";
import { Component } from "elf/editor/model/Component";

const DEFAULT_TEMPLATE = `
  <svg>
    <rect width="100%" height="100%" fill="black" />
  </svg>
`;

export class TemplateLayer extends Component {
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

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs("template"),
    };
  }
}
