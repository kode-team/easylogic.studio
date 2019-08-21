
const stepTimingFunction = (step = 1, direction = 'end') => {
    step = +step; 
    return function (rate) {
        var stepDist = 1 / step; 

        if (direction == 'start') {
            return stepDist * Math.ceil(rate / stepDist);
        } else if (direction == 'end') {
            return stepDist * Math.floor(rate / stepDist);
        }
    }
}

export function step (step = 1, direction = 'end') {
    return stepTimingFunction(step, direction);
}

export function stepStart () {  
    return stepTimingFunction(1, 'start');
}

export function stepEnd () {
    return stepTimingFunction(1, 'end');
}
