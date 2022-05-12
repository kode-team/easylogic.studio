import * as commands from "../commands";
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
  propertyEditor,
  component,
  // layerTree,
  project,
  threeHelpers,

  function (editor) {
    editor.loadCommands(commands);
  },
];
