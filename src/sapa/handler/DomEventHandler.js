import Event, { SAPARATOR, NAME_SAPARATOR } from "../Event";
import { Dom } from "../functions/Dom";
import {
  debounce,
  throttle,
  isNotUndefined,
  isFunction,
} from "../functions/func";
import BaseHandler from "./BaseHandler";

const scrollBlockingEvents = {
  touchstart: true,
  touchmove: true,
  mousedown: true,
  mouseup: true,
  mousemove: true,
  // wheel, mousewheel 은 prevent 를 해야한다. 그래서 scroll blocking 을 막아야 한다.
  // 'wheel': true,
  // 'mousewheel': true
};

const eventConverts = {
  doubletab: "touchend",
};

const customEventNames = {
  doubletab: true,
};

const selfCheckMethods = {
  /* magic check method  */

  self(e) {
    return e && e.$dt && e.$dt.is(e.target);
  },

  isAltKey(e) {
    return e.altKey;
  },

  isCtrlKey(e) {
    return e.ctrlKey;
  },

  isShiftKey(e) {
    return e.shiftKey;
  },

  isMetaKey(e) {
    return e.metaKey || e.key == "Meta" || e.code.indexOf("Meta") > -1;
  },

  isMouseLeftButton(e) {
    return e.buttons === 1; // 1 is left button
  },

  isMouseRightButton(e) {
    return e.buttons === 2; // 2 is right button
  },

  hasMouse(e) {
    return e.pointerType === "mouse";
  },

  hasTouch(e) {
    return e.pointerType === "touch";
  },

  hasPen(e) {
    return e.pointerType === "pen";
  },

  /** before check method */

  /* after check method */

  preventDefault(e) {
    e.preventDefault();
    return true;
  },

  stopPropagation(e) {
    e.stopPropagation();
    return true;
  },
};

export default class DomEventHandler extends BaseHandler {
  initialize() {
    this.destroy();

    // 이미 정의된 domEvents 가 있고 notEventRedefine 설정이 true 로 되어 있으면 이벤트를 한번만 설정한다.
    if (this._domEvents && this.context.notEventRedefine) {
      return;
    }

    if (
      !this._domEvents ||
      this._domEvents.length === 0 ||
      this._bindings.length === 0
    ) {
      this._domEvents = this.context.filterMethodes("domevent");
    }

    // binding 되어 있지 않고, domEvents 에 정의된 것만 있는 경우
    if (!this._bindings?.length && this._domEvents?.length) {
      this._domEvents.forEach((it) => this.parseDomEvent(it));
    }
  }

  destroy() {
    if (this.context.notEventRedefine) {
      // NOOP
    } else {
      this.removeEventAll();
    }
  }

  getCallback(field) {
    return this.context[field] || selfCheckMethods[field];
  }

  removeEventAll() {
    this.getBindings().forEach((obj) => {
      this.removeDomEvent(obj);
    });
    this.initBindings();
  }

