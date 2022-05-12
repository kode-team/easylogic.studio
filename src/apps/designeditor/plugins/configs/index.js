import configs from "../../configs";
// import { Editor } from "elf/editor/manager/Editor";

/**
 * register i18n default messages
 *
 */
export default function (editor) {
  configs.forEach((config) => {
    editor.registerConfig(config);
  });
}
