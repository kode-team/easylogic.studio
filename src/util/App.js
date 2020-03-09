import Dom from "./Dom";
import { POINTERMOVE, POINTEREND, DEBOUNCE } from "./Event";
import {
  ADD_BODY_MOUSEMOVE,
  ADD_BODY_MOUSEUP
} from "../csseditor/types/event";
import BaseStore from "./BaseStore";
import UIElement, { EVENT } from "./UIElement";
import { debounce } from "./functions/func";
import { Editor } from "../editor/Editor";

const EMPTY_POS = { x: 0, y: 0 };
const DEFAULT_POS = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
const MOVE_CHECK_MS = 10;

export const start = opt => {
  class App extends UIElement {

    get commands () {
      return this.$editor.commands;
    }

    get shortcuts () {
      return this.$editor.shortcuts;
    }

    initialize(modules = []) {

      this.$store = new BaseStore({
        modules: [...this.getModuleList(), ...modules]
      });

      this.$editor = new Editor({
        $store: this.$store
      })

      this.$container = Dom.create(this.getContainer());
      this.$container.addClass(this.getClassName());

      this.render(this.$container);

      this.initializeEvent();

      this.initBodyMoves();
    }
    
    initBodyMoves() {
      this.moves = new Set();
      this.ends = new Set();

      this.modifyBodyMoveSecond(MOVE_CHECK_MS);
    }

    modifyBodyMoveSecond(ms = MOVE_CHECK_MS) {
      this.$config.set("body.move.ms", ms);
      this.funcBodyMoves = debounce(this.loopBodyMoves.bind(this), this.$config.get("body.move.ms"));
    }

    loopBodyMoves() {
      var pos = this.$config.get("pos");
      var lastPos = this.$config.get("lastPos") || DEFAULT_POS;
      var isNotEqualLastPos = !(lastPos.x === pos.x && lastPos.y === pos.y);

      if (isNotEqualLastPos && this.moves.size) {      
        this.moves.forEach(v => {
          var dx = pos.x - v.xy.x;
          var dy = pos.y - v.xy.y;
          if (dx != 0 || dy != 0) {
            v.func.call(v.context, dx, dy, 'move');
          }
        });

        this.$config.set('lastPos', pos);
      }
      requestAnimationFrame(this.funcBodyMoves);
    }

    removeBodyMoves() {
      var pos = this.$config.get("pos");
      if (pos) {
        this.ends.forEach(v => {
          v.func.call(v.context, pos.x - v.xy.x, pos.y - v.xy.y, 'end');
        });  
      }

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
      var newPos = e.xy || EMPTY_POS;

      this.$config.set("bodyEvent", e);
      this.$config.set("pos", newPos);

      if (!this.requestId) {
        this.requestId = requestAnimationFrame(this.funcBodyMoves);
      }
    }

    [POINTEREND("document") + DEBOUNCE(30)](e) {
      // var newPos = e.xy || EMPTY_POS;
      this.$config.set("bodyEvent", e);
      this.removeBodyMoves();
      this.requestId = null;
    }
  }

  return new App(opt);
};
