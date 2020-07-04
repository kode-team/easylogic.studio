
import {
  isString,
  isUndefined,
  isNotString,
  isNotUndefined
} from "./functions/func";
import { DomDiff } from "./DomDiff";
import { Length } from "../editor/unit/Length";

export default class Dom {
  constructor(tag, className, attr) {
    if (isNotString(tag)) {
      this.el = tag;
    } else {
      var el = document.createElement(tag);

      if (className) {
        el.className = className;
      }

      attr = attr || {};

      for (var k in attr) {
        el.setAttribute(k, attr[k]);
      }

      this.el = el;
    }
  }

  static create (tag, className, attr) {
    return new Dom(tag, className, attr);
  }
 
  static createByHTML (htmlString) {
    var div = Dom.create('div')
    var list = div.html(htmlString).children();

    if (list.length) {
      return Dom.create(list[0].el);
    }

    return null; 
  }

  static getScrollTop() {
    return Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
  }

  static getScrollLeft() {
    return Math.max(
      window.pageXOffset,
      document.documentElement.scrollLeft,
      document.body.scrollLeft
    );
  }

  static parse(html) {
    var parser = DOMParser();
    return parser.parseFromString(html, "text/htmll");
  }

  static body () {
    return Dom.create(document.body)
  }

  // data (key, value) {

  //   var newKey = key.split('-').map( (it, index) => {
  //     if (index === 0) { return it }

  //     return it.substr(0, 1).toUpperCase() + it.substr(1);
  //   }).join(''); 

  //   if (arguments.length === 1) {
  //     return this.el.dataset(newKey);
  //   } else {
  //     this.el.dataset(newKey, value);
  //   }
    
  // }

  setAttr (obj) {
    Object.keys(obj).forEach(key => {
      this.attr(key, obj[key])
    })
    return this;  
  }

  attr(key, value) {
    if (arguments.length == 1) {
      return this.el.getAttribute(key);
    }

    this.el.setAttribute(key, value);

    return this;
  }

  attrKeyValue(keyField) {
    return {
      [this.el.getAttribute(keyField)]: this.val()
    }
  }

  attrs(...args) {
    return args.map(key => {
      return this.el.getAttribute(key);
    });
  }

  styles(...args) {
    return args.map(key => {
      return this.el.style[key];
    });
  }  

  removeAttr(key) {
    this.el.removeAttribute(key);

    return this;
  }

  removeStyle(key) {
    this.el.style.removeProperty(key);
    return this;
  }

  is(checkElement) {
    return this.el === (checkElement.el || checkElement);
  }

  isTag(tag) {
    return this.el.tagName.toLowerCase() === tag.toLowerCase()
  }

  closest(cls) {
    var temp = this;
    var checkCls = false;

    while (!(checkCls = temp.hasClass(cls))) {
      if (temp.el.parentNode) {
        temp = Dom.create(temp.el.parentNode);
      } else {
        return null;
      }
    }

    if (checkCls) {
      return temp;
    }

    return null;
  }

  parent() {
    return Dom.create(this.el.parentNode);
  }

  hasParent () {
    return !!this.el.parentNode
  }

  removeClass(...args) {
    this.el.classList.remove(...args);
    return this;
  }

  hasClass(cls) {
    if (!this.el.classList) return false;
    return this.el.classList.contains(cls);
  }

  addClass(...args) {
    this.el.classList.add(...args);

    return this;
  }

  onlyOneClass(cls) {
    var parent = this.parent();

    parent.children().forEach(it => {
      it.removeClass(cls);
    })

    this.addClass(cls);
  }

  toggleClass(cls, isForce) {
    this.el.classList.toggle(cls, isForce);
  }

  html(html) {
    if (isUndefined(html)) {
      return this.el.innerHTML;
    }

    if (isString(html)) {
      this.el.innerHTML = html;
    } else {
      this.empty().append(html);
    }

    return this;
  }

