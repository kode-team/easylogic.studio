import BaseHandler from "./BaseHandler";
import { debounce, throttle } from "../functions/func";

export default class CallbackHandler extends BaseHandler {


  initialize() {
    this.destroy();

    if (!this._callbacks || this._callbacks.length === 0) {
      this._callbacks = this.context.filterProps('callback', true)
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

  getCallback(field) {
    return this.context[field];
  }



  removeCallbackAll() {
    this.getBindings().forEach(obj => {
      this.removeCallback(obj);
    });
    this.initBindings();
  }

  removeCallback({ requestId }) {
    cancelAnimationFrame(requestId);
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


  makeCallback(callbackObject, magicMethod) {

    const callback = callbackObject.callback;

    const run = (time) => {
      callback(time)
      callbackObject.requestId = requestAnimationFrame(run);
    };

    return () => {
      callbackObject.requestId = requestAnimationFrame(run)
    };
  }

  addCallback(callbackObject, magicMethod) {
    const callback = this.makeCallback(callbackObject, magicMethod);
    this.addBinding(callbackObject);

    // requestAnimationFrame 을 사용하는 경우
    callback();
  }


  bindingCallback(magicMethod, callback) {
    
    const obj = {
      eventName: magicMethod.args[0],
      callback
    }

    obj.codes = [];
    obj.checkMethodList = [];


    /** 함수 체크  */
    const debounceFunction = magicMethod.getFunction('debounce');
    const throttleFunction = magicMethod.getFunction('throttle');

    if (debounceFunction) {
      var debounceTime = +(debounceFunction.args?.[0] || 0);
      obj.callback = debounce(callback, debounceTime);
    } else if (throttleFunction) {
      var throttleTime = +(throttleFunction.args?.[0] || 0);
      obj.callback = throttle(callback, throttleTime);
    }

    /** 키워드 체크  */
    magicMethod.keywords.forEach(keyword => {
      const method = keyword;

      if (this.getCallback(method)) {
        obj.checkMethodList.push(method);
      } else {
        obj.codes.push(method.toLowerCase());

      }
    })

    this.addCallback(obj, magicMethod);
  };

  /**
   * 이벤트 문자열 파싱하기 
   * 
   * @param {string} key 
   */
  parseCallback(it) {

    const context = this.context;

    var arr = it.args;

    if (arr) {
      var originalCallback = context[it.originalMethod].bind(context);

      this.bindingCallback(it, originalCallback);      
    }    
  }
}