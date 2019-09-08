import Event, {
  CHECK_PATTERN,
  NAME_SAPARATOR,
  CHECK_SAPARATOR,
  SAPARATOR,
  CHECK_LOAD_PATTERN,
  LOAD_SAPARATOR,
  BIND_SAPARATOR,
  CHECK_BIND_PATTERN,
  BIND_CHECK_DEFAULT_FUNCTION,
  BIND_CHECK_FUNCTION,
  LOAD,
  VDOM
} from "./Event";
import Dom from "./Dom";
import {
  debounce,
  isFunction,
  isArray,
  html,
  keyEach,
  isNotUndefined,
  isUndefined,
  isString,
  isObject,
  keyMap,
  throttle,
  isNotString
} from "./functions/func";
import {
  ADD_BODY_MOUSEMOVE,
  ADD_BODY_MOUSEUP
} from "../csseditor/types/event";
import { uuid } from "./functions/math";


const REFERENCE_PROPERTY = "ref";
const TEMP_DIV = Dom.create("div");
const QUERY_PROPERTY = `[${REFERENCE_PROPERTY}]`;
const ATTR_lIST = [REFERENCE_PROPERTY]

const matchPath = (el, selector) => {
  if (el) {
    if (el.matches(selector)) {
      return el;
    }
    return matchPath(el.parentElement, selector);
  }
  return null;
};

const hasDelegate = (e, eventObject) => {
  return matchPath(e.target || e.srcElement, eventObject.delegate);
};

const makeCallback = (context, eventObject, callback) => {
  if (eventObject.delegate) {
    return makeDelegateCallback(context, eventObject, callback);
  } else {
    return makeDefaultCallback(context, eventObject, callback);
  }
};

const makeDefaultCallback = (context, eventObject, callback) => {
  return e => {
    var returnValue = runEventCallback(context, e, eventObject, callback);
    if (isNotUndefined(returnValue)) {
      return returnValue;
    }
  };
};

const makeDelegateCallback = (context, eventObject, callback) => {
  return e => {
    const delegateTarget = hasDelegate(e, eventObject);
    if (delegateTarget) {
      // delegate target 이 있는 경우만 callback 실행
      e.$delegateTarget = Dom.create(delegateTarget);

      var returnValue = runEventCallback(context, e, eventObject, callback);
      if (isNotUndefined(returnValue)) {
        return returnValue;
      }
    }
  };
};

const runEventCallback = (context, e, eventObject, callback) => {
  e.xy = Event.posXY(e);

  if (eventObject.beforeMethods.length) {
    eventObject.beforeMethods.every(before => {
      return context[before.target].call(context, e, before.param);
    });
  }

  if (checkEventType(context, e, eventObject)) {
    var returnValue = callback(e, e.$delegateTarget, e.xy);

    if (returnValue !== false && eventObject.afterMethods.length) {
      eventObject.afterMethods.forEach(after =>
        context[after.target].call(context, e, after.param)
      );
    }

    return returnValue;
  }
};

const checkEventType = (context, e, eventObject) => {
  // 특정 keycode 를 가지고 있는지 체크
  var hasKeyCode = true;
  if (eventObject.codes.length) {
    hasKeyCode =
      (e.code ? eventObject.codes.indexOf(e.code.toLowerCase()) > -1 : false) ||
      (e.key ? eventObject.codes.indexOf(e.key.toLowerCase()) > -1 : false);
  }

  // 체크 메소드들은 모든 메소드를 다 적용해야한다.
  var isAllCheck = true;
  if (eventObject.checkMethodList.length) {
    isAllCheck = eventObject.checkMethodList.every(field => {
      var fieldValue = context[field];    
      if (isFunction(fieldValue) && fieldValue) {
        // check method
        return fieldValue.call(context, e);
      } else if (isNotUndefined(fieldValue)) {

        // check field value
        return !!fieldValue;
      }
      return true;
    });
  }

  return hasKeyCode && isAllCheck;
};

const getDefaultDomElement = (context, dom) => {
  let el;

  if (dom) {
    el = context.refs[dom] || context[dom] || window[dom];
  } else {
    el = context.el || context.$el || context.$root;
  }

  if (el instanceof Dom) {
    return el.getElement();
  }

  return el;
};

export const splitMethodByKeyword = (arr, keyword) => {
  var filterKeys = arr.filter(code => code.indexOf(`${keyword}(`) > -1);
  var filterMaps = filterKeys.map(code => {
    var [target, param] = code
      .split(`${keyword}(`)[1]
      .split(")")[0]
      .trim()
      .split(" ");

    return { target, param };
  });

  return [filterKeys, filterMaps];
};

