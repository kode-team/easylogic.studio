import { Dom } from "../functions/Dom";
import { getVariable } from "../functions/registElement";
import BaseHandler from "./BaseHandler";

export default class ObserverHandler extends BaseHandler {
  initialize() {
    this.destroy();

    // 이미 정의된 domEvents 가 있고 notEventRedefine 설정이 true 로 되어 있으면 이벤트를 한번만 설정한다.
    if (this._observers && this.context.notEventRedefine) {
      return;
    }

    if (!this._observers || this._observers.length === 0) {
      this._observers = this.context.filterMethodes("observer");
    }

    // binding 되어 있지 않고, domEvents 에 정의된 것만 있는 경우
    if (!this._bindings?.length && this._observers?.length) {
      this._observers.forEach((it) => this.parseObserver(it));
    }
  }

  destroy() {
    if (this.context.notEventRedefine) {
      // NOOP
    } else {
      this.removeEventAll();
    }
  }

  removeEventAll() {
    this.getBindings().forEach((observer) => {
      this.removeDomEvent(observer);
    });
    this.initBindings();
  }

  disconnectObserver(observer) {
    observer?.disconnect();
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

  addObserver(observer) {
    this.addBinding(observer);
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

  /**
   *
   * @param {MagicMethod} magicMethod
   * @param {*} callback
   * @returns
   */
  createObserver(magicMethod, callback) {
    const [observerType, observerTarget] = magicMethod.args || ["intersection"];

    // target 체크
    const $target = this.getDefaultDomElement(observerTarget);

    // 옵션 체크
    const params = magicMethod.getFunction("params");

    const options = getVariable(params?.args?.[0]);

    let observer;
    switch (observerType) {
      case "intersection":
        if (options.root) {
          options.root = this.getDefaultDomElement(options.root);
        }
        observer = new window.IntersectionObserver(callback, options || {});
        observer.observe($target);
        break;
      case "mutation":
        observer = new window.MutationObserver(callback);
        observer.observe(
          $target,
          options || {
            attributes: true,
            characterData: true,
            childList: true,
          }
        );
        break;
      case "performance":
        observer = new window.PerformanceObserver(callback);
        observer.observe(
          options || {
            entryTypes: ["paint"],
          }
        );
        break;
    }

    return observer;
  }

  bindingObserver(magicMethod, callback) {
    this.addObserver(this.createObserver(magicMethod, callback));
  }

  /**
   * 이벤트 문자열 파싱하기
   *
   * @param {MagicMethod} it
   */
  parseObserver(it) {
    const context = this.context;

    var originalCallback = context[it.originalMethod].bind(context);

    this.bindingObserver(it, originalCallback);
  }
}
