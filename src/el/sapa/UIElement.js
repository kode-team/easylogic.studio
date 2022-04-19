import BaseStore from "./BaseStore";
import EventMachine from "./EventMachine";
import { uuidShort } from "./functions/uuid";
import { getVariable } from './functions/registElement';
import { isNotUndefined } from "./functions/func";

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

    // messaging store 설정 
    if (props.store) {
      this.__storeInstance = props.store;
    } else {
      this.__storeInstance = new BaseStore()
    }


      this.created();

      this.initialize();
  
      this.initializeStoreEvent();
  }

  createContext() {
    return {

    }
  }

  pushContext() {
    return this.contexts.push(this.createContext());
  }

  popContext() {
    return this.contexts.pop();
  }

  currentContext() {
    return this.contexts[this.contexts.length - 1];
  }

  setStore(storeInstance) {
    this.__storeInstance = storeInstance;
  }

  /**
   * 메세징 루트를 재정의 할 수 있음. 
   * 
   * @override
   */
  get $store() {
    return this.__storeInstance || this.parent.$store;
  }

  /**
   * UIElement 가 생성될 때 호출되는 메소드 
   * @protected
   */
  async created() { }

  getRealEventName(e, separator) {
    var startIndex = e.indexOf(separator);
    return e.substr(startIndex < 0 ? 0 : startIndex + separator.length);
  }

  createLocalCallback(event, callback) {
    var newCallback = callback.bind(this);
    newCallback.displayName = `${this.sourceName}.${event}`;
    newCallback.source = this.source;

    return newCallback;
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
    this.filterProps('subscribe').forEach(magicMethod => {

      const events = magicMethod.args.join(' ');

      const checkMethodList = [];
      const eventList = [];

      let debounce = 0;
      let throttle = 0;
      let isAllTrigger = false;
      let isSelfTrigger = false;
      let isFrameTrigger = false;

      // 함수 체크 
      const debounceFunction = magicMethod.getFunction('debounce');
      const throttleFunction = magicMethod.getFunction('throttle');
      const allTriggerFunction = magicMethod.getFunction('allTrigger');
      const selfTriggerFunction = magicMethod.getFunction('selfTrigger');
      const frameFunction = magicMethod.getFunction('frame');

      // console.log(magicMethod, allTriggerFunction, selfTriggerFunction, frameFunction, this);

      if (debounceFunction) {
        debounce = +(debounceFunction.args?.[0] || 0);
      }

      if (throttleFunction) {
        throttle = +(throttleFunction.args?.[0] || 0);
      }

      if (allTriggerFunction) {
        isAllTrigger = true;
      }

      if (selfTriggerFunction) {
        isSelfTrigger = true;
      }

      if (frameFunction) {
        isFrameTrigger = true;
      }


      /** 키워드 체크  */
      // console.log(magicMethod, magicMethod.keywords, this);
      magicMethod.keywords.forEach(keyword => {
        const method = keyword;
        if (this[method]) {
          checkMethodList.push(method);
        } else {
          eventList.push(method);
        }
      })

      const originalCallback = this[magicMethod.originalMethod];
      [...eventList, events]
        .filter(Boolean)
        .forEach((e) => {
          var callback = this.createLocalCallback(e, originalCallback)
          this.$store.on(e, callback, this, debounce, throttle, isAllTrigger, isSelfTrigger, checkMethodList, isFrameTrigger);
        });

    });
  }

  /**
   * 현재 UIElement 와 연결된 모든 메세지를 해제한다. 
   */
  destoryStoreSUBSCRIBE() {
    this.$store.offAll(this);
  }

  destroy() {
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
   * @param {number} [delay=0]  callback 이 실행될 딜레이 시간 설정 
   */
  nextTick(callback, delay = 0) {

    setTimeout(() => {
      this.$store.nextTick(callback);
    }, delay);

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

  /**
   * 자식 객체에게만 호출되는 메세지를 수행한다.
   * 
   * @param {string} messageName
   * @param {any[]} args
   */
  broadcast(messageName, ...args) {
    Object.keys(this.children).forEach(key => {
      this.children[key].trigger(messageName, ...args);
      this.children[key].broadcast(messageName, ...args);
    })
  }

  /**
   * message 이벤트에 주어진 callack 을 등록 
   * 동일한 메세지 명으로 callback 은 list 화 되어서 관리 됩니다. 
   * 
   * @param {string} message 이벤트 메세지 이름 
   * @param {Function} callback 메세지 지정시 실행될 함수
   */
  on(message, callback, debounceDelay = 0, throttleDelay = 0, enableAllTrigger = false, enableSelfTrigger = false, frame = false) {
    this.$store.on(message, callback, this.source, debounceDelay, throttleDelay, enableAllTrigger, enableSelfTrigger, [], frame);
  }

  off(message, callback) {
    this.$store.off(message, callback, this.source);
  }

  /**
   * 동적으로 subscribe 함수를 지정합니다. 
   * 
   * template 안에서 동적으로 수행할 수 있습니다. 
   * 
   * 이렇게 생성된 subscribe 함수는 외부에서는 실행 할수가 없는 SUBSCRIBE_SELF 로 생성됩니다. 
   * 
   * 함수 내부에서 context 를 유지하기 때문에 this 로 instance 에 접근 할 수 있습니다. 
   * 
   * @example
   * 
   * ```js
   * html`
   *     <div onClick=${this.subscribe(() => { 
   *        console.log('click is fired'); 
   *        console.log(this.source);
   *     })}>
   *        눌러주세요.
   *     </div>
   * `
   * ```
   * 
   * @param {Function} callback subscribe 함수로 지정할 callback 
   * @param {number} [debounceSecond=0] debounce 시간(ms)
   * @param {number} [throttleSecond=0] throttle 시간(ms)
   * @returns {string} function id 
   */
  subscribe(callback, debounceSecond = 0, throttleSecond = 0) {
    const id = `subscribe.${uuidShort()}`;

    const newCallback = this.createLocalCallback(id, callback);

    this.$store.on(id, newCallback, this, debounceSecond, throttleSecond, false, /*self trigger*/true);

    return id;
  }
}

export default UIElement;
