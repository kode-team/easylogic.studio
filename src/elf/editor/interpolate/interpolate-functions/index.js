import { makeInterpolateLength } from "./makeInterpolateLength";
import { makeInterpolateBorderRadius } from "./makeInterpolateBorderRadius";
import { makeInterpolateBoxShadow } from "./makeInterpolateBoxShadow";
import { makeInterpolateColor } from "./makeInterpolateColor";
import { makeInterpolateString } from "./makeInterpolateString";
import { makeInterpolateRotate } from "./makeInterpolateRotate";
import { makeInterpolateTextShadow } from "./makeInterpolateTextShadow";
import { makeInterpolateBackgroundImage } from "./makeInterpolateBackgroundImage";
import { makeInterpolateFilter } from "./makeInterpolateFilter";
import { makeInterpolateNumber } from "./makeInterpolateNumber";
import { makeInterpolateClipPath } from "./makeInterpolateClipPath";
import { makeInterpolateTransform } from "./makeInterpolateTransform";
import { makeInterpolateTransformOrigin } from "./makeInterpolateTransformOrigin";
import { makeInterpolatePerspectiveOrigin } from "./makeInterpolatePerspectiveOrigin";
import { makeInterpolateStrokeDashArrray } from "./makeInterpolateStrokeDashArray";
import { makeInterpolatePath } from "./svg/makeInterpolatePath";
import { makeInterpolatePolygon } from "./svg/makeInterpolatePolygon";
import { makeInterpolateOffsetPath } from "./makeInterpolateOffsetPath";
import { makeInterpolateText } from "./makeInterpolateText";
import { makeInterpolatePlayTime } from "./makeInterpolatePlayTime";

const DEFAULT_FUCTION = () => () => {};

function makeInterpolateCustom(property) {
  switch (property) {
    case "border-radius":
      return makeInterpolateBorderRadius;
    // case "border":
    //   return makeInterpolateBorder;
    case "box-shadow":
      return makeInterpolateBoxShadow;
    case "text-shadow":
      return makeInterpolateTextShadow;
    case "background-image":
    case "BackgroundImageEditor":
      return makeInterpolateBackgroundImage;
    case "filter":
    case "backdrop-filter":
      return makeInterpolateFilter;
    case "clip-path":
      return makeInterpolateClipPath;
    case "transform":
      return makeInterpolateTransform;
    case "transform-origin":
      return makeInterpolateTransformOrigin;
    case "perspective-origin":
      return makeInterpolatePerspectiveOrigin;
    case "stroke-dasharray":
      return makeInterpolateStrokeDashArrray;
    case "d":
      return makeInterpolatePath;
    case "points":
      return makeInterpolatePolygon;
    case "offset-path":
      return makeInterpolateOffsetPath;
    case "text":
      return makeInterpolateText;
    case "playTime":
      return makeInterpolatePlayTime;
  }
}

function makeInterpolate(
  layer,
  property,
  startValue,
  endValue,
  editorString,
  artboard,
  layerElement
) {
  var checkField = editorString || property;

  switch (checkField) {
    case "width":
    case "x":
      return makeInterpolateLength(
        layer,
        property,
        startValue,
        endValue,
        "width"
      );
    case "height":
    case "y":
      return makeInterpolateLength(
        layer,
        property,
        startValue,
        endValue,
        "height"
      );
    case "perspective":
    case "font-size":
    case "font-weight":
    case "text-stroke-width":
    case "RangeEditor":
    case "textLength":
    case "startOffset":
      return makeInterpolateLength(
        layer,
        property,
        startValue,
        endValue,
        property
      );
    case "fill-opacity":
    case "opacity":
    case "stroke-dashoffset":
    case "currentTime":
    case "NumberRangeEditor":
      return makeInterpolateNumber(layer, property, +startValue, +endValue);
    case "background-color":
    case "color":
    case "text-fill-color":
    case "text-stroke-color":
    case "fill":
    case "stroke":
    case "ColorViewEditor":
      return makeInterpolateColor(layer, property, startValue, endValue);
    case "mix-blend-mode":
    case "fill-rule":
    case "stroke-linecap":
    case "stroke-linejoin":
    case "SelectEditor":
    case "lengthAdjust":
      return makeInterpolateString(layer, property, startValue, endValue);
    case "rotate":
      return makeInterpolateRotate(layer, property, startValue, endValue);
  }

  var func = makeInterpolateCustom(checkField);

  if (func) {
    return func(layer, property, startValue, endValue, artboard, layerElement);
  }

  return DEFAULT_FUCTION;
}

export function createInterpolateFunction(
  layer,
  property,
  startValue,
  endValue,
  editorString,
  artboard,
  layerElement
) {
  return makeInterpolate(
    layer,
    property,
    startValue,
    endValue,
    editorString,
    artboard,
    layerElement
  );
}
