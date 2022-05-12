export const ConstraintsDirection = {
  HORIZONTAL: "constraints-horizontal",
  VERTICAL: "constraints-vertical",
};

export const Constraints = {
  NONE: "none",
  MIN: "min",
  MAX: "max",
  STRETCH: "stretch",
  SCALE: "scale",
  CENTER: "center",
};

export const BooleanOperation = {
  DIFFERENCE: "difference",
  INTERSECTION: "intersection",
  UNION: "union",
  REVERSE_DIFFERENCE: "reverse-difference",
  XOR: "xor",
};

export const StrokeLineCap = {
  BUTT: "butt",
  ROUND: "round",
  SQUARE: "square",
};

export const StrokeLineJoin = {
  MITER: "miter",
  ROUND: "round",
  BEVEL: "bevel",
};

export const BlendMode = {
  NORMAL: "normal",
  MULTIPLY: "multiply",
  SCREEN: "screen",
  OVERLAY: "overlay",
  DARKEN: "darken",
  LIGHTEN: "lighten",
  COLOR_DODGE: "color-dodge",
  COLOR_BURN: "color-burn",
  HARD_LIGHT: "hard-light",
  SOFT_LIGHT: "soft-light",
  DIFFERENCE: "difference",
  EXCLUSION: "exclusion",
  HUE: "hue",
  SATURATION: "saturation",
  COLOR: "color",
  LUMINOSITY: "luminosity",
};

export const TextDecoration = {
  NONE: "none",
  UNDERLINE: "underline",
  OVERLINE: "overline",
  LINE_THROUGH: "line-through",
  BLINK: "blink",
};

export const TextTransform = {
  NONE: "none",
  CAPITALIZE: "capitalize",
  UPPERCASE: "uppercase",
  LOWERCASE: "lowercase",
};

export const TextAlign = {
  START: "start",
  END: "end",
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
  JUSTIFY: "justify",
};

export const Overflow = {
  VISIBLE: "visible",
  HIDDEN: "hidden",
  SCROLL: "scroll",
  AUTO: "auto",
};

export const BorderStyle = {
  NONE: "none",
  HIDDEN: "hidden",
  DOTTED: "dotted",
  DASHED: "dashed",
  SOLID: "solid",
  DOUBLE: "double",
  GROOVE: "groove",
  RIDGE: "ridge",
  INSET: "inset",
  OUTSET: "outset",
};

export const TransformValue = {
  NONE: "none",
  PERSPECTIVE: "perspective",
  TRANSLATE: "translate",
  TRANSLATE_X: "translateX",
  TRANSLATE_Y: "translateY",
  TRANSLATE_Z: "translateZ",
  TRANSLATE_3D: "translate3d",
  SCALE: "scale",
  SCALE_X: "scaleX",
  SCALE_Y: "scaleY",
  SCALE_Z: "scaleZ",
  SCALE_3D: "scale3d",
  ROTATE: "rotate",
  ROTATE_X: "rotateX",
  ROTATE_Y: "rotateY",
  ROTATE_Z: "rotateZ",
  SKEW: "skew",
  SKEW_X: "skewX",
  SKEW_Y: "skewY",
  MATRIX: "matrix",
  MATRIX_3D: "matrix3d",
};

export const Layout = {
  DEFAULT: "default",
  FLEX: "flex",
  GRID: "grid",
};

export const FlexDirection = {
  ROW: "row",
  ROW_REVERSE: "row-reverse",
  COLUMN: "column",
  COLUMN_REVERSE: "column-reverse",
};

export const JustifyContent = {
  FLEX_START: "flex-start",
  FLEX_END: "flex-end",
  CENTER: "center",
  SPACE_BETWEEN: "space-between",
  SPACE_AROUND: "space-around",
  SPACE_EVENLY: "space-evenly",
};

export const AlignItems = {
  FLEX_START: "flex-start",
  FLEX_END: "flex-end",
  CENTER: "center",
  BASELINE: "baseline",
  STRETCH: "stretch",
};

export const AlignContent = {
  FLEX_START: "flex-start",
  FLEX_END: "flex-end",
  CENTER: "center",
  SPACE_BETWEEN: "space-between",
  SPACE_AROUND: "space-around",
  SPACE_EVENLY: "space-evenly",
};

