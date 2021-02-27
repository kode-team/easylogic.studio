import { uuid } from "./functions/math";
import EventMachine from "./EventMachine";
import { splitMethodByKeyword } from "./functions/func";
import { SelectionManager } from "@manager/SelectionManager";
import { SnapManager } from "@manager/SnapManager";
import { KeyBoardManager } from "@manager/KeyboardManager";
import { ShortCutManager } from "@manager/ShortCutManager";
import { ViewportManager } from "@manager/ViewportManager";
import { StorageManager } from "@manager/StorageManager";

const REG_STORE_MULTI_PATTERN = /^ME@/;

const MULTI_PREFIX = "ME@";
const SPLITTER = "|";

export const PIPE = (...args) => {
  return args.join(SPLITTER);
};

export const EVENT = (...args) => {
  return MULTI_PREFIX + PIPE(...args);
};

export const COMMAND = EVENT
export const ON = EVENT

/**
 * UI 를 만드는 기본 단위 
 * 
 * dom handler, 
 * bind handler, 
 * store handler 를 가진다. 
 * 
 * @property {Editor} $editor 
 */
class UIElement extends EventMachine {
  constructor(opt, props = {}) {
    super(opt, props);

    this.created();

    this.initialize();

    this.initializeStoreEvent();

  }

  /**
   * UIElement instance 에 필요한 기본 속성 설정 
   */
  initializeProperty (opt, props = {}) {

    super.initializeProperty(opt, props);

    if (opt && opt.$store) {
      this.$store = opt.$store;
    }

    if (opt && opt.$editor) {
      /**
       * @property {Editor} $editor
       */
      this.$editor = opt.$editor; 
    }
  }

  /**
   * UIElement 가 생성될 때 호출되는 메소드 
   * @protected
   */
  created() {}

  getRealEventName(e, s = MULTI_PREFIX) {
    var startIndex = e.indexOf(s);
    return e.substr(startIndex < 0 ? 0 : startIndex + s.length);
  }

  splitMethod (events, keyword, defaultValue = 0) {
    var [methods, params] = splitMethodByKeyword(events.split(SPLITTER), keyword);

    return [
      methods.length ? +params[0].target : defaultValue,
      methods, 
      params
    ]
  }

  /**
   * initialize store event
   *
   * you can define '@xxx' method(event) in UIElement
   *
   * Store Event 를 초기화 한다. 
   *
   */
  initializeStoreEvent() {

    this.filterProps(REG_STORE_MULTI_PATTERN).forEach(key => {
      const events = this.getRealEventName(key, MULTI_PREFIX);

      // support deboounce for store event 
      var [debounceSecond, debounceMethods] = this.splitMethod(events, 'debounce');
      var [throttleSecond, throttleMethods] = this.splitMethod(events, 'throttle');      

      events
        .split(SPLITTER)
        .filter(it => {
          return (
              debounceMethods.indexOf(it) === -1 && 
              throttleMethods.indexOf(it) === -1
          )
        })
        .map(it => it.trim())
        .forEach(e => {
          var callback = this[key].bind(this);
          callback.displayName = `${this.sourceName}.${e}`;
          callback.source = this.source;
          this.$store.on(e, callback, this, debounceSecond, throttleSecond);
      });
    });
  }

  /**
   * 현재 UIElement 와 연결된 모든 메세지를 해제한다. 
   */
  destoryStoreEvent() {
    this.$store.offAll(this);
  }

  destroy () {
    super.destroy()

    this.destoryStoreEvent();
  }

  /**
   * UIElement 를 다시 그린다. 
   * 
   * template 정의 부터  메세지 이벤트 정의까지 모두 다시 한다. 
   */
  rerender() {
    super.rerender();

    this.initialize();

    this.initializeStoreEvent();
  }


  /**
   * UIElement 기반으로 메세지를 호출 한다. 
   * 나 이외의 객체들에게 메세지를 전달한다. 
   * 
   * @param {string} messageName
   * @param {any[]} args 
   */
  emit(messageName, ...args) {
    this.$store.source = this.source;
    this.$store.sourceContext = this; 
    this.$store.emit(messageName, ...args);
  }

  /**
   * MicroTask 를 수행한다. 
   * 
   * @param {Function} callback 
   */
  nextTick (callback) {
    this.$store.nextTick(callback);
  }

  /**
   * 
   * UIElement 자신의 메세지를 수행한다. 
   * emit 은 나외의 객체에게 메세지를 보내고 
   * 
   * @param {string} messageName 
   * @param {any[]} args 
   */
  trigger(messageName, ...args) {
    this.$store.source = this.source;
    this.$store.trigger(messageName, ...args);
  }

  on (message, callback) {
    this.$store.on(message, callback);
  }

  off (message, callback) {
    this.$store.off(message, callback);
  }


  // editor utility 

  /**
   * i18n 텍스트를 리턴한다. 
   * 
   * @param {string} key 
   * @returns {string} i18n 텍스트 
   */
  $i18n (key) {
    return this.$editor.i18n(key);
  }

  $initI18n (key) {
    return this.$editor.initI18n(key);
  }

  get $config () {
    return this.$editor.config; 
  }

  /**
   * @type {SelectionManager} $selection
   */
  get $selection () {
    return this.$editor.selection; 
  }

  /**
   * @type {ViewportManager} $viewport
   */
  get $viewport () {
    return this.$editor.viewport; 
  }

  /**
   * @type {SnapManager} $snapManager
   */
  get $snapManager () {
    return this.$editor.snapManager;
  }

  get $timeline () {
    return this.$editor.timeline; 
  }  

  get $history () {
    return this.$editor.history; 
  }

  /**
   * @type {ShortCutManager} $shortcuts
   */
  get $shortcuts() {
    return this.$editor.shortcuts;
  }

  /**
   * @type {KeyBoardManager} $keyboardManager
   */
  get $keyboardManager () {
    return this.$editor.keyboardManager;
  }

  /**
   * @type {StorageManager} $storageManager
   */
  get $storageManager () {
    return this.$editor.storageManager;
  }

  /**
   * history 가 필요한 커맨드는 command 함수를 사용하자. 
   * 마우스 업 상태에 따라서 자동으로 history 커맨드로 분기해준다. 
   * 기존 emit 과 거의 동일하게 사용할 수 있다.   
   * 
   * @param {string} command 
   * @param {string} description 
   * @param {any[]} args 
   */

  command (command, description, ...args) {

    if (this.$editor.isPointerUp) {
      return this.emit(`history.${command}`, description, ...args);
    } else {
      return this.emit(command, ...args);
    }


  }

  $theme (key) {
    return this.$editor.themeValue(key);
  }
}

export default UIElement;
