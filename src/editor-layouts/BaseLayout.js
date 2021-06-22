import { DEBOUNCE, POINTEREND, POINTERMOVE, RESIZE, SUBSCRIBE_ALL } from "el/base/Event";
import { debounce } from "el/base/functions/func";
import { getDist } from "el/base/functions/math";
import { ADD_BODY_MOUSEMOVE, ADD_BODY_MOUSEUP } from "el/editor/types/event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

const EMPTY_POS = { x: 0, y: 0 };
const DEFAULT_POS = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
const MOVE_CHECK_MS = 0;

export default class BaseLayout extends EditorElement {

    initialize() {
        super.initialize();

        this.__initBodyMoves();
    }
    
    __initBodyMoves() {
      this.__moves = new Set();
      this.__ends = new Set();

      this.__modifyBodyMoveSecond(MOVE_CHECK_MS);
    }

    __modifyBodyMoveSecond(ms = MOVE_CHECK_MS) {
      this.$config.set("body.move.ms", ms);

      const callback = ms === 0 
                        ? this.__loopBodyMoves.bind(this) 
                        : debounce(this.__loopBodyMoves.bind(this), this.$config.get("body.move.ms"));


      this.__funcBodyMoves = callback;
    }

    __loopBodyMoves() {
      var pos = this.$config.get("pos");
      var e = this.$config.get('bodyEvent');
      var lastPos = this.$config.get("lastPos") || DEFAULT_POS;
      var isNotEqualLastPos = !(lastPos.x === pos.x && lastPos.y === pos.y);

      if (isNotEqualLastPos && this.__moves.size) {      
        this.__moves.forEach(v => {

          const dist = getDist(pos.x, pos.y, v.xy.x, v.xy.y);

          if (Math.abs(dist) > 0.5) {

            var dx = Math.floor(pos.x - v.xy.x);
            var dy = Math.floor(pos.y - v.xy.y);
  
            v.func.call(v.context, dx, dy, 'move', e.pressure);
          }
        });

        this.$config.set('lastPos', pos);
      }
      requestAnimationFrame(this.__funcBodyMoves);
    }

    __removeBodyMoves() {
      var pos = this.$config.get("pos");
      var e = this.$config.get("bodyEvent");
      if (pos) {
        this.__ends.forEach(v => {
          v.func.call(v.context, pos.x - v.xy.x, pos.y - v.xy.y, 'end', e.pressure);
        });  
      }

      this.__moves.clear();
      this.__ends.clear();
    }

    [SUBSCRIBE_ALL(ADD_BODY_MOUSEMOVE)](func, context, xy) {
      this.__moves.add({ func, context, xy });
    }

    [SUBSCRIBE_ALL(ADD_BODY_MOUSEUP)](func, context, xy) {
      this.__ends.add({ func, context, xy });
    }

    [POINTERMOVE("document")](e) {
      var newPos = e.xy || EMPTY_POS;

      this.$config.set("bodyEvent", e);
      this.$config.set("pos", newPos);

      if (!this.__requestId) {
        this.__requestId = requestAnimationFrame(this.__funcBodyMoves);
      }
    }

    [POINTEREND("document")](e) {

      // var newPos = e.xy || EMPTY_POS;
      this.$config.set("bodyEvent", e);
      this.__removeBodyMoves();
      cancelAnimationFrame(this.__requestId);
      this.__requestId = null;
    }

    [RESIZE('window') + DEBOUNCE(100)] () {
      this.emit('resize.window');
    }
  }