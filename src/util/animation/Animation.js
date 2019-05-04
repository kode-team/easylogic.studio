import Timing from './Timing'
import KeyFrames from './KeyFrames';
import Timers from './Timers';


function createTimeline (animations = [], opt) {
    return Timers.makeTimer(animations, opt);
}

export default {
    KeyFrames,
    Timers,
    createTimeline,
    Timing
}