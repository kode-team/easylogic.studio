import { isString, isNumber } from "./func";


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

function frames (fps, time) {
    return time * fps; 
}

export function timecode(fps, seconds) {
    var h = Math.floor(seconds / 3600)
    var m = Math.floor(seconds/60 % 60);
    var s = Math.floor(seconds % 60);
    var f = Math.round( (seconds - Math.floor(seconds)) * fps );

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