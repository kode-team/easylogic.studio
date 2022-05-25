export const Language = {
  EN: "en_US",
  FR: "fr_FR",
  KO: "ko_KR",
};

export const EditingMode = {
  SELECT: "select",
  APPEND: "append",
  DRAW: "draw",
  PATH: "path",
  HAND: "hand",
};

export const DesignMode = {
  EDIT: "edit",
  PREVIEW: "preview",
  DESIGN: "design",
  ITEM: "item",
};

export const CanvasViewToolLevel = {
  DRAG_AREA: 0x000,
  RENDERING_AREA: 0x100,
  SELECTION_TOOL: 0x200,
  LAYOUT_TOOL: 0x300,
};

export const NotifyType = {
  ERROR: "error",
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ALERT: "alert",
};

export const IntersectEpsilonNumberType = {
  RECT: 30,
};

export const ClipboardType = {
  TEXT: "text",
  IMAGE: "image",
  SVG: "svg",
  HTML: "html",
  JSON: "json",
};

export const ClipboardActionType = {
  COPY: "copy",
  CUT: "cut",
};

export const MenuItemType = {
  BUTTON: "button",
  LINK: "link",
  SEPARATOR: "separator",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  SUBMENU: "submenu",
  DROPDOWN: "dropdown",
  CUSTOM: "custom",
};

export const ViewModeType = {
  CanvasView: "CanvasView",
  PathEditorView: "PathEditorView",
};
