
import { uuid } from "./functions/math";

export const makeEventChecker = (value, split = CHECK_SAPARATOR) => {
  return ` ${split} ${value}`;
}

// event name regular expression
export const CHECK_LOAD_PATTERN = /^load (.*)/gi;
export const CHECK_BIND_PATTERN = /^bind (.*)/gi;

const CHECK_CLICK_PATTERN = "click|dblclick";
const CHECK_MOUSE_PATTERN = "mouse(down|up|move|over|out|enter|leave)";
const CHECK_POINTER_PATTERN = "pointer(start|move|end)";
const CHECK_TOUCH_PATTERN = "touch(start|move|end)";
const CHECK_KEY_PATTERN = "key(down|up|press)";
const CHECK_DRAGDROP_PATTERN = "drag|drop|drag(start|over|enter|leave|exit|end)";
const CHECK_CONTEXT_PATTERN = "contextmenu";
const CHECK_INPUT_PATTERN = "change|input|focus|blur|focus(in|out)";
const CHECK_CLIPBOARD_PATTERN = "paste";
const CHECK_BEHAVIOR_PATTERN = "resize|scroll|wheel|mousewheel|DOMMouseScroll";
const CHECK_FORM_PATTERN = "submit";
const CHECK_ANIMATION_PATTERN = 'animation(start|end|iteration)'

const CHECK_PATTERN_LIST = [
  CHECK_CLICK_PATTERN,
  CHECK_MOUSE_PATTERN,
  CHECK_POINTER_PATTERN,
  CHECK_TOUCH_PATTERN,
  CHECK_KEY_PATTERN,
  CHECK_DRAGDROP_PATTERN,
  CHECK_CONTEXT_PATTERN,
  CHECK_INPUT_PATTERN,
  CHECK_CLIPBOARD_PATTERN,
  CHECK_BEHAVIOR_PATTERN,
  CHECK_FORM_PATTERN,
  CHECK_ANIMATION_PATTERN
].join("|");

export const CHECK_PATTERN = new RegExp(`^(${CHECK_PATTERN_LIST})`, "ig");

export const NAME_SAPARATOR = ":";
export const CHECK_SAPARATOR = "|";
export const LOAD_SAPARATOR = "load ";
export const BIND_SAPARATOR = "bind ";
export const SAPARATOR = ' ';

// 임의의 값을 저장하기 위한 구조
// 임의의 값은 하나의 id 로 만들어지고 id 를 조회 할 때  값으로 다시 치환
const refManager = {};

const DOM_EVENT_MAKE = (...keys) => {
  var key = keys.join(NAME_SAPARATOR);
  return (...args) => {
    return [key, ...args].join(SAPARATOR);
  };
};

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
export const POINTERSTART = CUSTOM("mousedown", "touchstart");
export const POINTERMOVE = CUSTOM("mousemove", "touchmove");
export const POINTEREND = CUSTOM("mouseup", "touchend");
export const CHANGEINPUT = CUSTOM("change", "input");
export const WHEEL = CUSTOM("wheel", "mousewheel", "DOMMouseScroll");
export const ANIMATIONSTART = DOM_EVENT_MAKE('animationstart');
export const ANIMATIONEND = DOM_EVENT_MAKE('animationend');
export const ANIMATIONITERATION = DOM_EVENT_MAKE('animationiteration');

// Predefined CHECKER
export const CHECKER = (value, split = CHECK_SAPARATOR) => {
  return makeEventChecker(value, split);
};

export const AFTER = (value, split = CHECK_SAPARATOR) => {
  return makeEventChecker(`after(${value})`, split);
};

export const BEFORE = (value, split = CHECK_SAPARATOR) => {
  return makeEventChecker(`before(${value})`, split);  
};

export const IF = CHECKER;
export const KEY = CHECKER; 

export const KEY_ALT = "ALT";
export const KEY_SHIFT = "SHIFT";
export const KEY_META = "META";
export const KEY_CONTROL = "CONTROL";

export const KEY_ARROW_UP = "ArrowUp";
export const KEY_ARROW_DOWN = "ArrowDown";
export const KEY_ARROW_LEFT = "ArrowLeft";
export const KEY_ARROW_RIGHT = "ArrowRight";
export const KEY_ENTER = "Enter";
export const KEY_SPACE = "Space";

export const ARROW_UP = CHECKER(KEY_ARROW_UP);
export const ARROW_DOWN = CHECKER(KEY_ARROW_DOWN);
export const ARROW_LEFT = CHECKER(KEY_ARROW_LEFT);
export const ARROW_RIGHT = CHECKER(KEY_ARROW_RIGHT);
export const ENTER = CHECKER(KEY_ENTER);
export const SPACE = CHECKER(KEY_SPACE);

export const ALT = CHECKER("isAltKey");
export const SHIFT = CHECKER("isShiftKey");
export const META = CHECKER("isMetaKey");
export const CONTROL = CHECKER("isCtrlKey");
export const SELF = CHECKER("self");

export const FIT = CHECKER("fit");
export const PASSIVE = CHECKER("passive");
export const VDOM = CHECKER('vdom');

// event config method
export const DEBOUNCE = (t = 100) => {
  return CHECKER(`debounce(${t})`);
};

export const D1000 = DEBOUNCE(1000)

export const THROTTLE = (t = 100) => {
  return CHECKER(`throttle(${t})`);
};

export const CAPTURE = CHECKER("capture()");
// event config method

// before method

// after method
export const MOVE = (method = "move") => {
  return AFTER(`bodyMouseMove ${method}`);
};
export const END = (method = "end") => {
  return AFTER(`bodyMouseUp ${method}`);
};

export const PREVENT = AFTER(`preventDefault`);
export const STOP = AFTER(`stopPropagation`);

// Predefined LOADER
export const LOAD = (value = "$el") => {
  return LOAD_SAPARATOR + value;
};

export const createRef = value => {
  if (value === '') return '';

  var id = uuid();
  refManager[id] = value;

  return id;
};

export const getRef = id => {
  return refManager[id] || '';
};

export const BIND_CHECK_FUNCTION = field => {
  return function() {
    return this.prevState[field] != this.state[field];
  };
};

export const BIND_CHECK_DEFAULT_FUNCTION = () => {
  return true;
};

export const BIND = (value = "$el", checkFieldOrCallback = '') => {
  return (
    BIND_SAPARATOR + value + ( 
      checkFieldOrCallback ?  CHECK_SAPARATOR + createRef(checkFieldOrCallback) : '' 
    ) 
  );
};

export default {
  addEvent(dom, eventName, callback, useCapture = false) {
    if (dom) {
      dom.addEventListener(eventName, callback, useCapture);
    }
  },

  removeEvent(dom, eventName, callback) {
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
      y: pos.pageY
    };
  }
};