export const FlexWrap = {
  NOWRAP: "nowrap",
  WRAP: "wrap",
  WRAP_REVERSE: "wrap-reverse",
};

// Flex Layout 을 적용 할 때 container 또는 하위 layer 에 적용할 수 있는 크기 속성
export const ResizingMode = {
  FIXED: "fixed", // 주어진 width, height 로 고정한다.
  HUG_CONTENT: "hug-content", // width, height 설정을 fit-content 로 맞춘다. 또는 적용하지 않는다. (default)
  FILL_CONTAINER: "fill-container", // flex-grow: 1 설정으로 고정
};

export const TextClip = {
  NONE: "none",
  TEXT: "text",
};

export const BoxShadowStyle = {
  OUTSET: "outset",
  INSET: "inset",
};

export const GradientType = {
  STATIC: "static-gradient",
  LINEAR: "linear-gradient",
  RADIAL: "radial-gradient",
  CONIC: "conic-gradient",
  REPEATING_LINEAR: "repeating-linear-gradient",
  REPEATING_RADIAL: "repeating-radial-gradient",
  REPEATING_CONIC: "repeating-conic-gradient",
  IMAGE: "image",
  URL: "url",
};

export const RadialGradientSizeType = {
  CLOSEST_SIDE: "closest-side",
  CLOSEST_CORNER: "closest-corner",
  FARTHEST_SIDE: "farthest-side",
  FARTHEST_CORNER: "farthest-corner",
};

export const RadialGradientType = {
  CIRCLE: "circle",
  ELLIPSE: "ellipse",
};

export const ClipPathType = {
  NONE: "none",
  CIRCLE: "circle",
  ELLIPSE: "ellipse",
  POLYGON: "polygon",
  INSET: "inset",
  PATH: "path",
  SVG: "svg",
};

export const VisibilityType = {
  VISIBLE: "visible",
  HIDDEN: "hidden",
};

export const TimingFunction = {
  LINEAR: "linear",
  EASE: "ease",
  EASE_IN: "ease-in",
  EASE_OUT: "ease-out",
  EASE_IN_OUT: "ease-in-out",
  STEPS: "steps",
  CUBIC_BEZIER: "cubic-bezier",
  PATH: "path",
};

export const SpreadMethodType = {
  PAD: "pad",
  REFLECT: "reflect",
  REPEAT: "repeat",
};

export const FuncType = {
  COMMA: "comma",
  COLOR: "color",
  LENGTH: "length",
  GRADIENT: "gradient",
  TIMING: "timing",
  KEYWORD: "keyword",
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  FUNCTION: "function",
  PATH: "path",
  URL: "url",
  REPEAT: "repeat",
  UNKNOWN: "unknown",
};

export const PathSegmentType = {
  MOVETO: "M",
  LINETO: "L",
  CURVETO: "C",
  QUARDTO: "Q",
  ARCTO: "A",
  CLOSEPATH: "Z",
  UNKNOWN: "unknown",
};

export const DirectionType = {
  TO_TOP: "to top",
  TO_RIGHT: "to right",
  TO_BOTTOM: "to bottom",
  TO_LEFT: "to left",
  TO_TOP_LEFT: "to top left",
  TO_TOP_RIGHT: "to top right",
  TO_BOTTOM_LEFT: "to bottom left",
  TO_BOTTOM_RIGHT: "to bottom right",
};

export const DirectionNumberType = {
  1: DirectionType.TO_TOP_LEFT,
  2: DirectionType.TO_TOP_RIGHT,
  3: DirectionType.TO_BOTTOM_LEFT,
  4: DirectionType.TO_BOTTOM_RIGHT,
  11: DirectionType.TO_TOP,
  12: DirectionType.TO_RIGHT,
  13: DirectionType.TO_BOTTOM,
  14: DirectionType.TO_LEFT,
};

export const TargetActionType = {
  APPEND_CHILD: "appendChild",
  INSERT_BEFORE: "insertBefore",
  INSERT_AFTER: "insertAfter",
};
