import { MagicMethod, SPLITTER } from "./functions/MagicMethod";
import { variable } from "./functions/registElement";

export const makeEventChecker = (value, split = SPLITTER) => {
  return ` ${split} ${value}`;
};

const MULTI_PREFIX = "ME@";

export const PIPE = (...args) => {
  return args.join(SPLITTER);
};

export const EVENT = (...args) => {
  return MULTI_PREFIX + PIPE(...args);
};

export const COMMAND = EVENT;
export const ON = EVENT;

export const NAME_SAPARATOR = ":";
export const SAPARATOR = " ";

const refManager = {};

const DOM_EVENT_MAKE = (...keys) => {
  var key = keys.join(NAME_SAPARATOR);
  return (...args) => {
    const [selector, ...result] = args;
    return MagicMethod.make("domevent", [key, selector].join(" "), ...result);
  };
};

const SUBSCRIBE_EVENT_MAKE = (...args) => {
  return MagicMethod.make("subscribe", ...args);
};

const CALLBACK_EVENT_MAKE = (...args) => {
  return MagicMethod.make("callback", ...args);
};

const OBSERVER_EVENT_MAKE = (...args) => {
  return MagicMethod.make("observer", ...args);
};

// Predefined CHECKER
export const CHECKER = (value, split = SPLITTER) => {
  return makeEventChecker(value, split);
};

export const AFTER = (value, split = SPLITTER) => {
  return CHECKER(`after(${value})`, split);
};

export const BEFORE = (value, split = SPLITTER) => {
  return CHECKER(`before(${value})`, split);
};

export const IF = CHECKER;
export const KEY = CHECKER;

export const ARROW_UP = CHECKER("ArrowUp");
export const ARROW_DOWN = CHECKER("ArrowDown");
export const ARROW_LEFT = CHECKER("ArrowLeft");
export const ARROW_RIGHT = CHECKER("ArrowRight");
export const ENTER = CHECKER("Enter");
export const SPACE = CHECKER("Space");
export const ESCAPE = CHECKER("Escape");
export const BACKSPACE = CHECKER("Backspace");
export const DELETE = CHECKER("Delete");
export const EQUAL = CHECKER("Equal");
export const MINUS = CHECKER("Minus");
export const BRACKET_RIGHT = CHECKER("BracketRight");
export const BRACKET_LEFT = CHECKER("BracketLeft");

export const ALT = CHECKER("isAltKey");
export const SHIFT = CHECKER("isShiftKey");
export const META = CHECKER("isMetaKey");
export const CONTROL = CHECKER("isCtrlKey");
export const MOUSE = CHECKER("hasMouse");
export const TOUCH = CHECKER("hasTouch");
export const PEN = CHECKER("hasPen");
export const SELF = CHECKER("self");
export const LEFT_BUTTON = CHECKER("isMouseLeftButton");
export const RIGHT_BUTTON = CHECKER("isMouseRightButton");

export const FIT = CHECKER("fit");
export const PASSIVE = CHECKER("passive");
export const DOMDIFF = CHECKER("domdiff");

// event config method
export const DEBOUNCE = (t = 100) => {
  return CHECKER(`debounce(${t})`);
};

export const DELAY = (t = 300) => {
  return CHECKER(`delay(${t})`);
};

export const D1000 = DEBOUNCE(1000);

export const THROTTLE = (t = 100) => {
  return CHECKER(`throttle(${t})`);
};
export const ALL_TRIGGER = CHECKER("allTrigger()");
export const SELF_TRIGGER = CHECKER("selfTrigger()");
export const FRAME = CHECKER("frame()");

export const PARAMS = (obj) => {
  return CHECKER(`params(${variable(obj)})`);
};

export const CAPTURE = CHECKER("capture()");

// event config method

// before method

// after method
export const PREVENT = AFTER(`preventDefault`);
export const STOP = AFTER(`stopPropagation`);

export const SUBSCRIBE = SUBSCRIBE_EVENT_MAKE;
export const SUBSCRIBE_ALL = (...args) =>
  SUBSCRIBE_EVENT_MAKE(...args, ALL_TRIGGER);
export const SUBSCRIBE_SELF = (...args) =>
  SUBSCRIBE_EVENT_MAKE(...args, SELF_TRIGGER);
export const CONFIG = (config, ...args) =>
  SUBSCRIBE_EVENT_MAKE(`config:${config}`, ...args);

export const CALLBACK = CALLBACK_EVENT_MAKE;
export const RAF = CALLBACK("requestAnimationFrame");

export const OBSERVER = OBSERVER_EVENT_MAKE;