  removeDomEvent({ eventName, dom, callback }) {
    Event.removeDomEvent(dom, eventName, callback);
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
    // this._domEvents = [];
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

  hasDelegate(e, eventObject) {
    return this.matchPath(e.target || e.srcElement, eventObject.delegate);
  }

  makeCallback(eventObject, magicMethod, callback) {
    if (eventObject.delegate) {
      return this.makeDelegateCallback(eventObject, magicMethod, callback);
    } else {
      return this.makeDefaultCallback(eventObject, magicMethod, callback);
    }
  }

  makeDefaultCallback(eventObject, magicMethod, callback) {
    return (e) => {
      var returnValue = this.runEventCallback(
        e,
        eventObject,
        magicMethod,
        callback
      );
      if (isNotUndefined(returnValue)) {
        return returnValue;
      }
    };
  }

  makeDelegateCallback(eventObject, magicMethod, callback) {
    return (e) => {
      const delegateTarget = this.hasDelegate(e, eventObject);

      if (delegateTarget) {
        // delegate target 이 있는 경우만 callback 실행
        e.$dt = Dom.create(delegateTarget);

        var returnValue = this.runEventCallback(
          e,
          eventObject,
          magicMethod,
          callback
        );
        if (isNotUndefined(returnValue)) {
          return returnValue;
        }
      }
    };
  }

  runEventCallback(e, eventObject, magicMethod, callback) {
    const context = this.context;
    e.xy = Event.posXY(e);

    if (eventObject.beforeMethods.length) {
      eventObject.beforeMethods.every((before) => {
        return this.getCallback(before.target).call(context, e, before.param);
      });
    }

    if (this.checkEventType(e, eventObject)) {
      var returnValue = callback(e, e.$dt, e.xy);

      if (returnValue !== false && eventObject.afterMethods.length) {
        eventObject.afterMethods.forEach((after) => {
          return this.getCallback(after.target).call(context, e, after.param);
        });
      }

      return returnValue;
    }
  }

  checkEventType(e, eventObject) {
    const context = this.context;
    // 특정 keycode 를 가지고 있는지 체크
    var hasKeyCode = true;
    if (eventObject.codes.length) {
      hasKeyCode =
        (e.code
          ? eventObject.codes.indexOf(e.code.toLowerCase()) > -1
          : false) ||
        (e.key ? eventObject.codes.indexOf(e.key.toLowerCase()) > -1 : false);
    }

    // 체크 메소드들은 모든 메소드를 다 적용해야한다.
    var isAllCheck = true;
    if (eventObject.checkMethodList.length) {
      isAllCheck = eventObject.checkMethodList.every((field) => {
        var fieldValue = this.getCallback(field);
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
  }

  getDefaultDomElement(dom) {
    const context = this.context;
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
  }

  getRealEventName(eventName) {
    return eventConverts[eventName] || eventName;
  }

  getCustomEventName(eventName) {
    return customEventNames[eventName] ? eventName : "";
  }

  /**
   *
   * doubletab -> touchend 로 바뀜
   *
   * @param {string} eventName  이벤트 이름
   * @param {array} checkMethodFilters 매직 필터 목록
   */
  getDefaultEventObject(eventName, dom, delegate, magicMethod, callback) {
    const obj = {
      eventName: this.getRealEventName(eventName),
      customEventName: this.getCustomEventName(eventName),
      callback,
    };

    // eslint-disable-next-line no-unused-vars
    const [, , ...delegates] = magicMethod.args;

    obj.dom = this.getDefaultDomElement(dom);
    obj.delegate = delegates.join(SAPARATOR);
    obj.beforeMethods = [];
    obj.afterMethods = [];
    obj.codes = [];
    obj.checkMethodList = [];

    /** 함수 체크  */
    const debounceFunction = magicMethod.getFunction("debounce");
    const throttleFunction = magicMethod.getFunction("throttle");

    if (debounceFunction) {
      var debounceTime = +(debounceFunction.args?.[0] || 0);
      obj.callback = debounce(callback, debounceTime);
    } else if (throttleFunction) {
      var throttleTime = +(throttleFunction.args?.[0] || 0);
      obj.callback = throttle(callback, throttleTime);
    }

    /* 함수 리스트 체크 */
    const afterFunctionList = magicMethod.getFunctionList("after");
    const beforeFunctionList = magicMethod.getFunctionList("before");

    if (afterFunctionList.length) {
      afterFunctionList.forEach((afterFunction) => {
        var r = afterFunction.args[0].split(" ");
        var [target, param] = r;

        obj.afterMethods.push({
          target,
          param,
        });
      });
    }

    if (beforeFunctionList.length) {
      beforeFunctionList.forEach((beforeFunction) => {
        var r = beforeFunction.args[0].split(" ");
        var [target, param] = r;

        obj.beforeMethods.push({
          target,
          param,
        });
      });
    }

    /** 키워드 체크  */
    magicMethod.keywords.forEach((keyword) => {
      const method = keyword;

      if (this.getCallback(method)) {
        obj.checkMethodList.push(method);
      } else {
        obj.codes.push(method.toLowerCase());
      }
    });

    return obj;
  }

  addDomEvent(eventObject, magicMethod, callback) {
    eventObject.callback = this.makeCallback(
      eventObject,
      magicMethod,
      callback
    );
    this.addBinding(eventObject);

    var options = false;

    if (magicMethod.hasKeyword("capture")) {
      options = true;
    }

    if (scrollBlockingEvents[eventObject.eventName]) {
      options = {
        passive: true,
        capture: options,
      };
    }

    if (eventObject.dom) {
      Event.addDomEvent(
        eventObject.dom,
        eventObject.eventName,
        eventObject.callback,
        options
      );
    }
  }

  makeCustomEventCallback(eventObject, magicMethod, callback) {
    if (eventObject.customEventName === "doubletab") {
      var delay = 300;

      var delayFunction = magicMethod.getFunction("delay");

      if (delayFunction) {
        delay = +(delayFunction.args?.[0] || 0);
      }

      return (...args) => {
        if (!this.doubleTab) {
          this.doubleTab = {
            time: window.performance.now(),
          };
        } else {
          if (window.performance.now() - this.doubleTab.time < delay) {
            callback(...args);
          }

          this.doubleTab = null;
        }
      };
    }

    return callback;
  }

  bindingDomEvent([eventName, dom, ...delegate], magicMethod, callback) {
    let eventObject = this.getDefaultEventObject(
      eventName,
      dom,
      delegate,
      magicMethod,
      callback
    );

    // custom event callback 만들기
    eventObject.callback = this.makeCustomEventCallback(
      eventObject,
      magicMethod,
      eventObject.callback
    );

    this.addDomEvent(eventObject, magicMethod, eventObject.callback);
  }

  getEventNames(eventName) {
    let results = [];

    eventName.split(NAME_SAPARATOR).forEach((e) => {
      var arr = e.split(NAME_SAPARATOR);

      results.push.apply(results, arr);
    });

    return results;
  }

  /**
   * 이벤트 문자열 파싱하기
   *
   * @param {MagicMethod} it
   */
  parseDomEvent(it) {
    const context = this.context;
    var arr = it.args;

    if (arr) {
      var eventNames = this.getEventNames(arr[0]);

      var callback = context[it.originalMethod].bind(context);

      for (let i = 0, len = eventNames.length; i < len; i++) {
        arr[0] = eventNames[i];
        this.bindingDomEvent(arr, it, callback);
      }
    }
  }
}
