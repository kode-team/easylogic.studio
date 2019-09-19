import Border from "../../css-property/Border";

const border_type = ['border', 'border-top', 'border-right', 'border-left', 'border-bottom']

export function makeInterpolateBorder(layer, property, startValue, endValue) {
    var s = Border.parseStyle(startValue);
    var e = Border.parseStyle(endValue);

    var results = {}

    border_type.forEach(type => {
        if (s[type] && e[type]) {
            results[type] = makeInterpolateBorderValue(layer, property, s[type], e[type]);
        } else if (s[type] && !e[type]) {
            var obj = Border.parseValue(s[type])
            results[type] = makeInterpolateBorderValue(layer, property, s[type], `0px ${obj.style} rgba(0, 0, 0, 0)`);
        } else if (!s[type] && e[type]) {
            var obj = Border.parseValue(e[type])
            results[type] = makeInterpolateBorderValue(layer, property, `0px ${obj.style} rgba(0, 0, 0, 0)`, e[type]);
        }
    })

    return (rate, t) => {

        var obj = {}
        Object.keys(results).forEach(type => {
            obj[type] = results[type](rate, t);
        })

        return Border.join(obj);
    }
}


