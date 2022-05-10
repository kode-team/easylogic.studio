import { AFTER } from "sapa";

/** Custom Global Event Functions */

export const ADD_BODY_FIRST_MOUSEMOVE = "add/body/first/mousemove";
export const ADD_BODY_MOUSEMOVE = "add/body/mousemove";
export const ADD_BODY_MOUSEUP = "add/body/mouseup";

export const FIRSTMOVE = (method = "move") => {
  return AFTER(`bodyMouseFirstMove ${method}`);
};

export const MOVE = (method = "move") => {
  return AFTER(`bodyMouseMove ${method}`);
};

export const END = (method = "end") => {
  return AFTER(`bodyMouseUp ${method}`);
};

/**
 * viewport 가 수정되었을 때
 *
 * @type {string}
 */
export const UPDATE_VIEWPORT = "updateViewport";

/**
 * fullscreen 모드로 변환
 *
 * @type {string}
 */
export const TOGGLE_FULLSCREEN = "toggle.fullscreen";

/**
 * selection 정보 갱신
 *
 * @type {string}
 */
export const REFRESH_SELECTION = "refreshSelection";

export const REFRESH_CONTENT = "refreshContent";

export const SHOW_COMPONENT_POPUP = "showComponentPopup";

export const SHOW_NOTIFY = "showNotify";

export const RESIZE_WINDOW = "resize.window";

export const RESIZE_CANVAS = "resizeCanvas";

/**
 * canvas를 다시 그릴 때
 *
 */
export const UPDATE_CANVAS = "updateCanvas";

export const OPEN_CONTEXT_MENU = "openContextMenu";

/**
 * cursor
 */
export const START_GUESTURE = "startGuesture";
export const END_GUESTURE = "endGuesture";

/**
 * keyboard event
 */
export const KEYMAP_KEYDOWN = "keymapKeydown";
export const KEYMAP_KEYUP = "keymapKeyup";

export const SET_LOCALE = "setLocale";

export const PUSH_MODE_VIEW = "pushModeView";
export const POP_MODE_VIEW = "popModeView";
