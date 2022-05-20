import { iconUse } from "elf/editor/icon/icon";
export default function (editor) {
  editor.registerUI("layertab.tab", {
    Sample: {
      title: "Sample",
      icon: iconUse("add"),
      value: "sample",
    },
  });
}
