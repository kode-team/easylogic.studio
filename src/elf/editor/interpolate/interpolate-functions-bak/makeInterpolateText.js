export function makeInterpolateText(layer, property, startText, endText) {
  var max = endText.length - 1;
  var min = 0;

  return (rate, t) => {
    var result = 0;
    if (t === 0) {
      result = "";
    } else if (t === 1) {
      result = endText;
    } else {
      result = endText.substring(min, Math.floor((max - min) * t));
    }

    return result;
  };
}
