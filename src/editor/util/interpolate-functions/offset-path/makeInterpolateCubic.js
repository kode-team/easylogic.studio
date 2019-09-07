import { getBezierPointOne } from "../../../../util/functions/bezier"

export default function makeInterpolateCubic (sx, sy, cx1, cy1, cx2, cy2, ex, ey) {

    var points = [
        {x: sx, y: sy},
        {x: cx1, y: cy1},
        {x: cx2, y: cy2},
        {x: ex, y: ey}
    ]

    return (rate, t) => {
        return getBezierPointOne(points, t)  // return {x, y}
    }
}