const getDefaultEventObject = (context, eventName, checkMethodFilters) => {
  let arr = checkMethodFilters;

  // context 에 속한 변수나 메소드 리스트 체크
  const checkMethodList = arr.filter(code => !!context[code]);

  // 이벤트 정의 시점에 적용 되어야 하는 것들은 모두 method() 화 해서 정의한다.
  const [afters, afterMethods] = splitMethodByKeyword(arr, "after");
  const [befores, beforeMethods] = splitMethodByKeyword(arr, "before");
  const [debounces, debounceMethods] = splitMethodByKeyword(arr, "debounce");
  const [throttles, throttleMethods] = splitMethodByKeyword(arr, "throttle");
  const [captures] = splitMethodByKeyword(arr, "capture");

  // 위의 5개 필터 이외에 있는 코드들은 keycode 로 인식한다.
  const filteredList = [
    ...checkMethodList,
    ...afters,
    ...befores,
    ...debounces,
    ...throttles,
    ...captures
  ];

  var codes = arr
    .filter(code => filteredList.indexOf(code) === -1)
    .map(code => code.toLowerCase());

  return {
    eventName,
    codes,
    captures,
    afterMethods,
    beforeMethods,
    debounceMethods,
    throttleMethods,
    checkMethodList
  };
};

const addEvent = (context, eventObject, callback) => {
  eventObject.callback = makeCallback(context, eventObject, callback);
  context.addBinding(eventObject);
  Event.addEvent(
    eventObject.dom,
    eventObject.eventName,
    eventObject.callback,
    !!eventObject.captures.length
  );
};

const bindingEvent = ( context, [eventName, dom, ...delegate], checkMethodFilters, callback ) => {
  let eventObject = getDefaultEventObject( context, eventName, checkMethodFilters);

  eventObject.dom = getDefaultDomElement(context, dom);
  eventObject.delegate = delegate.join(SAPARATOR);

  if (eventObject.debounceMethods.length) {
    var debounceTime = +eventObject.debounceMethods[0].target;
    callback = debounce(callback, debounceTime);
  } else if (eventObject.throttleMethods.length) {
    var throttleTime = +eventObject.throttleMethods[0].target;
    callback = throttle(callback, throttleTime);
  }

  addEvent(context, eventObject, callback);
};

const getEventNames = eventName => {
  let results = [];

  eventName.split(NAME_SAPARATOR).forEach(e => {
    var arr = e.split(NAME_SAPARATOR);

    results.push(...arr);
  });

  return results;
};

const parseEvent = (context, key) => {
  let checkMethodFilters = key.split(CHECK_SAPARATOR).map(it => it.trim());
  var eventSelectorAndBehave = checkMethodFilters.shift();

  var [eventName, ...params] = eventSelectorAndBehave.split(SAPARATOR);
  var eventNames = getEventNames(eventName);
  var callback = context[key].bind(context);

  eventNames.forEach(eventName => {
    bindingEvent(context, [eventName, ...params], checkMethodFilters, callback);
  });
};

const applyElementAttribute = ($element, key, value) => {

  if (key === 'cssText') {
    /**
     * cssText: 'position:absolute'
     */
    $element.cssText(value);
  } else if (key === "style") {
    /**
     * style: { key: value }
     */
    if (isNotString(value)) {
      // 문자열이 아니라 객체 일때는 직접 입력하는 방식으로
      keyEach(value, (sKey, sValue) => {
        if (!sValue) {
          $element.removeStyle(sKey);
        } else {
          $element.css(sKey, sValue);
        }
      });
    }

    return;
  } else if (key === "class") {
    // 문자열이 아닐 때는 문자열로 만들어 준다.

    /**
     * 
     * "class" : [ 'className', 'className' ] 
     * "class" : { key: true, key: false } 
     * "class" : 'string-class' 
     */

    if (isArray(value)) {
      $element.addClass(...value);
    } else if (isObject(value)) {
      keyEach(value, (className, hasClass) => $element.toggleClass(className, hasClass));
    } else {
      $element.addClass(value);
    }

    return;
  }

  if (isUndefined(value)) {
    $element.removeAttr(key);
  } else {
    if ($element.el.nodeName === "TEXTAREA" && key === "value") {
      $element.text(value);
    } else if (key === 'innerHTML') {
      $element.html(value);
    } else {
      $element.attr(key, value);
    }
  }
};

