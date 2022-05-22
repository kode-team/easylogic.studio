import commands from "./commands";
import menus from "./menus";
import threeHelpers from "./three-helpers";

// import layerTree from "apps/designeditor/plugins/layer-tree";
import project from "apps/designeditor/plugins/project";
import baseEditor from "plugins/base-editor";
import component from "plugins/component";
import defaultConfigs from "plugins/default-configs";
import defaultIcons from "plugins/default-icons";
import defaultMessages from "plugins/default-messages";
import propertyEditor from "plugins/property-editor";

export default [
  defaultConfigs,
  defaultIcons,
  defaultMessages,
  baseEditor,
  commands,
  propertyEditor,
  component,
  // layerTree,
  project,
  threeHelpers,
  menus,
];
