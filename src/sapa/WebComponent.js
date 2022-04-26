import { Dom } from "sapa";
/**
 * UIElement 를 webcomponent 로 변환하여 사용할 수 있도록 한다.
 *
 * shadowRoot 에 render 를 할 수 있도록 한다.
 *
 * @param {UIElement} CustomUIElement
 * @returns {HTMLElement}
 */
export default function WebComponent(CustomUIElement) {
  // eslint-disable-next-line no-undef
  return class extends HTMLElement {
    constructor() {
      super();

      this._shadow = this.attachShadow({ mode: "open" });
      this._$container = Dom.create(this._shadow);
      this._comp = new CustomUIElement();

      //
      // 내부 UIElement 에서 emit 으로 customEvent 를 전달한다.
      // 이때 [eventName, args1, args2, ....] 형태로 전달한다.
      // this.emit("customEvent", "click", 2, 3, 4, 5)
      //
      // customEvent 로 받은 메세지는 HTMLElement 의 이벤트로 전달된다.
      //
      // eventName 을 CustomEvent 로 가지고 , detail 에는 args 가 그대로 들어간다.
      //
      // 자 이제 외부에서도 addEventListener 형태로 이벤트를 받을 수 있게 되었다.
      this._comp.on("customEvent", (eventName, ...args) => {
        this.dispatchEvent(
          // eslint-disable-next-line no-undef
          new CustomEvent(eventName, {
            bubbles: true,
            detail: args,
          })
        );
      });
    }

    static get observedAttributes() {
      return CustomUIElement.attributes || [];
    }

    connectedCallback() {
      const attrs = this.attributes;
      const props = {};
      for (let i = attrs.length - 1; i >= 0; i--) {
        props[attrs[i].name] = attrs[i].value;
      }

      this._comp._reload(props, this._$container);
    }

    disconnectedCallback() {
      this._comp.destroy();
      this._comp = null;
    }

    adoptedCallback() {
      console.log("Custom square element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this._comp._reload({
        ...this._comp.props,
        [name]: newValue,
      });
    }
  };
}
