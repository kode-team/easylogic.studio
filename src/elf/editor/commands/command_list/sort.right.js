import { getVertiesMaxX } from "elf/core/math";

export default {
  command: "sort.right",

  /**
   *
   * @param {Editor} editor
   */
  execute: function (editor) {
    if (editor.selection.isOne) {
      const current = editor.selection.current;

      if (current.parent.is("project")) {
        // 상위 객체가 project 이면 움직이지 않는다.
      } else {
        const parent = current.parent;
        // parent 를 기준으로 distX 를 맞춘다.
        const distX =
          getVertiesMaxX(parent.verties) -
          getVertiesMaxX(editor.selection.verties);
        editor.emit("moveLayer", distX, 0);
      }
    } else if (editor.selection.isMany) {
      let maxRightX = getVertiesMaxX(editor.selection.verties);

      editor.emit(
        "moveLayerForItems",
        editor.selection.map((item) => {
          let itemRightX = getVertiesMaxX(item.verties);

          return { item, dist: [maxRightX - itemRightX, 0, 0] };
        })
      );
    }
  },
};
