export function makeInterpolateNumber(
  layer,
  property,
  startNumber,
  endNumber,
  unit = undefined
) {
  return (rate, t) => {
    var result = 0;
    if (t === 0) {
      result = startNumber;
    } else if (t === 1) {
      result = endNumber;
    } else {
      result = startNumber + (endNumber - startNumber) * rate;
    }

    if (unit) {
      return result + unit;
    }

    return result;
  };
}
