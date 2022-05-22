import configs from "./configs";

import baseEditor from "plugins/base-editor";
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

  configs,
];
