import { Length } from "../../unit/Length";

export function makeInterpolateRotate(layer, property, startNumber, endNumber) {
    var startValue = Length.parse(startNumber);
    var endValue = Length.parse(endNumber);

    return (rate, t) => {
        var realStartValue = startValue.value;
        var realEndValue = endValue.value;

        if (t === 0) {
            return realStartValue;
        } else if (t === 1) {
            return realEndValue;
        }

        return Length.deg(realStartValue + (realEndValue - realStartValue) * rate).to(startValue.unit);
    }
}
