import { Layer } from "../Layer";
import icon from "el/editor/icon/icon";
import { ComponentManager } from "el/editor/manager/ComponentManager";

const DEFAULT_TEMPLATE = `
  <svg>
    <rect width="100%" height="100%" fill="black" />
  </svg>
`

export class TemplateLayer extends Layer {

  getIcon () {
    return icon.auto_awesome;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'template',
      name: "New Template",
      engine: 'dom',
      template: DEFAULT_TEMPLATE,
      params: [],
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }

  getDefaultTitle() {
    return "Template";
  }

  getIcon() {
    return icon.auto_awesome;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('template'),
    }
  }

}
 
ComponentManager.registerComponent('template', TemplateLayer);