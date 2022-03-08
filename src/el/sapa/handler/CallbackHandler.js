import BaseHandler from "./BaseHandler";
import { debounce, throttle } from "../functions/func";

export default class CallbackHandler extends BaseHandler {


  initialize() {
    this.destroy();

    if (!this._callbacks) {
      this._callbacks = this.context.filterProps('callback')
    }
    this._callbacks.forEach(key => this.parseCallback(key));
  }

  destroy() {
    if (this.context.notEventRedefine) {
      // NOOP
    } else {
      this.removeCallbackAll();
    }

  }


  removeCallbackAll() {
    this.getBindings().forEach(obj => {
      this.removeCallback(obj);
    });
    this.initBindings();
  }

  removeCallback({ animationFrameId }) {
    cancelAnimationFrame(animationFrameId);
  }

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


  matchPath(el, selector) {
    if (el) {
      if (el.matches(selector)) {
        return el;
      }
      return this.matchPath(el.parentElement, selector);
    }
    return null;
  }


  makeCallback(callbackObject, callback) {

    const run = (time) => {
      callback(time)
      callbackObject.requestId = requestAnimationFrame(run);
    };

    return () => {
      callbackObject.requestId = requestAnimationFrame(run)
    };
  }


  /**
   * 
   * doubletab -> touchend 로 바뀜 
   * 
   * @param {string} eventName  이벤트 이름 
   * @param {array} checkMethodFilters 매직 필터 목록  
   */
  getDefaultCallbackObject(callbackName, checkMethodFilters) {
    const context = this.context;
    let arr = checkMethodFilters;

    // context 에 속한 변수나 메소드 리스트 체크
    const checkMethodList = arr.filter(code => !!context[code]);

    // // 이벤트 정의 시점에 적용 되어야 하는 것들은 모두 method() 화 해서 정의한다.
    // const [afters, afterMethods] = splitMethodByKeyword(arr, "after");
    // const [befores, beforeMethods] = splitMethodByKeyword(arr, "before");
    // const [debounces, debounceMethods] = splitMethodByKeyword(arr, "debounce");
    // const [delays, delayMethods] = splitMethodByKeyword(arr, "delay");
    // const [throttles, throttleMethods] = splitMethodByKeyword(arr, "throttle");
    // const [captures] = splitMethodByKeyword(arr, "capture");

    // // 위의 5개 필터 이외에 있는 코드들은 keycode 로 인식한다.
    // const filteredList = [
    //   ...checkMethodList,
    //   ...afters,
    //   ...befores,
    //   ...delays,
    //   ...debounces,
    //   ...throttles,
    //   ...captures
    // ];

    // return {
    //   callbackName,
    //   captures,
    //   afterMethods,
    //   beforeMethods,
    //   delayMethods,
    //   debounceMethods,
    //   throttleMethods,
    //   checkMethodList
    // };
  }


  addCallback(callbackObject, callback) {
    callbackObject.callback = this.makeCallback(callbackObject, callback);
    this.addBinding(callbackObject);

    // requestAnimationFrame 을 사용하는 경우
    callbackObject.callback();
  }


  bindingCallback(callbackName, checkMethodFilters, originalCallback) {
    let callbackObject = this.getDefaultCallbackObject(callbackName, checkMethodFilters);


    if (callbackObject.debounceMethods.length) {
      var debounceTime = +callbackObject.debounceMethods[0].target;
      originalCallback = debounce(originalCallback, debounceTime);
    } else if (callbackObject.throttleMethods.length) {
      var throttleTime = +callbackObject.throttleMethods[0].target;
      originalCallback = throttle(originalCallback, throttleTime);
    }

    this.addCallback(callbackObject, originalCallback);
  };

  /**
   * 이벤트 문자열 파싱하기 
   * 
   * @param {string} key 
   */
  parseCallback(key) {

    // const context = this.context;
    // let checkMethodFilters = key.split(CHECK_SAPARATOR).map(it => it.trim()).filter(Boolean);

    // var prefix = checkMethodFilters.shift()
    // var callbackName = prefix.split(CALLBACK_SAPARATOR)[1];    

    // var originalCallback = context[key].bind(context);

    // this.bindingCallback(callbackName, checkMethodFilters, originalCallback);
  }
}