// collectProps 에서 제외될 메소드 목록 
const expectMethod = {
  "constructor": true,
  "initState": true,
  "refresh": true,
  "updateData": true,
  "constructor": true,
  "initializeProperty": true,
  "created": true,
  "getRealEventName": true,
  "initializeStoreEvent": true,
  "destoryStoreEvent": true,
  "destroy": true,
  "emit": true,
  "trigger": true,
  "on": true,
  "off": true,
  "setState": true,
  "_reload": true,
  "render": true,
  "initialize": true,
  "afterRender": true,
  "components": true,
  "getRef": true,
  "parseTemplate": true,
  "childrenIds": true,
  "exists": true,
  "parseProperty": true,
  "parseSourceName": true,
  "parseComponent": true,
  "clean": true,
  "refresh": true,
  "loadTemplate": true,
  "load": true,
  "bindData": true,
  "template": true,
  "templateClass": true,
  "eachChildren": true,
  "initializeEvent": true,
  "destroy": true,
  "destroyDomEvent": true,
  "initializeDomEvent": true,
  "collectProps": true,
  "filterProps": true,
  "self": true,
  "isAltKey": true,
  "isCtrlKey": true,
  "isShiftKey": true,
  "isMetaKey": true,
  "preventDefault": true,
  "stopPropagation": true,
  "bodyMouseMove": true,
  "bodyMouseUp": true,
  "getBindings": true,
  "addBinding": true,
  "initBindings": true,
  "removeEventAll": true,
  "removeEvent": true
}

export default class EventMachine {
  constructor() {
    this.state = {};
    this.prevState = {};
    this.refs = {};
    this.children = {};
    this._bindings = [];
    this.id = uuid();    

    this.initComponents();
  }

  initComponents() {
    this.childComponents = this.components();
    this.childComponentKeys = Object.keys(this.childComponents)
    this.childComponentSet = new Map();
    this.childComponentKeys.forEach(key => {
      this.childComponentSet.set(key.toLowerCase(), key);
    })
    this.childComponentKeysString = [...this.childComponentSet.keys()].join(',');
  }

  initState() {
    return {};
  }

  setState(state = {}, isLoad = true) {
    this.prevState = this.state;
    this.state = Object.assign({}, this.state, state );
    if (isLoad) {
      this.load();
    }
  }

  _reload(props) {
    // console.log(this, this.parent, this.parent.parent, props);
    this.props = props;
    this.setState(this.initState(), false);
    this.refresh(true);
  }

  render($container) {
    this.$el = this.parseTemplate(
      html`
        ${this.template()}
      `
    );
    this.refs.$el = this.$el;

    if ($container) $container.append(this.$el);

    this.load();
    this.parseComponent(false);

    this.afterRender();
  }

  initialize() {
    this.state = this.initState();
  }
  afterRender() {}
  components() {
    return {};
  }

  // ref 에 있는 객체를 좀 더 편하게 가지고 오고자 만들었다.
  // 예를 들어 ref='$xxxRadius' 라고 했을 때
  // this.refs[`$${type}Radius`] 처럼 이름을 재 구성하는 방식을 써야 하는데
  // this.getRef('$', type, 'Radius') 형태로 끝낼 수 있다.
  // 변수적용하기 좀 더 편해진다.
  // 사용은 각자가 알아서 ㅋ
  getRef(...args) {
    const key = args.join('')
    return this.refs[key];
  }

  parseTemplate(html, isLoad) {

    if (isArray(html)) {
      html = html.join('');
    }

    html = html.trim();
    const list = TEMP_DIV.html(html).children();

    list.forEach($el => {
      // ref element 정리
      var ref = $el.attr(REFERENCE_PROPERTY)
      if (ref) {
        this.refs[ref] = $el;
      }

      var refs = $el.$$(QUERY_PROPERTY);
      var temp = {} 
      refs.forEach($dom => {

        const name = $dom.attr(REFERENCE_PROPERTY);
        if (temp[name]) {
          console.warn(`${ref} is duplicated. - ${this.sourceName}`, this)
        } else {
          temp[name] = true; 
        }

        this.refs[name] = $dom;        
      });


    });

    if (!isLoad) {
      return list[0];
    }

    return TEMP_DIV.createChildrenFragment();
  }

  childrenIds() {
    return  keyMap(this.children, (key, obj) => {
      return obj.id;
    })
  }

