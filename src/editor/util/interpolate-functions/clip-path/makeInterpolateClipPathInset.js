import { makeInterpolateNumber } from "../makeInterpolateNumber";
import { makeInterpolateBoolean } from "../makeInterpolateBoolean";

export function makeInterpolateClipPathInset (layer, property, s, e) {

    var obj = {
        top: makeInterpolateNumber(layer, property, s.top.value, e.top.value, s.top.unit),
        left: makeInterpolateNumber(layer, property, s.left.value, e.left.value, s.left.unit),
        right: makeInterpolateNumber(layer, property, s.right.value, e.right.value, s.right.unit),
        bottom: makeInterpolateNumber(layer, property, s.bottom.value, e.bottom.value, s.bottom.unit),
        round: makeInterpolateBoolean(layer, property, s.round, e.round),
        topRadius: makeInterpolateNumber(layer, property, s.topRadius.value, e.topRadius.value, s.topRadius.unit),
        leftRadius: makeInterpolateNumber(layer, property, s.leftRadius.value, e.leftRadius.value, s.leftRadius.unit),
        rightRadius: makeInterpolateNumber(layer, property, s.rightRadius.value, e.rightRadius.value, s.rightRadius.unit),
        bottomRadius: makeInterpolateNumber(layer, property, s.bottomRadius.value, e.bottomRadius.value, s.bottomRadius.unit)
    }

    return (rate, t) => {

        var top = obj.top(rate, t);
        var right = obj.right(rate, t);
        var bottom = obj.bottom(rate, t);
        var left = obj.left(rate, t);

        var round = obj.round(rate, t);

        var topRadius = obj.topRadius(rate, t);
        var leftRadius = obj.leftRadius(rate, t);
        var bottomRadius = obj.bottomRadius(rate, t);
        var rightRadius = obj.rightRadius(rate, t);

        var position = [top, right, bottom, left].join(' ')
        var radius = [topRadius, rightRadius, bottomRadius, leftRadius].join(' ')
        var results = `${position} ${(round && radius.trim()) ? `round ${radius}` : ''}`

        return results;
    } 
}
