
import { DEBOUNCE, POINTEREND, POINTERMOVE, POINTERSTART, RESIZE, SUBSCRIBE, SUBSCRIBE_ALL } from "el/sapa/Event";
import { debounce, isObject } from "el/sapa/functions/func";
import { getDist } from "el/utils/math";
import { Editor } from "el/editor/manager/Editor";
import { ADD_BODY_MOUSEMOVE, ADD_BODY_MOUSEUP } from "el/editor/types/event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

const EMPTY_POS = { x: 0, y: 0 };
const DEFAULT_POS = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
const MOVE_CHECK_MS = 0;



export default class BaseLayout extends EditorElement {

  created() {
    // register local plugins 
    this.$editor.registerPluginList(this.getPlugins());

    // register other plugins     
    if (Array.isArray(this.opt.plugins)) {
      this.$editor.registerPluginList(this.opt.plugins);
    }

    // initialize plugin list 
    this.$editor.initPlugins();

    // register other configs 
    // 플러그인이 모두 로드 된 다음 커스텀 config 를 설정합니다.     
    if (isObject(this.opt.config)) {
      this.$config.setAll(this.opt.config || {});
    }


  }

  /**
   * @type {Editor}
   */
  get $editor () {

    if (!this.__editorInstance) {
      this.__editorInstance = new Editor()
    }

    return this.__editorInstance;
  }

  afterRender() {
    super.afterRender();

    this.$el.attr('data-theme', this.$editor.theme);
    this.$el.addClass(navigator.userAgent.includes('Windows') ? 'ua-window' : 'ua-default')
  }

  initialize() {
    super.initialize();

    // initialize root event 
    this.__initBodyMoves();

    // load default data 
    this.emit('load.json', this.opt.data?.projects);


  }

  /**
   * 로컬에서 등록될 플러그인 리스트 
   * 
   * 이걸 하는 이유는 target 별 용량을 줄이기 위한 것이다. 
   * 예를 들어 editor 는 전체 용량을 다 차지해도 되지만 player 는 렌더링 부분만 필요하기 때문에 그렇다. 
   * 
   * @override
   * @returns 
   */
  getPlugins() {
    return [];
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

  [POINTERSTART("document")](e) {
    var newPos = e.xy || EMPTY_POS;

    this.$config.set("bodyEvent", e);
    this.$config.set("pos", newPos);
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

  [RESIZE('window') + DEBOUNCE(100)]() {
    this.emit('resize.window');
  }

  [SUBSCRIBE('refreshAll')] () {
    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [SUBSCRIBE('refreshAllSelectProject')] () {      
    this.emit('refreshArtboard')
  }

  [SUBSCRIBE('changeTheme')] () {
    this.$el.attr('data-theme', this.$editor.theme);
  }

  [SUBSCRIBE('changed.locale')] () {
    this.rerender()
  }

}