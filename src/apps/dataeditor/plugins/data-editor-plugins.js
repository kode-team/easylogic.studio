import baseEditor from "plugins/base-editor";
import color from "plugins/color";
import defaultConfigs from "plugins/default-configs";
import defaultIcons from "plugins/default-icons";
import defaultMessages from "plugins/default-messages";
import gradient from "plugins/gradient";
import propertyEditor from "plugins/property-editor";

export default [
  defaultConfigs,
  defaultIcons,
  defaultMessages,

  // common editor
  baseEditor,
  propertyEditor,
  color,
  gradient,
];
