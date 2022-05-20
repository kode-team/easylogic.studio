import { BaseStore } from "./BaseStore";
import { EventMachine } from "./EventMachine";
import { uuidShort } from "./functions/uuid";

/**
 * UI 를 만드는 기본 단위
 *
 *
 * @property {Editor} $editor
 */
export class UIElement extends EventMachine {
  #storeInstance;

  constructor(opt, props = {}) {
    super(opt, props);

    // messaging store 설정
    if (props.store) {
      this.#storeInstance = props.store;
    } else {
      this.#storeInstance = new BaseStore();
    }

    this.created();

    this.initialize();
  }

  currentContext() {
    return this.contexts[this.contexts.length - 1];
  }

  setStore(storeInstance) {
    this.#storeInstance = storeInstance;
  }

  /**
   * 메세징 루트를 재정의 할 수 있음.
   *
   * @override
   */
  get $store() {
    return this.#storeInstance || this.parent.$store;
  }

  /**
   * UIElement 가 생성될 때 호출되는 메소드
   * @protected
   */
  async created() {}

  createLocalCallback(event, callback) {
    var newCallback = callback.bind(this);
    newCallback.displayName = `${this.sourceName}.${event}`;
    newCallback.source = this.source;

    return newCallback;
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
    window.setTimeout(() => {
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
    Object.keys(this.children).forEach((key) => {
      this.children[key].trigger(messageName, ...args);
      this.children[key].broadcast(messageName, ...args);
    });
  }

  /**
   * message 이벤트에 주어진 callack 을 등록
   * 동일한 메세지 명으로 callback 은 list 화 되어서 관리 됩니다.
   *
   * @param {string} message 이벤트 메세지 이름
   * @param {Function} callback 메세지 지정시 실행될 함수
   */
  on(
    message,
    callback,
    debounceDelay = 0,
    throttleDelay = 0,
    enableAllTrigger = false,
    enableSelfTrigger = false,
    frame = false
  ) {
    this.$store.on(
      message,
      callback,
      this.source,
      debounceDelay,
      throttleDelay,
      enableAllTrigger,
      enableSelfTrigger,
      [],
      frame
    );
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

    this.$store.on(
      id,
      newCallback,
      this,
      debounceSecond,
      throttleSecond,
      false,
      /*self trigger*/ true
    );

    return id;
  }

  /**
   * 함수형 컴포넌트 생성 함수
   *
   * @override
   * @param {Function} EventMachineComponent
   * @param {object} props
   * @param {UIElement} [baseClass=UIElement]
   * @returns
   */
  createFunctionComponent(EventMachineComponent, props, baseClass = UIElement) {
    return super.createFunctionComponent(
      EventMachineComponent,
      props,
      baseClass
    );
  }

  static createElementInstance(ElementClass, props) {
    if (ElementClass.__proto__.name === "") {
      class FunctionElement extends UIElement {
        template() {
          return ElementClass.call(this, this.props);
        }
      }

      return new FunctionElement(props, props);
    } else {
      return new ElementClass(props, props);
    }
  }
}
