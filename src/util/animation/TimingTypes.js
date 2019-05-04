import { cubicBezier } from "../functions/math";

export const TIMING_FUNCTIONS = [
    'linear',
    'ease',
    'ease-in',
    'ease-in-sine',
    'ease-in-quad',
    'ease-in-cubic',
    'ease-in-quart',
    'ease-in-quint',
    'ease-in-expo',
    'ease-in-circ',
    'ease-in-back',
    'ease-in-out',
    'ease-in-out-sine',
    'ease-in-out-quad',
    'ease-in-out-cubic',
    'ease-in-out-quart',
    'ease-in-out-quint',
    'ease-in-out-expo',
    'ease-in-out-circ',
    'ease-in-out-back',  
    'ease-out',
    'ease-out-sine',
    'ease-out-quad',
    'ease-out-cubic',
    'ease-out-quart',
    'ease-out-quint',
    'ease-out-expo',
    'ease-out-circ',
    'ease-out-back'
]

var stepTimingFunction = (step = 1, position = 'end') => {
    return function (progress) {
        var stepDist = 1 / step; 

        if (position == 'start') {
            return stepDist * Math.ceil(progress / stepDist);
        } else if (position == 'end') {
            return stepDist * Math.floor(progress / stepDist);
        }
    }
}

let Timing = {
    'ease-out-elastic' (progress, duration, start, end) {
        return Math.pow(2, -10 * progress) * Math.sin((progress - .1) * 5 * Math.PI) + 1;
    },
    'cubic-bezier' (x1, y1, x2, y2) {
        return cubicBezier(x1, y1, x2, y2)
    },
    'step' (step = 1, position = 'end') {
        return stepTimingFunction(step, position);
    },
    'step-start' (progress) {
        return stepTimingFunction(1, 'start')(progress)
    },
    'step-end' (progress) {
        return stepTimingFunction(1, 'end')(progress)
    }
}

// setup bezier functions
bezierList.forEach(arr => {
    Timing[arr[4]] = cubicBezier(arr[0], arr[1], arr[2], arr[3])
})

export default Timing;