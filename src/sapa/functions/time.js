import { isString, isNumber, isNotUndefined, isFunction } from "./func";


export function second (fps, timecode) {

    if (isString(timecode)) {
        var [hour, minute, second, frame] = timecode.split(':');

        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);
        second = parseInt(second, 10);
        frame = parseInt(frame, 10);

        return hour * 3600 
             + minute * 60 
             + second 
             + frame * (1/fps);
    } else if ( isNumber(timecode)) {
        return timecode / fps;
    }

    return 0 
}

export function frames (fps, time) {
    return time * fps; 
}

export function timecode(fps, seconds) {
    var h = Math.floor(seconds / 3600)
    var m = Math.floor(seconds/60 % 60);
    var s = Math.floor(seconds % 60);
    var f = Math.round( (seconds - Math.floor(seconds)) * fps );

    if (f === fps) {
        f = 0;
        s += 1; 
        if (s === 60) {
            m += 1; 

            if (m === 60) {
                h += 1; 
            }
        }
    }

    return [h, m, s, f].map(t => {
        return (t + '').padStart(2, '0')
    }).join(':')
}

export function timecodeToFrames(fps, timecode, start = null) {
    return frames(fps, second(fps, timecode) - second(fps, start))
}

export function framesToTimecode(fps, frames, start = null) {
    return timecode(fps, second(fps, frames) - second(fps, start));
}

/**
 * make a timer for timeline animation 
 * 
 * @param {*} opt 
 */
export function makeTimer (opt) {

    var timer = {
        id: 0,
        start: 0, 
        speed: opt.speed || 1, 
        elapsed: opt.elapsed || 0,
        duration: opt.duration || 0,
        iterationStartCount: 1,
        iterationCount: opt.iterationCount || Number.MAX_SAFE_INTEGER,
        direction: opt.direction || 'normal',
        log: [],
        logIndex: 0,
        tick: opt.tick || (() => {}),
        startCallback: opt.start || (() => {}),
        endCallback: opt.end || (() => {}),
        firstCallback: opt.first || (() => {}) ,
        lastCallback: opt.last || (() => {})
    }

    const isForward = () => {
        if (timer.direction === 'normal') {
            return true
        } else if (timer.direction === 'reverse') {
            return false
        } else if (timer.direction === 'alternate') {
            return timer.iterationStartCount % 2 === 1
        } else if (timer.direction === 'alternate-reverse') {
            return timer.iterationStartCount % 2 === 0
        }
    }


    const calculateForDirection = (rate) => {
        return isForward() ? rate : 1 - rate; 
    }

    const tick = (now) => {

        var isStart = false; 
        if (timer.start === null) {
            timer.start = now; 
            // timer.elapsed = 0; 
            isStart = true; 
        }

        const dt = now - timer.start;

        timer.elapsed += dt * timer.speed;

        timer.start = now; 

        if (timer.elapsed > timer.duration) {
            timer.elapsed = timer.duration;
        }

        // console.log(timer.elapsed, dt, timer.speed)
        
        var elapsed = calculateForDirection(timer.elapsed/timer.duration) * timer.duration;
        if (isStart) timer.startCallback(elapsed, timer);
        timer.log[timer.logIndex++] = {elapsed, dt: timer.lastTime - elapsed};
        timer.lastTime = elapsed;
        timer.tick (elapsed, timer);

        if (timer.elapsed === timer.duration) {
            end();
        } else {
            frameStart();
        }
    }

    const frameStart = () => {
        timer.id = requestAnimationFrame(tick);
    }

    const end = () => {
        timer.endCallback(timer.elapsed, timer);
        timer.iterationStartCount++;

        if (timer.iterationStartCount > timer.iterationCount) {
            timer.lastCallback(timer.elapsed, timer);
            cancelAnimationFrame(timer.id);
        } else {
           // 멈추지 않은 상태면 
           timer.start = null;
           timer.elapsed = 0; 
           frameStart();
        }
    }

    const play = (opt = {}) => {
        timer.start = null;    
        timer.iterationStartCount = 1;
        timer.log = [] 
        timer.lastTime = 0; 
        timer.logIndex = 0;

        if (isNumber(opt.elapsed)) timer.elapsed = opt.elapsed;
        if (isNumber(opt.speed)) timer.speed = opt.speed;
        if (isNumber(opt.duration)) timer.duration = opt.duration;
        if (isNumber(opt.iterationCount)) timer.iterationCount = opt.iterationCount  || Number.MAX_SAFE_INTEGER;
        if (isString(opt.direction)) timer.direction = opt.direction
        if (isFunction(opt.tick)) timer.tick = opt.tick;
        if (isFunction(opt.start)) timer.startCallback = opt.start;
        if (isFunction(opt.end)) timer.endCallback = opt.end;
        if (isFunction(opt.first)) timer.firstCallback = opt.first;
        if (isFunction(opt.last)) timer.lastCallback = opt.last;
        if (isFunction(opt.stop)) timer.stopCallback = opt.stop;

        timer.firstCallback(timer.elapsed, timer);
        frameStart();
    }


    const stop = () => {
        timer.stopCallback(timer.elapsed, timer);
        cancelAnimationFrame(timer.id);
    }

    const seek = (t) => {
        timer.elapsed = t
        timer.tick (timer.elapsed, timer);
    }

    const first = (t) => {
        seek(0);
    }    

    const last = (t) => {
        seek(timer.duration)
    }

    return {
        play, 
        stop,
        tick,
        first,
        last,
        seek,
        timer
    }
}


// var timer = makeTimer({
//     duration: 1000,
//     iterationCount: 3,
//     direction: 'alternate',
//     first: (elapsed, timer) => {
//         console.log('first', elapsed, timer);
//     },
//     last: (elapsed, timer) => {
//         console.log('last', elapsed, timer);
//     },
//     start: (elapsed, timer) => {
//         console.log('start', elapsed, timer);
//     },
//     end : (elapsed, timer) => {
//         console.log('end', elapsed, timer);
//     },
//     tick: (elapsed, timer) => {
        
//         console.log('tick', timecode(60, elapsed / 1000), elapsed, timer.iterationStartCount)
//     }
// })

// timer.start();


// setTimeout( () => {
//     timer.start();
// }, 1000)

/* 

makeTimer({
    duration:  ,
    tick: (elapsed, timer) => {

    }
})

timer.start({ elapsed: 10, speed : 0.5, duration : 10 * 1000 })

*/