import { Dom } from "./functions/Dom";
import { isFunction, keyEach, collectProps, isObject } from "./functions/func";
import { MagicMethod } from "./functions/MagicMethod";
import {
  getVariable,
  hasVariable,
  recoverVariable,
  retriveElement,
  spreadVariable,
} from "./functions/registElement";
import { uuid } from "./functions/uuid";
import BindHandler from "./handler/BindHandler";
import CallbackHandler from "./handler/CallbackHandler";
import DomEventHandler from "./handler/DomEventHandler";
import ObserverHandler from "./handler/ObserverHandler";

const REFERENCE_PROPERTY = "ref";
const BIND_PROPERTY = "bind";
const LOAD_PROPERTY = "load";
const TEMP_DIV = Dom.create("div");
const QUERY_PROPERTY = `[${REFERENCE_PROPERTY}]`;
const REF_CLASS = "refclass";
const REF_CLASS_PROPERTY = `[${REF_CLASS}]`;

export class EventMachine {
  /**
   * local state
   *
   * @type {any}
   */
  #state = {};

  /**
   * previous local state
   *
   * @type {any}
   */
  #prevState = {};

  #refLoadVariables = {};
  #refBindVariables = {};
  #localTimestamp = 0;
  #loadMethods;
  #timestamp;
  #cachedMethodList;
  #props = {};
  #propsKeys = {};
  #isServer = false;
  #propsKeyList = [];
  #prefLoadTemplate = {};

  constructor(opt, props) {
    this.refs = {};
    this.children = {};
    this.id = uuid();

    this.initializeProperty(opt, props);

    this.handlers = this.initializeHandler();
    this.initComponents();
  }

  get refBindVariables() {
    return this.#refBindVariables;
  }

  get _timestamp() {
    return this.#localTimestamp++;
  }

  /**
   * for svelte variable
   */
  get target() {
    return this.$el.el;
  }

  /**
   * 매개변수를 체크한다.
   *
   * @param {object} props
   * @returns
   */
  checkProps(props = {}) {
    return props;
  }

  /**
   * UIElement instance 에 필요한 기본 속성 설정
   */
  initializeProperty(opt, props = {}) {
    this.opt = opt || {};
    this.parent = this.opt;
    this.source = uuid();
    this.sourceName = this.constructor.name;

    // props 를 대소문자 구분없이 조회할 수 있도록 proxy 객체 생성
    this.props = new Proxy(this.#props, {
      get: (target, key) => {
        return this.#getProp(key);
      },
      set: (target, key) => {
        throw new Error(`${key} is readonly`);
      },
    });

