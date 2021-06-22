import { CHECK_SAPARATOR, CHECK_SUBSCRIBE_PATTERN, SUBSCRIBE_SAPARATOR } from "./Event";
import EventMachine from "./EventMachine";
import { splitMethodByKeyword } from "./functions/func";

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
   * UIElement 가 생성될 때 호출되는 메소드 
   * @protected
   */
  created() {}

  getRealEventName(e, s = MULTI_PREFIX) {
    var startIndex = e.indexOf(s);
    return e.substr(startIndex < 0 ? 0 : startIndex + s.length);
  }

  splitMethod (events, keyword, defaultValue = 0) {
    var [methods, params] = splitMethodByKeyword(events.split(CHECK_SAPARATOR), keyword);

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

    this.filterProps(CHECK_SUBSCRIBE_PATTERN).forEach(key => {
      const events = this.getRealEventName(key, SUBSCRIBE_SAPARATOR);

      // support deboounce for store event 
      var [debounceSecond, debounceMethods] = this.splitMethod(events, 'debounce');
      var [throttleSecond, throttleMethods] = this.splitMethod(events, 'throttle');      
      var [_, allTriggerMethods] = this.splitMethod(events, 'allTrigger');            

      events
        .split(CHECK_SAPARATOR)
        .filter(it => {
          return (
              debounceMethods.indexOf(it) === -1 && 
              allTriggerMethods.indexOf(it) === -1 &&               
              throttleMethods.indexOf(it) === -1
          )
        })
        .map(it => it.trim())
        .forEach(e => {
          var callback = this[key].bind(this);
          callback.displayName = `${this.sourceName}.${e}`;
          callback.source = this.source;
          this.$store.on(e, callback, this, debounceSecond, throttleSecond, allTriggerMethods.length);
      });
    });
  }

  /**
   * 현재 UIElement 와 연결된 모든 메세지를 해제한다. 
   */
  destoryStoreSUBSCRIBE() {
    this.$store.offAll(this);
  }

  destroy () {
    super.destroy()

    this.destoryStoreSUBSCRIBE();
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

  broadcast(messageName, ...args) {
    Object.keys(this.children).forEach(key => {
      this.children[key].trigger(messageName, ...args);
    })
  }

  on (message, callback) {
    this.$store.on(message, callback);
  }

  off (message, callback) {
    this.$store.off(message, callback);
  }
}

export default UIElement;
