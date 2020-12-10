import {
  CHECK_SAPARATOR,
  CHECK_LOAD_PATTERN,
  LOAD_SAPARATOR,
  LOAD,
  VDOM,
} from "./Event";
import Dom from "./Dom";
import {
  isFunction,
  isArray,
  html,
  keyEach,
  keyMap,
  collectProps
} from "./functions/func";
import { 
  ADD_BODY_MOUSEMOVE,
  ADD_BODY_MOUSEUP
} from "../types/event";
import { uuid } from "./functions/math";
import DomEventHandler from "./handler/DomEventHandler";
import BindHandler from "./handler/BindHandler";

const REFERENCE_PROPERTY = "ref";
const TEMP_DIV = Dom.create("div");
const QUERY_PROPERTY = `[${REFERENCE_PROPERTY}]`;


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
  "eachChildren": true,
  "destroy": true,
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
}

export default class EventMachine {
  constructor(opt, props) {
    this.state = {};
    this.prevState = {};
    this.refs = {};
    this.children = {};
    this._bindings = [];
    this.id = uuid();    
    this.handlers = this.initializeHandler()

    this.initializeProperty(opt, props);

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

  initializeHandler () {
    return [
      new BindHandler(this),
      new DomEventHandler(this)
    ]
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
    this.prevState = this.state;
    this.state = Object.assign({}, this.state, state );
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
    this.setState({
      [key]: !(this.state[key])
    }, isLoad)
  }

  /**
   * 객체를 다시 그릴 때 사용한다. 
   * 
   * @param {*} props 
   * @protected
   */
  _reload(props) {
    this.props = props;
    this.state = {}; 
    this.setState(this.initState(), false);
    this.refresh(true);
  }

  /**
   * template 을 렌더링 한다. 
   * 
   * @param {Dom|undefined} $container  컴포넌트가 그려질 대상 
   */
  render($container) {
    this.$el = this.parseTemplate(
      html`
        ${this.template()}
      `
    );
    this.refs.$el = this.$el;

    if ($container) {
      $container.append(this.$el);
    }

    // LOAD 로 정의된 것들을 수행한다. 
    this.load();

    // render 이후에 실행될 콜백을 정의한다. 
    this.afterRender();
  }

  initialize() {
    this.state = this.initState();
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
    const key = args.join('')
    return this.refs[key];
  }

  /**
   * template() 함수의 결과물을 파싱해서 dom element 를 생성한다. 
   * 
   * @param {string} html 
   * @param {Boolean} [isLoad=false] 
   */
  parseTemplate(html, isLoad) {

    if (isArray(html)) {
      html = html.join('');
    }

    html = html.trim();
    const list = TEMP_DIV.html(html).children();

    list.forEach($el => {
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

  /**
   * 실제 나의 instance 가 해당 부모의 자식으로 있는지 체크한다. 
   * 
   * @returns {Boolean}
   */
  exists () {

    if (this.parent) {
      if (isFunction(this.parent.childrenIds)) {
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

    $dom.$$('property').forEach($p => {
      const [name, value, type] = $p.attrs('name', 'value', 'type')

      let realValue = value || $p.text();

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

      // 동일한 refName 의 EventMachine 이 존재하면  해당 컴포넌트는 다시 그려진다. 
      // 루트 element 는 변경되지 않는다. 
      if (this.children[refName]) {
        instance = this.children[refName] 
        instance._reload(props);
      } else {
        // 기존의 refName 이 존재하지 않으면 Component 를 생성해서 element 를 교체한다. 
        instance = new Component(this, props);

        this.children[refName || instance.id] = instance;

        instance.render();
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
      const elName = callbackName.split(LOAD_SAPARATOR)[1]
                                 .split(CHECK_SAPARATOR)
                                 .map(it => it.trim())[0];
      if (!args.length) return true; 
      return args.indexOf(elName) > -1
    })
    .forEach(callbackName => {
      let methodName = callbackName.split(LOAD_SAPARATOR)[1];
      var [elName, ...checker] = methodName.split(CHECK_SAPARATOR).map(it => it.trim())

      checker = checker.map(it => it.trim())
      
      const isVdom = Boolean(checker.filter(it => VDOM.includes(it)).length);

      if (this.refs[elName]) {
        
        var newTemplate = this[callbackName].call(this, ...args);

        if (isArray(newTemplate)) {
          newTemplate = newTemplate.join('');
        }

        // create fragment 
        const fragment = this.parseTemplate(html`${newTemplate}`, true);
        if (isVdom) {
          this.refs[elName].htmlDiff(fragment);
        } else {
          this.refs[elName].html(fragment);
        }

      }
    });

    this.runHandlers('initialize');

    this.bindData();

    this.parseComponent();

  }

  runHandlers(func = 'run', ...args) {
    this.handlers.forEach(h => h[func](...args));
  }

  bindData (...args) {
    this.runHandlers('load', ...args);
  }

  // 기본 템플릿 지정
  template() {
    return `<div></div>`;
  }

  eachChildren(callback) {
    if (!isFunction(callback)) return;

    keyEach(this.children, (_, Component) => {
      callback(Component);
    });
  }

  rerender () {
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
    this.eachChildren(childComponent => {
      childComponent.destroy();
    });

    this.runHandlers('destroy');
    this.$el.remove();
    this.$el = null; 
    this.refs = {} 
    this.children = {} 
  }

  /**
   * property 수집하기
   * 상위 클래스의 모든 property 를 수집해서 리턴한다.
   * 
   * @returns {string[]} 나의 상위 모든 메소드를 수집해서 리턴한다. 
   */
  collectProps() {
    return collectProps(this, expectMethod);
  }

  filterProps(pattern) {
    return this.collectProps().filter(key => {
      return key.match(pattern);
    });
  }

  /* magic check method  */

  self(e) {
    return e && e.$dt && e.$dt.is(e.target);
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

}
