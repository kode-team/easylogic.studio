import { cubicBezier } from "../functions/math";

const bezierList = [
    [ 0, 0, 1, 1, 'linear'],
    [ 0.25, 0.1, 0.25, 1, 'ease'],

    [ 0.42, 0, 1, 1, 'ease-in'],
    [  0.47, 0, 0.745, 0.715,  'ease-in-sine'],
    [  0.55, 0.085, 0.68, 0.53,  'ease-in-quad'],
    [ 0.55, 0.055, 0.675, 0.19, 'ease-in-cubic'],
    [ 0.895, 0.03, 0.685, 0.22, 'ease-in-quart'],
    [ 0.755, 0.05, 0.855, 0.06, 'ease-in-quint'],
    [ 0.95, 0.05, 0.795, 0.035, 'ease-in-expo'],
    [ 0.60, 0.04, 0.98, 0.335, 'ease-in-circ'],
    [ 0.60, -0.28, 0.735, 0.045, 'ease-in-back'],

    [ 0.42, 0, 0.58, 1, 'ease-in-out'],
    [  0.445, 0.05, 0.55, 0.95,  'ease-in-out-sine'],
    [  0.455, 0.03, 0.515, 0.955,  'ease-in-out-quad'],
    [ 0.645, 0.045, 0.355, 1, 'ease-in-out-cubic'],
    [ 0.77, 0, 0.175, 1, 'ease-in-out-quart'],
    [ 0.86, 0, 0.07, 1, 'ease-in-out-quint'],
    [ 1, 0, 0, 1, 'ease-in-out-expo'],
    [ 0.785, 0.135, 0.15, 0.86, 'ease-in-out-circ'],
    [ 0.68, -0.55, 0.265, 1.55, 'ease-in-out-back'],
    
    [ 0, 0, 0.58, 1, 'ease-out'],
    [  0.39, 0.575, 0.565, 1,  'ease-out-sine'],
    [  0.25, 0.46, 0.45, 0.94,  'ease-out-quad'],
    [ 0.215, 0.61, 0.355, 1, 'ease-out-cubic'],
    [ 0.165, 0.84, 0.44, 1, 'ease-out-quart'],
    [ 0.23, 1, 0.32, 1, 'ease-out-quint'],
    [ 0.19, 1, 0.22, 1, 'ease-out-expo'],
    [ 0.075, 0.82, 0.165, 1, 'ease-out-circ'],
    [ 0.175, 0.885, 0.32, 1.275, 'ease-out-back']
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