import { getVertiesMinY } from "elf/core/math";

export default {
  command: "sort.top",
  execute: function (editor) {
    if (editor.context.selection.isOne) {
      const current = editor.context.selection.current;

      if (current.parent.is("project")) {
        // 상위 객체가 project 이면 움직이지 않는다.
      } else {
        const parent = current.parent;
        // 선택된 객체가 하나이고 artboard 가 존재하면 artboard 를 기준으로 잡는다.
        const distY =
          getVertiesMinY(parent.verties) -
          getVertiesMinY(editor.context.selection.verties);

        editor.context.commands.emit("moveLayer", 0, distY);
      }
    } else if (editor.context.selection.isMany) {
      let maxRightY = getVertiesMinY(editor.context.selection.verties);

      editor.context.commands.emit(
        "moveLayerForItems",
        editor.context.selection.map((item) => {
          let itemRightY = getVertiesMinY(item.verties);

          return { item, dist: [0, maxRightY - itemRightY, 0, 0] };
        })
      );
    }
  },
};
