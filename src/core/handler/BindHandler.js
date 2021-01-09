import BaseHandler from "./BaseHandler";
import { keyEach, isUndefined, isFunction, isString, isNotString, isArray, isObject } from "../functions/func";
import { CHECK_BIND_PATTERN, BIND_CHECK_FUNCTION, CHECK_SAPARATOR, BIND_CHECK_DEFAULT_FUNCTION, BIND_SAPARATOR } from "../Event";
import Dom from "@core/Dom";

/**
 * 
 * @param {Dom} $element 
 * @param {string} key 
 * @param {any} value 
 */
const applyElementAttribute = ($element, key, value) => {

  if (key === 'cssText') {
    /**
     * cssText: 'position:absolute'
     */
    $element.cssText(value);
    return; 
  } else if (key === "style") {
    /**
     * style: { key: value }
     */
    if (isNotString(value)) {
      $element.css(value);
    }

    return;
  } else if (key === "class") {
    //  "class" : [ 'className', 'className' ] 
    //  "class" : { key: true, key: false } 
    //  "class" : 'string-class' 

    if (isArray(value)) {
      $element.addClass(...value);
    } else if (isObject(value)) {
      const keys = Object.keys(value);
      for(var i = 0, len = keys.length; i < len; i++) {
        const className = keys[i];
        const hasClass = value[className];

        $element.toggleClass(className, hasClass);
      }
    } else {
      $element.addClass(value);
    }

    return;
  } else if (key === 'callback') {
    if (isFunction(value)) {
      value ();
      return; 
    }
  }

  if (isUndefined(value)) {
    $element.removeAttr(key);
  } else {
    if ($element.el.nodeName === "TEXTAREA" && key === "value") {
      $element.text(value);
    } else if (key === 'text' || key === 'textContent') {
      $element.text(value);
    } else if (key === 'innerHTML' || key === 'html') {
      $element.html(value);
    } else if (key === 'value') {
      $element.val(value);
    } else {
      $element.attr(key, value);
    }
  }
};

export default class BindHandler extends BaseHandler {

    load (...args) {
      this.bindData(...args);
    }

    // 어떻게 실행하는게 좋을까? 
    // this.runHandle('bind', ...);
    async bindData (...args) {
      if (!this._bindMethods) {
        this._bindMethods = this.context.filterProps(CHECK_BIND_PATTERN);
      }
      /**
       * BIND 를 해보자.
       * 이시점에 하는게 맞는지는 모르겠지만 일단은 해보자.
       * BIND 는 특정 element 에 html 이 아닌 데이타를 업데이트하기 위한 간단한 로직이다.
       */
      await this._bindMethods
        .filter(originalCallbackName => {
          if (!args.length) return true; 
          var [callbackName, id] = originalCallbackName.split(CHECK_SAPARATOR);        
  
          var [_, $bind] = callbackName.split(' ')
  
          return args.indexOf($bind) >  -1 
        })
        .forEach(async (callbackName) => {
          const bindMethod = this.context[callbackName];
          var [callbackName, id] = callbackName.split(CHECK_SAPARATOR);
  
          const refObject = this.getRef(id);
          let refCallback = BIND_CHECK_DEFAULT_FUNCTION;
  
          if (refObject != '' && isString(refObject)) {
            refCallback = BIND_CHECK_FUNCTION(refObject);
          } else if (isFunction(refObject)) {
            refCallback = refObject;
          }
  
          const elName = callbackName.split(BIND_SAPARATOR)[1];
          let $element = this.context.refs[elName];
  
          // isBindCheck 는 binding 하기 전에 변화된 지점을 찾아서 업데이트를 제한한다.
          const isBindCheck = isFunction(refCallback) && refCallback.call(this.context);
          if ($element && isBindCheck) {
            const results = await bindMethod.call(this.context, ...args);

            if (!results) return;
  
            const keys = Object.keys(results);
            for(var elementKeyIndex = 0, len = keys.length; elementKeyIndex < len; elementKeyIndex++) {
              const key = keys[elementKeyIndex];
              const value = results[key];

              applyElementAttribute($element, key, value);
            }
          }
        });
    }    

    destroy() {
      this._bindMethods = undefined
    }


}