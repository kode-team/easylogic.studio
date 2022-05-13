import { isArray } from "sapa";

import { UPDATE_CANVAS } from "elf/editor/types/event";
/**
 * refresh element command
 *
 * @param {Editor} editor - editor instance
 * @param {Array} args - command parameters
 */
export default {
  command: "refreshElement",

  /**
   *
   * @command refreshElement
   *
   * @param {Editor} editor
   * @param {Model} current
   * @param {boolean} [checkRefreshCanvas=true]  캔버스를 갱신할지 여부 체크
   *                                              children, changedChildren, parentId 가 변경되면 구조가 변경된 것으로 인식하고 캔버스를 갱신한다.
   *
   */
  execute: function (editor, current, checkRefreshCanvas = true) {
    const maker = editor.createCommandMaker();
    if (isArray(current)) {
      if (checkRefreshCanvas) {
        maker.emit("refreshAllCanvas");
      }

      maker.emit(UPDATE_CANVAS, current);
    } else {
      // 부모 관계가 바뀔 때는 refreshAllCanvas 를 실행해줘서
      // 전체 element 를 사전에 맞춰야 한다.
      if (checkRefreshCanvas) {
        if (
          current &&
          current.hasChangedField("children", "changedChildren", "parentId")
        ) {
          maker.emit("refreshAllCanvas");
        }
      }

      // 화면 사이즈 조정
      maker.emit(UPDATE_CANVAS, current);

      if (current.hasLayout()) {
        maker.emit("refreshElementBoundSize", current);
      } else {
        // 화면 레이아웃 재정렬
        if (
          current &&
          (current.isLayoutItem() || current.parent?.is("boolean-path"))
        ) {
          maker.emit("refreshElementBoundSize", current.parent);
        } else {
          maker.emit("refreshElementBoundSize", current);
        }
      }
    }

    // maker.log();

    maker.run();
  },
};
