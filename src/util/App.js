import Dom from "./Dom";
import { POINTERMOVE, POINTEREND } from "./Event";
import {
  ADD_BODY_MOUSEMOVE,
  ADD_BODY_MOUSEUP
} from "../csseditor/types/event";
import BaseStore from "./BaseStore";
import UIElement, { EVENT } from "./UIElement";

import { editor } from "../editor/editor";
import { debounce } from "./functions/func";

const EMPTY_POS = { x: 0, y: 0 };
const MOVE_CHECK_MS = 10;

export const start = opt => {
  class App extends UIElement {

    initialize(modules = []) {

      this.$store = new BaseStore({
        modules: [...this.getModuleList(), ...modules]
      });

      editor.setStore(this.$store);

      this.$container = Dom.create(this.getContainer());
      this.$container.addClass(this.getClassName());

      this.render(this.$container);

      // 이벤트 연결
      this.initializeEvent();

      this.initBodyMoves();
    }

    initBodyMoves() {
      this.moves = new Set();
      this.ends = new Set();

      this.modifyBodyMoveSecond(MOVE_CHECK_MS);
    }

    modifyBodyMoveSecond(ms = MOVE_CHECK_MS) {
      editor.config.set("body.move.ms", ms);
      this.funcBodyMoves = debounce(
        this.loopBodyMoves.bind(this),
        editor.config.get("body.move.ms")
      );
    }

    [EVENT("modifyBodyMoveSeconds")](ms) {
      this.modifyBodyMoveSecond(ms);
    }

    loopBodyMoves() {
      var oldPos = editor.config.get("oldPos");
      var pos = editor.config.get("pos");
      var isRealMoved = oldPos.x != pos.x || oldPos.y != pos.y;

      if (isRealMoved && this.moves.size) {
        this.moves.forEach(v => {
          var dx = pos.x - v.xy.x;
          var dy = pos.y - v.xy.y;
          if (dx != 0 || dy != 0) {
            //  변화가 있을 때만 호출 한다.
            v.func.call(v.context, dx, dy, 'move');
          }
        });
      }
      requestAnimationFrame(this.funcBodyMoves);
    }

    removeBodyMoves() {
      var pos = editor.config.get("pos");
      this.ends.forEach(v => {
        v.func.call(v.context, pos.x - v.xy.x, pos.y - v.xy.y, 'end');
      });

      this.moves.clear();
      this.ends.clear();
    }

    [EVENT(ADD_BODY_MOUSEMOVE)](func, context, xy) {
      this.moves.add({ func, context, xy });
    }

    [EVENT(ADD_BODY_MOUSEUP)](func, context, xy) {
      this.ends.add({ func, context, xy });
    }

    getModuleList() {
      return opt.modules || [];
    }

    getClassName() {
      return opt.className || "csseditor";
    }

    getContainer() {
      return opt.container || document.body;
    }

    template() {
      return `<div>${opt.template}</div>`;
    }

    components() {
      return opt.components || {};
    }

    [POINTERMOVE("document")](e) {
      var oldPos = editor.config.get("pos") || EMPTY_POS;
      var newPos = e.xy || EMPTY_POS;

      this.bodyMoved = !(oldPos.x == newPos.x && oldPos.y == newPos.y);
      editor.config.set("bodyEvent", e);
      editor.config.set("pos", newPos);
      editor.config.set("oldPos", oldPos);

      if (!this.requestId) {
        this.requestId = requestAnimationFrame(this.funcBodyMoves);
      }
    }

    [POINTEREND("document")](e) {
      var newPos = e.xy || EMPTY_POS;
      editor.config.set("bodyEvent", e);
      editor.config.set("pos", newPos);
      this.removeBodyMoves();
      this.requestId = null;
    }
  }

  return new App(opt);
};
