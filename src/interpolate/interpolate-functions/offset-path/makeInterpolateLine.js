import { makeInterpolateNumber } from "../makeInterpolateNumber"

export default function makeInterpolateLine (x1, y1, x2, y2) {

    var obj = {
        x: makeInterpolateNumber('', '', x1, x2),
        y: makeInterpolateNumber('', '', y1, y2),
    }

    return (rate, t) => {
        var results = {
            x: obj.x(rate, t),
            y: obj.y(rate, t)
        }

        // console.log({x: results.x , t, x1, x2 })

        return results
    }
}