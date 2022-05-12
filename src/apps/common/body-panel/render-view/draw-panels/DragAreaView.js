import { POINTERSTART, IF } from "sapa";

import "./DragAreaView.scss";

import { END, MOVE, REFRESH_SELECTION } from "elf/editor/types/event";
import { KEY_CODE } from "elf/editor/types/key";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class DragAreaView extends EditorElement {
  initState() {
    return {
      mode: "selection",
      x: 0,
      y: 0,
      width: 10000,
      height: 10000,
      cachedCurrentElement: {},
      html: "",
    };
  }

  template() {
    return /*html*/ `
            <div class="elf--drag-area-view" ref="$dragAreaView"></div>            
        `;
  }

  checkSelectionArea(e) {
    const mousePoint = this.$viewport.getWorldPosition(e);

    // select된 객체에 포지션이 있으면  움직일 수 있도록 한다.
    if (this.$context.selection.hasPoint(mousePoint)) {
      return true;
    }
  }

  /**
   * 레이어를 움직이기 위한 이벤트 실행 여부 체크
   *
   * @param {PointerEvent} e
   */
  checkEditMode(e) {
    // hand tool 이 on 되어 있으면 드래그 하지 않는다.
    if (this.$config.get("set.tool.hand")) {
      return false;
    }

    // space 키가 눌러져있을 때는 실행하지 않는다.
    const code = this.$context.shortcuts.getGeneratedKeyCode(KEY_CODE.space);
    if (this.$context.keyboardManager.check(code)) {
      return false;
    }

    // selection 영역에 속할 때
    const mousePoint = this.$viewport.getWorldPosition(e);
    this.inSelection = false;
    if (this.$context.selection.hasPoint(mousePoint)) {
      this.inSelection = true;

      // 선택한 영역이 artboard 이고, 하위 레이어가 있다면 움직이지 않는다.
      if (this.$context.selection.current.is("artboard")) {
        if (this.$context.selection.current.hasChildren()) {
          // drag 모드로 변신
          this.$config.init("set.dragarea.mode", true);
          this.$config.init("set.move.mode", false);

          return true;
        } else {
          // 움직임
          this.$config.init("set.dragarea.mode", false);
          this.$config.init("set.move.mode", true);

          return true;
        }
      } else {
        // 움직임
        this.$config.init("set.dragarea.mode", false);
        this.$config.init("set.move.mode", true);
        return true;
      }
    }

    this.mouseOverItem = this.$context.selection.filteredLayers[0];

    if (this.mouseOverItem) {
      // move 모드로 변신
      this.$config.init("set.dragarea.mode", false);
      this.$config.init("set.move.mode", true);
    } else {
      // drag 모드로 변신
      this.$config.init("set.dragarea.mode", true);
      this.$config.init("set.move.mode", false);
    }

    return true;
  }

  [POINTERSTART("$dragAreaView") +
    IF("checkEditMode") +
    MOVE("movePointer") +
    END("moveEndPointer")]() {
    if (this.$config.get("set.dragarea.mode")) {
      this.emit("startDragAreaView");
    }
    this.$config.set("editing.mode.itemType", "select");
  }

  initializeDragSelection() {
    this.$context.selection.reselect();
    this.$context.snapManager.clear();

    this.emit(REFRESH_SELECTION);
  }

  movePointer() {
    if (this.$config.get("set.dragarea.mode")) {
      this.emit("moveDragAreaView");
    }
  }

  moveEndPointer() {
    if (this.$config.get("set.dragarea.mode")) {
      this.emit("endDragAreaView");
    }

    this.$config.init("set.dragarea.mode", false);
    this.$config.init("set.move.mode", false);
  }
}
