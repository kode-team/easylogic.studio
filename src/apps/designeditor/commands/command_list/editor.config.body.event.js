import { Dom } from "sapa";

export default {
  command: "config:bodyEvent",
  description: "fire when bodyEvent was set",
  execute: function (editor) {
    const $target = Dom.create(editor.context.config.get("bodyEvent").target);

    editor.context.config.init("onMouseMovepageContainer", $target);
  },
};