    this.#setProps(props);
  }

  #setProps(props) {
    this.#props = this.checkProps(props);
    this.#propsKeys = {};

    Object.keys(props).forEach((key) => {
      this.#propsKeys[key.toUpperCase()] = key;
    });
    this.#propsKeyList = Object.keys(this.#propsKeys);
  }

  #getProp(key) {
    return this.#props[this.#propsKeys[key.toUpperCase()]];
  }

  /**
   * props 에 key 가 존재하는지 체크
   *
   * @param {string} key
   * @returns {boolean}
   */
  hasProp(key) {
    return this.#propsKeyList.includes(key?.toUpperCase());
  }

  setServer(isServer = true) {
    this.#isServer = isServer;
  }

  get isServer() {
    return this.parent?.isServer || this.#isServer;
  }

  initComponents() {
    this.childComponents = this.components();
  }

  initializeHandler() {
    return [
      new BindHandler(this),
      new DomEventHandler(this),
      new CallbackHandler(this),
      new ObserverHandler(this),
    ];
  }

  /**
   * state 를 초기화 한것을 리턴한다.
   *
   * @protected
   * @returns {Object}
   */
  initState() {
    return {};
  }

  /**
   * state 를 변경한다.
   *
   * @param {Object} state  새로운 state
   * @param {Boolean} isLoad  다시 로드 할 것인지 체크 , true 면 state 변경후 다시 로드
   */
  setState(state = {}, isLoad = true) {
    this.#prevState = this.#state;
    this.#state = Object.assign({}, this.#state, state);

    if (isLoad) {
      this.load();
    }
  }

  /**
   * state 에 있는 key 필드의 값을 토글한다.
   * Boolean 형태의 값만 동작한다.
   *
   * @param {string} key
   * @param {Boolean} isLoad
   */
  toggleState(key, isLoad = true) {
    this.setState(
      {
        [key]: !this.#state[key],
      },
      isLoad
    );
  }

  /**
   * object 값을 그대로 key, value 형태로 넘기기 위한 함수
   *
   * @param {Object} obj
   * @returns {string} `key=value` 형태의 문자열 리스트
   */
  apply(obj) {
    return spreadVariable(obj);
  }

  /**
   * 객체를 다시 그릴 때 사용한다.
   *
   * @param {KeyValue} props
   * @param {Dom} [$container=null] $container 가 존재하면 render 를 같이 한다.
   * @protected
   */
  _reload(props, $container = null) {
    if ($container) {
      this.render($container);
    }

    this.#setProps(props);

    this.#state = {};
    this.setState(this.initState(), false);
    this.refresh(true);
  }

  /**
   * async render method
   *
   * @param {Dom|HTMLElement} $container
   */
  checkLoad($container) {
    window.requestAnimationFrame(() => {
      this.render($container);
    });
  }

  get state() {
    return this.#state;
  }

  /**
   * render 를 할 수 있는지 체크한다.
   *
   * @override
   */
  get isPreLoaded() {
    return true;
  }

  /**
   * template 을 렌더링 한다.
   *
   * @param {Dom|undefined} $container  컴포넌트가 그려질 대상
   * @param {Boolean} [isServer=false]  로드 여부
   */
  async render($container) {
    if (!this.isPreLoaded) {
      this.checkLoad($container);
      return;
    }

    const template = this.template();

    const newDomElement = this.parseTemplate(template);

    if (this.$el) {
      this.$el.htmlDiff(newDomElement);
    } else {
      this.$el = newDomElement;
      this.refs.$el = this.$el;

      if ($container) {
        $container.append(this.$el);
      }
    }

    // LOAD 로 정의된 것들을 수행한다.
    await this.load();

    // render 이후에 실행될 콜백을 정의한다.
    this.afterRender();

    return this;
  }

  get html() {
    return this.$el.outerHTML();
  }

  initialize() {
    this.#state = this.initState();
  }

  /**
   * render 이후에 실행될 함수
   * dom 이 실제로 생성된 이후에 수행할 작업들을 정의한다.
   *
   * @protected
   */
  afterRender() {}

  /**
   * 하위에 연결될 객체들을 정의한다
   *
   * @protected
   * @returns {Object}
   */
  components() {
    return {};
  }

  /**
   * ref 이름을 가진 Component 를 가지고 온다.
   *
   * @param  {any[]} args
   * @returns {EventMachine}
   */
  getRef(...args) {
    const key = args.join("");
    return this.refs[key];
  }

  /**
   * load 가 실행된 이후에  load 내부의 element 중에서
   * ref 가 존재하는데 등록되지 않은 element 들은 등록을 해준다.
   *
   * @param {Dom} targetRef
   */
  refreshElementReference(targetRef, refName) {
    var refs = targetRef.$$(QUERY_PROPERTY);

    for (
      var refsIndex = 0, refsLen = refs.length;
      refsIndex < refsLen;
      refsIndex++
    ) {
      const $dom = refs[refsIndex];

      const name = $dom.attr(REFERENCE_PROPERTY);

      // target 내부에 ref 가 존재할 때
      if (this.refs[name]) {
        // ref의 instance 를 서로 비교해서 다를 때만 넣는다.
        if (this.refs[name].is($dom) === false) {
          this.refs[name] = $dom;
        }
      } else {
        this.refs[name] = $dom;
      }
    }

    this.afterLoadRendering(targetRef, refName);
  }

  /**
   *
   * @param {Dom} targetRef
   * @param {string} refName
   */
  afterLoadRendering() {
    // noop
  }

  afterComponentRendering() {}

  parseLocalMethod($dom, name) {
    // load 변수와 bind 변수를 저장한다.
    const loadVariable = $dom.attr(LOAD_PROPERTY);
    const loadVariableRealFunction = getVariable(loadVariable);
    const bindVariable = $dom.attr(BIND_PROPERTY);
    const bindVariableRealFunction = getVariable(bindVariable);

    if (loadVariable && isFunction(loadVariableRealFunction)) {
      this.#refLoadVariables[name] = {
        key: loadVariable,
        ref: name,
        callback: loadVariableRealFunction,
      };
    }

    if (bindVariable && isFunction(bindVariableRealFunction)) {
      this.#refBindVariables[name] = {
        key: bindVariable,
        ref: name,
        callback: bindVariableRealFunction,
      };
    }
  }

  /**
   * template() 함수의 결과물을 파싱해서 dom element 를 생성한다.
   *
   * @param {string} html
   * @param {Boolean} [isLoad=false]
   */
  parseTemplate(html, isLoad) {
    /////////////////////////////////////////////////////////////////
    //FIXME: html string, element 형태 모두 array 로 받을 수 있도록 해보자.
    if (Array.isArray(html)) {
      html = html.join("");
    }

    html = (html || "").trim();

    const list = TEMP_DIV.html(html).childNodes || [];
    ///////////////////////////////////////////////////////////////

    for (var i = 0, len = list.length; i < len; i++) {
      const $el = list[i];

      var ref = $el.attr(REFERENCE_PROPERTY);
      if (ref) {
        if (!isLoad) {
          // FIXME: load 에서 정의되는건 따로 처리해야할 듯 하다.
          this.refs[ref] = $el;
        }
      }

      var refs = $el.$$(QUERY_PROPERTY);
      var temp = {};

      for (
        var refsIndex = 0, refsLen = refs.length;
        refsIndex < refsLen;
        refsIndex++
      ) {
        const $dom = refs[refsIndex];

        const name = $dom.attr(REFERENCE_PROPERTY);
        if (temp[name]) {
          console.warn(`${ref} is duplicated. - ${this.sourceName}`, this);
        } else {
          temp[name] = true;
        }

        // FIXME: load 에서 정의되는건 따로 처리해야할 듯 하다.
        if (!isLoad) {
          this.refs[name] = $dom;
        }

        // this.parseLocalMethod($dom, name);
      }
    }

    if (!isLoad) {
      return list[0];
    }

    return TEMP_DIV.createChildrenFragment();
  }

  /**
   * $dom 에 있는 props, children 정보만 가지고 온다.
   *
   * 이것을 가지고 오는 이유는  중첩된 컴포넌트 내에서 하위 컴포넌트를 찾기 위해서이다.
   *
   * ps.
   *
   * 조회만 하기 때문에 getVariable()로 값만 조회한다.
   *
   * @param {Dom} $dom
   * @returns
   */
  parsePropertyInfo($dom) {
    let props = {};

    // parse properties
    for (var t of $dom.attributes) {
      const name = t.name || t.nodeName;
      const value = t.value || t.nodeValue;
      // 속성값이 없고, 속성 이름이 참조 변수 일 때는  그대로 보여준다.
      if (hasVariable(name)) {
        const recoveredValue = getVariable(name);
        if (isObject(recoveredValue)) {
          props = Object.assign(props, recoveredValue);
        } else {
          props[name] = getVariable(value);
        }
      } else {
        props[name] = getVariable(value);
      }
    }

    // 하위 html 문자열을 props.content 로 저장한다.
    const content = $dom.html();
    if (content) {
      props.content = content;
      props.contentChildren = this.parseContent(props.content);
    }

    return props;
  }

  parseSourceName(obj) {
    if (obj.parent) {
      return [obj.sourceName, ...this.parseSourceName(obj.parent)];
    }

    return [obj.sourceName];
  }

  getEventMachineComponent(refClassName) {
    var EventMachineComponent =
      retriveElement(refClassName) || this.childComponents[refClassName];

    return EventMachineComponent;
  }

  createFunctionComponent(
    EventMachineComponent,
    props,
    BaseClass = EventMachine
  ) {
    class FunctionElement extends BaseClass {
      template() {
        return EventMachineComponent.call(this, this.props);
      }
    }

    return new FunctionElement(this, props);
  }

  createInstanceForComponent(EventMachineComponent, targetElement, props) {
    // external component
    if (EventMachineComponent.__proto__.name === "ProxyComponent") {
      return new EventMachineComponent({ target: targetElement, props });
    }

    if (
      EventMachineComponent.__proto__.name === "" &&
      isFunction(EventMachineComponent)
    ) {
      return this.createFunctionComponent(EventMachineComponent, props);
    }

    // return sapa component
    return new EventMachineComponent(this, props);
  }

  async renderComponent({ $dom, refName, component, props }) {
    var instance = null;

    // 동일한 refName 의 EventMachine 이 존재하면  해당 컴포넌트는 다시 그려진다.
    // 루트 element 는 변경되지 않는다.
    if (this.children[refName]) {
      // FIXME: svelte 컴포넌트를 어떻게 재로드 할지 고민해야함
      instance = this.children[refName];
      instance.#timestamp = this.#localTimestamp;
      instance._reload(props);
    } else {
      instance = this.createInstanceForComponent(
        component,
        $dom.$parent.el,
        props
      );

      instance.#timestamp = this.#localTimestamp;

      this.children[refName || instance.id] = instance;

      if (isFunction(instance.render)) {
        await instance.render();
      } else {
        // NOOP
        // console.log(instance);
      }
    }

    this.afterComponentRendering($dom, refName, instance, props);

    if (instance.renderTarget) {
      instance.$el?.appendTo(instance.renderTarget);
      $dom.remove();
    } else if (instance.$el) {
      $dom.replace(instance.$el);
    } else {
      // EventMachine 의 renderTarget 또는 $el 이 없으면
      // renderTarget 과 유사하지만 appendTo 를 하지 않는다.
      $dom.remove();
    }
  }

  /**
   * 특정 html 의 자식 컴포넌트(EventMachine)의 정보를 가지고 온다.
   *
   * @param {string} html
   * @param {string[]} filteredRefClass
   * @returns {object[]}  - { refName, EventMachineComponent, props, $dom, refClass }
   */
  parseContent(html, filteredRefClass = []) {
    return Dom.create("div")
      .html(html)
      .children()
      .map(($dom) => {
        return this._getComponentInfo($dom);
      })
      .filter((it) =>
        filteredRefClass.length === 0
          ? true
          : filteredRefClass.includes(it.refClass)
      );
  }

  /**
   * component 정보 얻어오기
   *
   * @param {Dom} $dom
   * @returns {Object}
   */
  _getComponentInfo($dom) {
    const refClass = $dom.attr(REF_CLASS);
    const EventMachineComponent = this.getEventMachineComponent(refClass);

    if (EventMachineComponent) {
      let props = this.parsePropertyInfo($dom);

      // get component class name
      let refName = $dom.attr(REFERENCE_PROPERTY);

      return {
        $dom,
        refClass,
        props,
        // variable 로 props 를 지정했을 수도 있기 때문에 props.ref 도 같이 사용한다.
        refName: refName || props.ref,
        component: EventMachineComponent,
      };
    } else {
      return {
        refClass,
        notUsed: true,
        $dom,
      };
    }
  }

  /**
   * element 를 기준으로 내부 component 리스트를 생성한다.
   *
   * @return {object[]}
   */
  getComponentInfoList($el) {
    if (!$el) return [];

    const children = [];

    // 하위에 refclass 를 가진 element 중에 마지막 지점인 컴포넌트만 조회한다.
    // 부모에 refclass 를 가지고 있는 경우는 그 다음 컴포넌트로 넘겨서 생성한다.
    // 이렇게 하지 않으면 최상위 부모에서 모든 하위 refclass 를 컴포넌트로 생성해버리는 문제가 생긴다.
    let targets = $el.$$(REF_CLASS_PROPERTY).filter((it) => {
      return (
        it.path().filter((a) => {
          return a.attr(REF_CLASS);
        }).length === 1
      );
    });

    targets.forEach(($dom) => {
      children.push(this._getComponentInfo($dom));
    });

    return children;
  }

  async parseComponent() {
    const $el = this.$el;
    const componentList = this.getComponentInfoList($el);

    await Promise.all(
      componentList.map(async (comp) => {
        if (comp.notUsed) {
          comp.$dom.remove();
          console.warn(`${comp.refClass} is not used.`);
        } else {
          await this.renderComponent(comp);
        }
      })
    );

    keyEach(this.children, (key, child) => {
      if (child.#timestamp !== this.#localTimestamp) {
        child.clean();
      }
    });
  }

  clean() {
    if (this.$el && !this.$el.hasParent()) {
      keyEach(this.children, (key, child) => {
        if (isFunction(child?.clean)) {
          child.clean();
        }
      });

      this.destroy();

      this.$el = null;
      return true;
    }
  }

  // removeChild(child) {
  //   if (this.children[child.props.ref]) {
  //     delete this.children[child.props.ref];
  //   }
  // }

  /**
   * refresh 는 load 함수들을 실행한다.
   */
  refresh() {
    this.load();
  }

  async _afterLoad() {
    // timestamp 기록
    this._timestamp;

    this.runHandlers("initialize");

    await this.bindData();

    await this.parseComponent();
  }

  // async loadLocalValue(refName) {
  //   let target = this.#refLoadVariables;

  //   if (refName && this.#refLoadVariables[refName]) {
  //     target = {
  //       [refName]: this.#refLoadVariables[refName],
  //     };
  //   }

  //   Object.keys(target).forEach(async (key) => {
  //     const loadObj = this.#refLoadVariables[key];
  //     const isDomDiff = loadObj.domdiff;
  //     var newTemplate = await loadObj.callback.call(this);

  //     if (Array.isArray(newTemplate)) {
  //       newTemplate = newTemplate.join("");
  //     }

  //     const targetRef = this.refs[loadObj.ref];
  //     // create fragment
  //     const fragment = this.parseTemplate(newTemplate, true);
  //     if (isDomDiff) {
  //       targetRef.htmlDiff(fragment);
  //     } else {
  //       targetRef.html(fragment);
  //     }
  //     this.refreshElementReference(targetRef, loadObj.ref);
  //   });
  // }

  async makeLoadAction(magicMethod) {
    const [elName, ...args] = magicMethod.args;

    let isDomDiff = magicMethod.hasKeyword("domdiff");

    const refTarget = this.refs[elName];

    if (refTarget) {
      var newTemplate = await magicMethod.execute(...args);

      if (Array.isArray(newTemplate)) {
        newTemplate = newTemplate.join("");
      }

      if (this.#prefLoadTemplate[elName] != newTemplate) {
        this.#prefLoadTemplate[elName] = newTemplate;
        // create fragment
        const fragment = this.parseTemplate(newTemplate, true);
        if (isDomDiff) {
          refTarget.htmlDiff(fragment);
        } else {
          refTarget.html(fragment);
        }
      } else {
        // console.log("newTemplate", newTemplate);
      }

      this.refreshElementReference(refTarget, elName);
    }
  }

  async load(...args) {
    if (!this.#loadMethods) {
      this.#loadMethods = this.filterMethodes("load");
    }

    // local 로 등록된 load 를 모두 실행한다.
    // await this.loadLocalValue(...args);

    // method 형태로 등록된 load 를 모두 실행한다.
    const filtedLoadMethodList = this.#loadMethods.filter((it) =>
      args.length === 0 ? true : it.args[0] === args[0]
    );
    // loop 가 비동기라 await 로 대기를 시켜줘야 나머지 html 업데이트에 대한 순서를 맞출 수 있다.
    await Promise.all(
      filtedLoadMethodList.map(async (magicMethod) => {
        await this.makeLoadAction(magicMethod);
      })
    );
    await this._afterLoad();
  }

  async runHandlers(func = "run", ...args) {
    await Promise.all(
      this.handlers
        .filter((h) => h[func])
        .map(async (h) => {
          await h[func](...args);
        })
    );
  }

  async bindData(...args) {
    await this.runHandlers("bindData", ...args);
  }

  // 기본 템플릿 지정
  template() {
    return null;
  }

  eachChildren(callback) {
    if (!isFunction(callback)) return;

    keyEach(this.children, (_, Component) => {
      callback(Component);
    });
  }

  hmr() {
    this.created();
    this.initialize();
    this.rerender();

    this.eachChildren((child) => {
      child.hmr();
    });
  }

  rerender() {
    var $parent = this.$el.parent();
    this.destroy();
    this.render($parent);
  }

  /**
   * 자원을 해제한다.
   * 이것도 역시 자식 컴포넌트까지 제어하기 때문에 가장 최상위 부모에서 한번만 호출되도 된다.
   *
   */
  destroy() {
    this.eachChildren((childComponent) => {
      childComponent.destroy();
    });

    this.runHandlers("destroy");
    if (this.$el) {
      this.$el.remove();
    }

    this.$el = null;
    this.refs = {};
    this.children = {};

    Object.values(this.#refLoadVariables).forEach((ref) => {
      recoverVariable(ref.key, true);
    });

    Object.values(this.#refBindVariables).forEach((ref) => {
      recoverVariable(ref.key, true);
    });

    this.#refLoadVariables = {};
    this.#refBindVariables = {};

    // this.parent.removeChild(this);
  }

  /**
   * property 수집하기
   * 상위 클래스의 모든 property 를 수집해서 리턴한다.
   *
   * @returns {string[]} 나의 상위 모든 메소드를 수집해서 리턴한다.
   */
  collectMethodes(refreshCache = false) {
    if (!this.#cachedMethodList || refreshCache) {
      this.#cachedMethodList = collectProps(this, (name) =>
        MagicMethod.check(name)
      ).map((it) => {
        return MagicMethod.parse(it, /*context*/ this);
      });
    }

    return this.#cachedMethodList;
  }

  filterMethodes(methodKey, refreshCache = false) {
    return this.collectMethodes(refreshCache).filter((it) => {
      return it.method === methodKey;
    });
  }
}