  exists () {

    if (this.parent) {
      if (this.parent.childrenIds) {
        return this.parent.childrenIds().indexOf(this.id) > -1 
      }
    }

    return true  
  }

  parseProperty ($dom) {
    let props = {};

    // parse properties 
    for(var t of $dom.el.attributes) {
      props[t.nodeName] = t.nodeValue;
    }

    // property 태그는 속성으로 대체 
    $dom.$$('property').forEach($p => {
      const [name, value, type] = $p.attrs('name', 'value', 'type')

      let realValue = value || $p.text();

      // JSON 타입이면 JSON.parse 로 객체를 복원해서 넘겨준다. 
      if (type === 'json') {            
        realValue = JSON.parse(realValue);
      }
    
      props[name] = realValue; 
    })

    return props;
  }

  parseSourceName(obj) {

    if (obj.parent) {
      return [obj.sourceName, ...this.parseSourceName(obj.parent)]
    }

    return [obj.sourceName]
  }

  parseComponent() {
    const $el = this.$el;

    let targets = [] 
    if (this.childComponentKeysString) {
      targets = $el.$$(this.childComponentKeysString);
    }

    
    targets.forEach($dom => {
      var tagName = $dom.el.tagName.toLowerCase();
      var ComponentName = this.childComponentSet.get(tagName);
      var Component = this.childComponents[ComponentName];
      let props = this.parseProperty($dom);

      // create component 
      let refName = $dom.attr(REFERENCE_PROPERTY);
      var instance = null; 
      if (this.children[refName]) {
        //  기존의 같은 객체가 있으면 객체를 새로 생성하지 않고 재활용한다. 
        instance = this.children[refName] 
        instance._reload(props);
      } else {
        instance = new Component(this, props);

        this.children[refName || instance.id] = instance;

        instance.render();
        instance.initializeEvent();  
      }
      
      $dom.replace(instance.$el);      
  
    })

    keyEach(this.children, (key, obj) => {
      if (obj && obj.clean()) {
        delete this.children[key]
      }
    })
  }

  clean () {
    if (this.$el && !this.$el.hasParent()) {

      keyEach(this.children, (key, child) => {
        child.clean();
      })

      this.destroy();  

      this.$el = null;
      return true; 
    }
  }

  /**
   * refresh 는 load 함수들을 실행한다. 
   */
  refresh() {
    this.load()
  }

  /**
   * 특정 load 함수를 실행한다.  문자열을 그대로 return 한다. 
   * @param  {...any} args 
   */
  loadTemplate (...args) {
    return this[LOAD(args.join(''))].call(this)
  }

  load(...args) {
    if (!this._loadMethods) {
      this._loadMethods = this.filterProps(CHECK_LOAD_PATTERN);
    }

    this._loadMethods
    .filter(callbackName => {
      const elName = callbackName.split(LOAD_SAPARATOR)[1].split(CHECK_SAPARATOR)[0];
      if (!args.length) return true; 
      return args.indexOf(elName) > -1
    })
    .forEach(callbackName => {
      let methodName = callbackName.split(LOAD_SAPARATOR)[1];
      var [elName, ...checker] = methodName.split(CHECK_SAPARATOR).map(it => it.trim())

      checker = checker.map(it => it.trim())

      var isVdom = checker.indexOf(VDOM.value) > -1;

      if (this.refs[elName]) {
        
        var newTemplate = this[callbackName].call(this, ...args);

        if (isArray(newTemplate)) {
          newTemplate = newTemplate.join('');
        }


        const fragment = this.parseTemplate(html`${newTemplate}`, true);

        if (isVdom) {
          this.refs[elName].htmlDiff(fragment);
        } else {
          this.refs[elName].html(fragment);
        }

        // 새로운 html 이 로드가 되었으니 
        // 이벤트를 재설정 하자. 
        // 그래야 refs 에 있던 객체를 다시 사용할 수 있다. 
        this.initializeDomEvent()
      }
    });

    this.bindData();

    this.parseComponent();
    
  }

