import threeHelpers from "./three-helpers";

import baseEditor from "plugins/base-editor";
import component from "plugins/component";
import defaultConfigs from "plugins/default-configs";
import defaultIcons from "plugins/default-icons";
import defaultMessages from "plugins/default-messages";
import layerTree from "plugins/layer-tree";
import project from "plugins/project";
import propertyEditor from "plugins/property-editor";

export default [
  defaultConfigs,
  defaultIcons,
  defaultMessages,
  baseEditor,
  propertyEditor,
  component,
  layerTree,
  project,
  threeHelpers,
];
