import { itemsToRectVerties, rectToVerties } from "elf/core/collision";

export default {
  command: "moveSelectionToCenter",

  description: "Move selection project or artboards to center on Viewport",

  /**
   *
   * @param {Editor} editor
   * @param {vec3[]} areaVerties
   * @param {boolean} [withScale=true]    scale 도 같이 조절 할지 정리
   */
  execute: function (editor, withScale = true) {
    let areaVerties = [];

    if (editor.selection.isEmpty) {
      if (editor.selection.currentProject?.layers.length > 0) {
        areaVerties = itemsToRectVerties(
          editor.selection.currentProject.layers
        );
      } else {
        areaVerties = rectToVerties(0, 0, 100, 100);
      }
    } else {
      areaVerties = itemsToRectVerties(editor.selection.items);
    }

    editor.emit("moveToCenter", areaVerties, withScale);
  },
};
