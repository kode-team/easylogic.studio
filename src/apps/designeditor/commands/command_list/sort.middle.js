import { getVertiesCenterY } from "elf/core/math";

export default {
  command: "sort.middle",
  execute: function (editor) {
    if (editor.context.selection.isOne) {
      const current = editor.context.selection.current;

      if (current.parent.is("project")) {
        // 상위 객체가 project 이면 움직이지 않는다.
      } else if (current.artboard) {
        // 선택된 객체가 하나이고 artboard 가 존재하면 artboard 를 기준으로 잡는다.
        const distY =
          getVertiesCenterY(current.artboard.verties) -
          getVertiesCenterY(editor.context.selection.verties);
        editor.context.commands.emit("moveLayer", 0, distY);
      }
    } else if (editor.context.selection.isMany) {
      let maxRightY = getVertiesCenterY(editor.context.selection.verties);

      editor.context.commands.emit(
        "moveLayerForItems",
        editor.context.selection.map((item) => {
          let itemRightY = getVertiesCenterY(item.verties);

          return { item, dist: [0, maxRightY - itemRightY, 0, 0] };
        })
      );
    }
  },
};