export const CUSTOM = DOM_EVENT_MAKE;
export const CLICK = DOM_EVENT_MAKE("click");
export const DOUBLECLICK = DOM_EVENT_MAKE("dblclick");
export const MOUSEDOWN = DOM_EVENT_MAKE("mousedown");
export const MOUSEUP = DOM_EVENT_MAKE("mouseup");
export const MOUSEMOVE = DOM_EVENT_MAKE("mousemove");
export const MOUSEOVER = DOM_EVENT_MAKE("mouseover");
export const MOUSEOUT = DOM_EVENT_MAKE("mouseout");
export const MOUSEENTER = DOM_EVENT_MAKE("mouseenter");
export const MOUSELEAVE = DOM_EVENT_MAKE("mouseleave");
export const TOUCHSTART = DOM_EVENT_MAKE("touchstart");
export const TOUCHMOVE = DOM_EVENT_MAKE("touchmove");
export const TOUCHEND = DOM_EVENT_MAKE("touchend");
export const KEYDOWN = DOM_EVENT_MAKE("keydown");
export const KEYUP = DOM_EVENT_MAKE("keyup");
export const KEYPRESS = DOM_EVENT_MAKE("keypress");
export const DRAG = DOM_EVENT_MAKE("drag");
export const DRAGSTART = DOM_EVENT_MAKE("dragstart");
export const DROP = DOM_EVENT_MAKE("drop");
export const DRAGOVER = DOM_EVENT_MAKE("dragover");
export const DRAGENTER = DOM_EVENT_MAKE("dragenter");
export const DRAGLEAVE = DOM_EVENT_MAKE("dragleave");
export const DRAGEXIT = DOM_EVENT_MAKE("dragexit");
export const DRAGOUT = DOM_EVENT_MAKE("dragout");
export const DRAGEND = DOM_EVENT_MAKE("dragend");
export const CONTEXTMENU = DOM_EVENT_MAKE("contextmenu");
export const CHANGE = DOM_EVENT_MAKE("change");
export const INPUT = DOM_EVENT_MAKE("input");
export const FOCUS = DOM_EVENT_MAKE("focus");
export const FOCUSIN = DOM_EVENT_MAKE("focusin");
export const FOCUSOUT = DOM_EVENT_MAKE("focusout");
export const BLUR = DOM_EVENT_MAKE("blur");
export const PASTE = DOM_EVENT_MAKE("paste");
export const RESIZE = DOM_EVENT_MAKE("resize");
export const SCROLL = DOM_EVENT_MAKE("scroll");
export const SUBMIT = DOM_EVENT_MAKE("submit");

// pointerstart 의 경우 drag 를 위한 시작점이기 때문에  left button 만 허용한다.
// context 메뉴나 wheel 은 허용하지 않는다.
export const POINTERSTART = (...args) => {
  return CUSTOM("pointerdown")(...args) + LEFT_BUTTON;
};
//

export const POINTEROVER = CUSTOM("pointerover");
export const POINTERENTER = CUSTOM("pointerenter");
export const POINTEROUT = CUSTOM("pointerout");
export const POINTERMOVE = CUSTOM("pointermove");
export const POINTEREND = CUSTOM("pointerup");
export const CHANGEINPUT = CUSTOM("change", "input");
export const WHEEL = CUSTOM("wheel", "mousewheel", "DOMMouseScroll");
export const ANIMATIONSTART = DOM_EVENT_MAKE("animationstart");
export const ANIMATIONEND = DOM_EVENT_MAKE("animationend");
export const ANIMATIONITERATION = DOM_EVENT_MAKE("animationiteration");
export const TRANSITIONSTART = DOM_EVENT_MAKE("transitionstart");
export const TRANSITIONEND = DOM_EVENT_MAKE("transitionend");
export const TRANSITIONRUN = DOM_EVENT_MAKE("transitionrun");
export const TRANSITIONCANCEL = DOM_EVENT_MAKE("transitioncancel");
export const DOUBLETAB = CUSTOM("doubletab");

// Predefined LOADER
export const LOAD = (value = "$el") => {
  return MagicMethod.make("load", value);
};

export const getRef = (id) => {
  return refManager[id] || "";
};

export const BIND_CHECK_FUNCTION = (field) => {
  return function () {
    return this.prevState[field] != this.state[field];
  };
};

export const BIND_CHECK_DEFAULT_FUNCTION = () => {
  return true;
};

export const BIND = (value = "$el") => {
  return MagicMethod.make("bind", value);
};

export function normalizeWheelEvent(e) {
  let dx = e.deltaX;
  let dy = e.deltaY;

  if (dx === 0 && e.shiftKey) {
    [dy, dx] = [dx, dy];
  }

  if (e.deltaMode === window.WheelEvent.DOM_DELTA_LINE) {
    dy *= 8;
  } else if (e.deltaMode === window.WheelEvent.DOM_DELTA_PAGE) {
    dy *= 24;
  }

  return [limit(dx, 24), limit(dy, 24), 0];
}

function limit(delta, maxDelta) {
  return Math.sign(delta) * Math.min(maxDelta, Math.abs(delta));
}

export default {
  addDomEvent(dom, eventName, callback, useCapture = false) {
    if (dom) {
      dom.addEventListener(eventName, callback, useCapture);
    }
  },

  removeDomEvent(dom, eventName, callback) {
    if (dom) {
      dom.removeEventListener(eventName, callback);
    }
  },

  pos(e) {
    if (e.touches && e.touches[0]) {
      return e.touches[0];
    }

    return e;
  },

  posXY(e) {
    var pos = this.pos(e);
    return {
      x: pos.pageX,
      y: pos.pageY,
    };
  },
};
