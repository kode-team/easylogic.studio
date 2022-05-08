import { Pattern } from "elf/editor/property-parser/Pattern";

export default {
  command: "addBackgroundImagePattern",
  execute: function (editor, pattern, id = null) {
    var items = editor.context.selection.itemsByIds(id);
    let itemsMap = {};
    items.forEach((item) => {
      itemsMap[item.id] = {
        pattern: Pattern.join([
          ...Pattern.parseStyle(pattern),
          ...Pattern.parseStyle(item.pattern),
        ]),
      };
    });

    editor.context.commands.emit(
      "history.setAttribute",
      "add pattern",
      itemsMap
    );
  },
};
