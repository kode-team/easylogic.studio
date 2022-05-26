// import { BoxShadow } from "../../property-parser/BoxShadow";
// import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
// import { makeInterpolateColor } from "./makeInterpolateColor";
// import { makeInterpolateLength } from "./makeInterpolateLength";

export function makeInterpolateBoxShadow() {
  // layer,
  // property,
  // startValue,
  // endValue
  // var s = BoxShadow.parseStyle(startValue);
  // var e = BoxShadow.parseStyle(endValue);
  // var totalLength = Math.max(s.length, e.length);
  // var list = [];
  // for (var i = 0, len = totalLength; i < len; i++) {
  //   var startObject =
  //     s[i] || BoxShadow.parseStyle("0px 0px 0px 0px rgba(0, 0, 0, 0)")[0];
  //   var endObject =
  //     e[i] || BoxShadow.parseStyle("0px 0px 0px 0px rgba(0, 0, 0, 0)")[0];
  //   list.push({
  //     inset: makeInterpolateBoolean(
  //       layer,
  //       property,
  //       startObject.inset,
  //       endObject.inset
  //     ),
  //     offsetX: makeInterpolateLength(
  //       layer,
  //       property,
  //       startObject.offsetX,
  //       endObject.offsetX
  //     ),
  //     offsetY: makeInterpolateLength(
  //       layer,
  //       property,
  //       startObject.offsetY,
  //       endObject.offsetY
  //     ),
  //     blurRadius: makeInterpolateLength(
  //       layer,
  //       property,
  //       startObject.blurRadius,
  //       endObject.blurRadius
  //     ),
  //     spreadRadius: makeInterpolateLength(
  //       layer,
  //       property,
  //       startObject.spreadRadius,
  //       endObject.spreadRadius
  //     ),
  //     color: makeInterpolateColor(
  //       layer,
  //       property,
  //       startObject.color,
  //       endObject.color
  //     ),
  //   });
  // }
  // return (rate, t) => {
  //   return BoxShadow.join(
  //     list.map((it) => {
  //       return {
  //         inset: it.inset(rate, t),
  //         offsetX: it.offsetX(rate, t),
  //         offsetY: it.offsetY(rate, t),
  //         blurRadius: it.blurRadius(rate, t),
  //         spreadRadius: it.spreadRadius(rate, t),
  //         color: it.color(rate, t),
  //       };
  //     })
  //   );
  // };
}