  htmlDiff(fragment) {
    DomDiff(this, fragment);
  }
  updateDiff (html, rootElement = 'div') {
    DomDiff(this, Dom.create(rootElement).html(html))
  }

  updateSVGDiff (html, rootElement = 'div') {

    DomDiff(this, Dom.create(rootElement).html(`<svg>${html}</svg>`).firstChild)
  }  

  find(selector) {
    return this.el.querySelector(selector);
  }

  $(selector) {
    var node = this.find(selector);
    return node ? Dom.create(node) : null;
  }

  findAll(selector) {
    return this.el.querySelectorAll(selector);
  }

  $$(selector) {
    var arr = this.findAll(selector);
    return Object.keys(arr).map(key => {
      return Dom.create(arr[key]);
    });
  }

  empty() {
    while (this.el.firstChild) this.el.removeChild(this.el.firstChild);
    return this;
  }

  append(el) {
    if (isString(el)) {
      this.el.appendChild(document.createTextNode(el));
    } else {
      this.el.appendChild(el.el || el);
    }

    return this;
  }

  prepend(el) {
    if (isString(el)) {
      this.el.prepend(document.createTextNode(el));
    } else {
      this.el.prepend(el.el || el);
    }

    return this;    
  }

  prependHTML(html) {
    var $dom = Dom.create("div").html(html);

    this.prepend($dom.createChildrenFragment());

    return $dom;
  }

  appendHTML(html) {
    var $dom = Dom.create("div").html(html);

    this.append($dom.createChildrenFragment());

    return $dom;
  }

  /**
   * create document fragment with children dom
   */
  createChildrenFragment() {
    const list = this.children();

    var fragment = document.createDocumentFragment();
    list.forEach($el => fragment.appendChild($el.el));

    return fragment;
  }

  appendTo(target) {
    var t = target.el ? target.el : target;

    t.appendChild(this.el);

    return this;
  }

  remove() {
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }

