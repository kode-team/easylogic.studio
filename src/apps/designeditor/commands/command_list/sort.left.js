import { getVertiesMinX } from "elf/core/math";

export default {
  command: "sort.left",
  execute: function (editor) {
    if (editor.context.selection.isOne) {
      const current = editor.context.selection.current;

      if (current.parent.is("project")) {
        // 상위 객체가 project 이면 움직이지 않는다.
      } else {
        const parent = current.parent;
        const distX =
          getVertiesMinX(parent.verties) -
          getVertiesMinX(editor.context.selection.verties);
        editor.context.commands.emit("moveLayer", distX, 0);
      }
    } else if (editor.context.selection.isMany) {
      let maxRightX = getVertiesMinX(editor.context.selection.verties);

      editor.context.commands.emit(
        "moveLayerForItems",
        editor.context.selection.map((item) => {
          let itemRightX = getVertiesMinX(item.verties);

          return { item, dist: [maxRightX - itemRightX, 0, 0] };
        })
      );
    }
  },
};