  bindData (...args) {
    if (!this._bindMethods) {
      this._bindMethods = this.filterProps(CHECK_BIND_PATTERN);
    }
    /**
     * BIND 를 해보자.
     * 이시점에 하는게 맞는지는 모르겠지만 일단은 해보자.
     * BIND 는 특정 element 에 html 이 아닌 데이타를 업데이트하기 위한 간단한 로직이다.
     */
    this._bindMethods
      .filter(originalCallbackName => {
        if (!args.length) return true; 
        var [callbackName, id] = originalCallbackName.split(CHECK_SAPARATOR);        

        var [_, $bind] = callbackName.split(' ')

        return args.indexOf($bind) >  -1 
      })
      .forEach(callbackName => {
        const bindMethod = this[callbackName];
        var [callbackName, id] = callbackName.split(CHECK_SAPARATOR);

        const refObject = this.getRef(id);
        let refCallback = BIND_CHECK_DEFAULT_FUNCTION;

        if (refObject != '' && isString(refObject)) {
          refCallback = BIND_CHECK_FUNCTION(refObject);
        } else if (isFunction(refObject)) {
          refCallback = refObject;
        }

        const elName = callbackName.split(BIND_SAPARATOR)[1];
        let $element = this.refs[elName];

        // isBindCheck 는 binding 하기 전에 변화된 지점을 찾아서 업데이트를 제한한다.
        const isBindCheck = isFunction(refCallback) && refCallback.call(this);
        if ($element && isBindCheck) {
          const results = bindMethod.call(this, ...args);

          if (!results) return;

          keyEach(results, (key, value) => {
            applyElementAttribute($element, key, value);
          });
        }
      });
  }

  // 기본 템플릿 지정
  template() {
    var className = this.templateClass();
    var classString = className ? `class="${className}"` : '';

    return `<div ${classString}></div>`;
  }

  templateClass() {
    return null;
  }

  eachChildren(callback) {
    if (!isFunction(callback)) return;

    keyEach(this.children, (_, Component) => {
      callback(Component);
    });
  }

  /**
   * 이벤트를 초기화한다.
   */
  initializeEvent() {
    this.initializeDomEvent();
  }

  /**
   * 자원을 해제한다.
   * 이것도 역시 자식 컴포넌트까지 제어하기 때문에 가장 최상위 부모에서 한번만 호출되도 된다.
   */
  destroy() {
    this.eachChildren(childComponent => {
      childComponent.destroy();
    });

    this.destroyDomEvent();
  }

  destroyDomEvent() {
    this.removeEventAll();
  }

  initializeDomEvent() {
    this.destroyDomEvent();

    if (!this._domEvents) {
      this._domEvents = this.filterProps(CHECK_PATTERN)
    }
    this._domEvents.forEach(key => parseEvent(this, key));
  }

  /**
   * property 수집하기
   * 상위 클래스의 모든 property 를 수집해서 리턴한다.
   */
  collectProps() {

    var p = this.__proto__;
    var results = [];
    do {
      var isObject = p instanceof Object;

      if (isObject === false) {
        break;
      }
      const names = Object.getOwnPropertyNames(p).filter(name => {
        return isFunction(this[name]) && !expectMethod[name];
      });

      results.push(...names);
      p = p.__proto__;
    } while (p);

    return results;
  }

  filterProps(pattern) {
    return this.collectProps().filter(key => {
      return key.match(pattern);
    });
  }

  /* magic check method  */

  self(e) {
    return e && e.$delegateTarget && e.$delegateTarget.is(e.target);
  }
  isAltKey(e) {
    return e.altKey;
  }
  isCtrlKey(e) {
    return e.ctrlKey;
  }
  isShiftKey(e) {
    return e.shiftKey;
  }
  isMetaKey(e) {
    return e.metaKey || e.key == 'Meta' || e.code.indexOf('Meta') > -1 ;
  }

  /* magic check method */

  /** before check method */

  /** before check method */

  /* after check method */

  preventDefault(e) {
    e.preventDefault();
    return true;
  }

  stopPropagation(e) {
    e.stopPropagation();
    return true;
  }

  bodyMouseMove(e, methodName) {
    if (this[methodName]) {
      this.emit(ADD_BODY_MOUSEMOVE, this[methodName], this, e.xy);
    }
  }

  bodyMouseUp(e, methodName) {
    if (this[methodName]) {
      this.emit(ADD_BODY_MOUSEUP, this[methodName], this, e.xy);
    }
  }
  /* after check method */

  getBindings() {
    if (!this._bindings) {
      this.initBindings();
    }

    return this._bindings;
  }

  addBinding(obj) {
    this.getBindings().push(obj);
  }

  initBindings() {
    this._bindings = [];
  }

  removeEventAll() {
    this.getBindings().forEach(obj => {
      this.removeEvent(obj);
    });
    this.initBindings();
  }

  removeEvent({ eventName, dom, callback }) {
    Event.removeEvent(dom, eventName, callback);
  }
}