    return this;
  }

  removeChild(el) {
    this.el.removeChild(el.el || el);
    return this; 
  }

  text(value) {
    if (isUndefined(value)) {
      return this.el.textContent;
    } else {
      var tempText = value;

      if (value instanceof Dom) {
        tempText = value.text();
      }

      this.el.textContent = tempText;
      return this;
    }
  }

  /**
   *
   * $el.css`
   *  border-color: yellow;
   * `
   *
   * @param {*} key
   * @param {*} value
   */

  css(key, value) {
    if (isNotUndefined(key) && isNotUndefined(value)) {
      Object.assign(this.el.style, {[key]: value});
    } else if (isNotUndefined(key)) {
      if (isString(key)) {
        return getComputedStyle(this.el)[key];  
      } else {
        Object.assign(this.el.style, key);
      }
    }

    return this;
  }

  getComputedStyle (...list) {
    var css = getComputedStyle(this.el);

    var obj = {}
    list.forEach(it => {
      obj[it] = css[it]
    })

    return obj; 
  }

  getStyleList(...list) {
    var style = {};

    var len = this.el.style.length;
    for (var i = 0; i < len; i++) {
      var key = this.el.style[i];

      style[key] = this.el.style[key];
    }

    list.forEach(key => {
      style[key] = this.css(key);
    });

    return style;
  }

  cssText(value) {
    if (isUndefined(value)) {
      return this.el.style.cssText;
    }

    if (value != this.el.tempCssText) {
      this.el.style.cssText = value;
      this.el.tempCssText = value; 
    } 

    return this;
  }

  cssArray(arr) {
    if (arr[0]) this.el.style[arr[0]] = arr[1];
    if (arr[2]) this.el.style[arr[2]] = arr[3];
    if (arr[4]) this.el.style[arr[4]] = arr[5];
    if (arr[6]) this.el.style[arr[6]] = arr[7];
    if (arr[8]) this.el.style[arr[8]] = arr[9];

    return this;
  }

  cssFloat(key) {
    return parseFloat(this.css(key));
  }

  cssInt(key) {
    return parseInt(this.css(key));
  }

  px(key, value) {
    return this.css(key, Length.px(value));
  }

  rect() {
    return this.el.getBoundingClientRect();
  }

  isSVG () {
    return this.el.tagName.toUpperCase() === 'SVG';
  }

  offsetRect() {

    if (this.isSVG()) {
      const parentBox = this.parent().rect();
      const box = this.rect();

      return {
        x: box.x - parentBox.x,
        y: box.y - parentBox.y,
        top: box.x - parentBox.x,
        left: box.y - parentBox.y,
        width: box.width,
        height: box.height
      }
    }

    return {
      x: this.el.offsetLeft,
      y: this.el.offsetTop,
      top: this.el.offsetTop,
      left: this.el.offsetLeft,
      width: this.el.offsetWidth,
      height: this.el.offsetHeight
    };
  }

  offset() {
    var rect = this.rect();

    var scrollTop = Dom.getScrollTop();
    var scrollLeft = Dom.getScrollLeft();

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  }

  offsetLeft() {
    return this.offset().left;
  }

  offsetTop() {
    return this.offset().top;
  }

  position() {
    if (this.el.style.top) {
      return {
        top: parseFloat(this.css("top")),
        left: parseFloat(this.css("left"))
      };
    } else {
      return this.rect();
    }
  }

  size() {
    return [this.width(), this.height()];
  }

  width() {
    return this.el.offsetWidth || this.rect().width;
  }

  contentWidth() {
    return (
      this.width() -
      this.cssFloat("padding-left") -
      this.cssFloat("padding-right")
    );
  }

  height() {
    return this.el.offsetHeight || this.rect().height;
  }

  contentHeight() {
    return (
      this.height() -
      this.cssFloat("padding-top") -
      this.cssFloat("padding-bottom")
    );
  }

  val(value) {
    if (isUndefined(value)) {
      return this.el.value;
    } else if (isNotUndefined(value)) {
      var tempValue = value;

      if (value instanceof Dom) {
        tempValue = value.val();
      }

      this.el.value = tempValue;
    }

    return this;
  }

  matches (selector) {
    if (this.el) {

      if (!this.el.matches) return null;

      if (this.el.matches(selector)) {
        return this;
      }
      return this.parent().matches(selector);
    }

    return null;
}  


  get value() {
    return this.el.value;
  }

  get naturalWidth () {
    return this.el.naturalWidth
  }

  get naturalHeight () {
    return this.el.naturalHeight
  }  

  get files() {
    return this.el.files ? [...this.el.files] : [];
  }

  realVal() {
    switch (this.el.nodeType) {
      case "INPUT":
        var type = this.attr("type");
        if (type == "checkbox" || type == "radio") {
          return this.checked();
        }
      case "SELECT":
      case "TEXTAREA":
        return this.el.value;
    }

    return "";
  }

  int() {
    return parseInt(this.val(), 10);
  }

  float() {
    return parseFloat(this.val());
  }

  show(displayType = "block") {
    return this.css("display", displayType != "none" ? displayType : "block");
  }

  hide() {
    return this.css("display", "none");
  }

  isHide () {
    return this.css("display") == "none"
  }

  isShow () {
    return !this.isHide();
  }

  toggle(isForce) {
    var currentHide = this.isHide();

    if (arguments.length == 1) {
      if (isForce) {
        return this.show();
      } else {
        return this.hide();
      }
    } else {
      if (currentHide) {
        return this.show();
      } else {
        return this.hide();
      }
    }
  }

  get totalLength () {
    return this.el.getTotalLength()
  }

  scrollIntoView () {
    this.el.scrollIntoView()
  }

  addScrollLeft (dt) {
    this.el.scrollLeft += dt; 
    return this; 
  }

  addScrollTop (dt) {
    this.el.scrollTop += dt; 
    return this; 
  }  

  setScrollTop(scrollTop) {
    this.el.scrollTop = scrollTop;
    return this;
  }

  setScrollLeft(scrollLeft) {
    this.el.scrollLeft = scrollLeft;
    return this;
  }

  scrollTop() {
    if (this.el === document.body) {
      return Dom.getScrollTop();
    }

    return this.el.scrollTop;
  }

  scrollLeft() {
    if (this.el === document.body) {
      return Dom.getScrollLeft();
    }

    return this.el.scrollLeft;
  }

  scrollHeight() {
    return this.el.scrollHeight;
  }

  scrollWidth() {
    return this.el.scrollWidth;
  }  

  on(eventName, callback, opt1, opt2) {
    this.el.addEventListener(eventName, callback, opt1, opt2);

    return this;
  }

  off(eventName, callback) {
    this.el.removeEventListener(eventName, callback);

    return this;
  }

  getElement() {
    return this.el;
  }

  createChild(tag, className = '', attrs = {}, css = {}) {
    let $element = Dom.create(tag, className, attrs);
    $element.css(css);

    this.append($element);

    return $element;
  }

  get firstChild() {
    return Dom.create(this.el.firstElementChild);
  }

  children() {
    var element = this.el.firstElementChild;

    if (!element) {
      return [];
    }

    var results = [];

    do {
      results.push(Dom.create(element));
      element = element.nextElementSibling;
    } while (element);

    return results;
  }

  childLength() {
    return this.el.children.length;
  }

  replace(newElement) {

    if (this.el.parentNode) {
      this.el.parentNode.replaceChild(newElement.el || newElement, this.el);
    }

    return this;
  }

  replaceChild(oldElement, newElement) {
    this.el.replaceChild(newElement.el || newElement, oldElement.el || oldElement);

    return this;
  }  

  checked(isChecked = false) {
    if (arguments.length == 0) {
      return !!this.el.checked;
    }

    this.el.checked = !!isChecked;

    return this;
  }


  click () {
    this.el.click();

    return this; 
  }  

  focus() {
    this.el.focus();

    return this;
  }

  select() {
    this.el.select();
    return this;
  }

  blur() {
    this.el.blur();

    return this;
  }

  select() {
    this.el.select();

    return this;
  }

  // canvas functions

  context(contextType = "2d") {
    if (!this._initContext) {
      this._initContext = this.el.getContext(contextType);
    }

    return this._initContext;
  }

  resize({ width, height }) {
    // support hi-dpi for retina display
    this._initContext = null;
    var ctx = this.context();
    var scale = window.devicePixelRatio || 1;

    this.px("width", +width);
    this.px("height", +height);

    this.el.width = width * scale;
    this.el.height = height * scale;

    ctx.scale(scale, scale);
  }

  toDataURL (type = 'image/png', quality = 1) {
    return this.el.toDataURL(type, quality)
  }

  clear() {
    this.context().clearRect(0, 0, this.el.width, this.el.height);
  }

  update(callback) {
    this.clear();
    callback.call(this, this);
  }

  drawImage (img, dx = 0, dy = 0) {
    var ctx = this.context()
    var scale = window.devicePixelRatio || 1;    
    ctx.drawImage(img, dx, dy, img.width, img.height, 0, 0, this.el.width / scale, this.el.height / scale);
  }

  drawOption(option = {}) {
    var ctx = this.context();

    Object.assign(ctx, option);
  }

  drawLine(x1, y1, x2, y2) {
    var ctx = this.context();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }

  drawPath(...path) {
    var ctx = this.context();

    ctx.beginPath();

    path.forEach((p, index) => {
      if (index == 0) {
        ctx.moveTo(p[0], p[1]);
      } else {
        ctx.lineTo(p[0], p[1]);
      }
    });
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  drawCircle(cx, cy, r) {
    var ctx = this.context();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  drawText(x, y, text) {
    this.context().fillText(text, x, y);
  }

  /* utility */ 
  fullscreen () {
    var element = this.el; 
    
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.wekitRequestFullscreen) {
      element.wekitRequestFullscreen();
    }
  }
}
