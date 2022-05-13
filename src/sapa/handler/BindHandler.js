import { BIND_CHECK_FUNCTION, BIND_CHECK_DEFAULT_FUNCTION } from "../Event";
import { isNumber, isObject } from "../functions/func";
import BaseHandler from "./BaseHandler";

const convertToPx = (key, value) => {
  if (isNumber(value)) {
    switch (key) {
      case "width":
      case "height":
      case "top":
      case "left":
      case "right":
      case "bottom":
        return value + "px";
    }
  }

  return value;
};

/**
 *
 * @param {Dom} $element
 * @param {string} key
 * @param {any} value
 * @param {boolean} [isServer=false]
 */
const applyElementAttribute = (
  $element,
  key,
  value,
  hasStyleAttribute = false
) => {
  if (key === "cssText") {
    /**
     * cssText: 'position:absolute'
     */
    $element.cssText(value);
    return;
  } else if (key === "style") {
    /**
     * style: { key: value }
     */
    if (typeof value !== "string") {
      const css = {};
      Object.entries(value).forEach(([key, value]) => {
        css[key] = convertToPx(key, value);
      });

      if (hasStyleAttribute) {
        const styleText = Object.keys(css)
          .map((key) => {
            return `${key}:${css[key]};`;
          })
          .join("");
        $element.attr("style", styleText);
      } else {
        $element.css(css);
      }
    }

    return;
  } else if (key === "class") {
    //  "class" : [ 'className', 'className' ]
    //  "class" : { key: true, key: false }
    //  "class" : 'string-class'

    if (Array.isArray(value)) {
      $element.addClass(...value.filter(Boolean));
    } else if (isObject(value)) {
      const keys = Object.keys(value);
      for (var i = 0, len = keys.length; i < len; i++) {
        const className = keys[i];
        const hasClass = value[className];

        $element.toggleClass(className, hasClass);
      }
    } else {
      $element.el.className = value;
    }

    return;
  } else if (key === "callback") {
    if (typeof value === "function") {
      value();
      return;
    }
  }

  if (typeof value === "undefined") {
    $element.removeAttr(key);
  } else {
    if ($element.el.nodeName === "TEXTAREA" && key === "value") {
      $element.text(value);
    } else if (key === "text" || key === "textContent") {
      $element.text(value);
    } else if (key === "innerHTML" || key === "html") {
      $element.html(value);
    } else if (key === "htmlDiff") {
      $element.updateDiff(value);
    } else if (key === "svgDiff") {
      $element.updateSVGDiff(value);
    } else if (key === "value") {
      $element.val(value);
    } else {
      $element.attr(key, value);
    }
  }
};

const FunctionMap = {};

/**
 * BindHandler
 *
 * 특정 dom 에 데이타를 바인딩해준다
 *
 * * class
 * * style
 * * attribute
 * * html
 * * htmlDiff
 * * svgDiff
 *
 * 기본적으로 클래스별 magic method 를 캐슁 하기 때문에
 * 실행하기전 항상 context 를 맞춰줘야 제대로 동작을 한다.
 *
 */

export default class BindHandler extends BaseHandler {
  async initialize() {
    // this.destroy();

    if (!FunctionMap[this.context.sourceName]) {
      FunctionMap[this.context.sourceName] =
        this.context.filterMethodes("bind");

      // this._bindMethods = FunctionMap[this.context.sourceName];
    }
  }

  getBindMethods() {
    return FunctionMap[this.context.sourceName] || [];
  }

  // 어떻게 실행하는게 좋을까?
  // this.runHandle('bind', ...);
  async bindData(...args) {
    // local 로 등록된 bind 를 모두 실행한다.
    // await this.bindLocalValue(...args);

    // method 가 캐쉬되어 있어서 캐쉬된 곳에서 가지고 와야 한다.
    const list = this.getBindMethods();

    if (!list?.length) return;

    /**
     * BIND 를 해보자.
     * 이시점에 하는게 맞는지는 모르겠지만 일단은 해보자.
     * BIND 는 특정 element 에 html 이 아닌 데이타를 업데이트하기 위한 간단한 로직이다.
     */
    const bindList = list?.filter((it) => {
      if (!args.length) return true;

      return args.indexOf(it.args[0]) > -1;
    });

    await Promise.all(
      bindList?.map(async (magicMethod) => {
        let refObject = this.getRef(`${magicMethod.keywords[0]}`);

        // if (!refObject) return;

        let refCallback = BIND_CHECK_DEFAULT_FUNCTION;

        if (typeof refObject === "string" && refObject !== "") {
          refCallback = BIND_CHECK_FUNCTION(refObject);
        } else if (typeof refObject === "function") {
          refCallback = refObject;
        }

        const elName = magicMethod.args[0];
        let $element = this.context.refs[elName];
        // isBindCheck 는 binding 하기 전에 변화된 지점을 찾아서 업데이트를 제한한다.
        const isBindCheck =
          typeof refCallback === "function" && refCallback.call(this.context);
        if ($element && isBindCheck) {
          // method 를 캐슁한  상태라서 context 를 바꿔서 실행해줘야함.
          const results = await magicMethod.executeWithContext(
            this.context,
            ...args
          );

          if (!results) return;

          const keys = Object.keys(results);
          for (
            var elementKeyIndex = 0, len = keys.length;
            elementKeyIndex < len;
            elementKeyIndex++
          ) {
            const key = keys[elementKeyIndex];
            const value = results[key];

            applyElementAttribute($element, key, value, this.context.isServer);
          }
        }
      })
    );
  }

  destroy() {
    this._bindMethods = undefined;
  }
}
