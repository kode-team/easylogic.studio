import { getBezierPointOneQuard } from "../../../../util/functions/bezier"

export default function makeInterpolateQuard (sx, sy, cx1, cy1, ex, ey) {

    var points = [
        {x: sx, y: sy},
        {x: cx1, y: cy1},
        {x: ex, y: ey}
    ]

    return (rate, t) => {
        return getBezierPointOneQuard(points, t)  // return {x, y}
    }
}