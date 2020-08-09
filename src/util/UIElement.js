import { uuid } from "./functions/math";
import EventMachine from "./EventMachine";
import { splitMethodByKeyword } from "./functions/func";

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

    this.opt = opt || {};
    this.parent = this.opt;
    this.props = props;
    this.source = uuid();
    this.sourceName = this.constructor.name;

    if (opt && opt.$store) {
      this.$store = opt.$store;
    }

    if (opt && opt.$editor) {
      this.$editor = opt.$editor; 
    }
  }

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

  destoryStoreEvent() {
    this.$store.offAll(this);
  }

  destroy () {
    super.destroy()

    this.destoryStoreEvent();
  }

  rerender() {
    super.rerender();

    this.initialize();

    this.initializeStoreEvent();
  }


  emit($1, $2, $3, $4, $5) {
    this.$store.source = this.source;
    this.$store.sourceContext = this; 
    this.$store.emit($1, $2, $3, $4, $5);
  }

  nextTick (callback) {
    this.$store.nextTick(callback);
  }

  trigger($1, $2, $3, $4, $5) {
    this.$store.source = this.source;
    this.$store.trigger($1, $2, $3, $4, $5);
  }

  on (message, callback) {
    this.$store.on(message, callback);
  }

  off (message, callback) {
    this.$store.off(message, callback);
  }


  // editor utility 

  $i18n (key) {
    return this.$editor.i18n(key);
  }

  $initI18n (key) {
    return this.$editor.initI18n(key);
  }

  get $config () {
    return this.$editor.config; 
  }

  get $selection () {
    return this.$editor.selection; 
  }

  get $timeline () {
    return this.$editor.timeline; 
  }  

  get $history () {
    return this.$editor.history; 
  }

  // history 가 필요한 커맨드는 command 함수를 사용하자. 
  // 마우스 업 상태에 따라서 자동으로 history 커맨드로 분기해준다. 
  // 기존 emit 과 거의 동일하게 사용할 수 있다.   
  command ($1, $2, $3, $4, $5) {
    return this.emit(this.$editor.history.createCommand($1), $2, $3, $4, $5);
  }

  $theme (key) {
    return this.$editor.themeValue(key);
  }
}

export default UIElement;
