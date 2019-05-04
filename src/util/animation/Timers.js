import { rgb } from "../functions/formatter";
import Timing from './Timing'
import KeyFrames from './KeyFrames';

export const DIRECTION_NORMAL = 'normal';
export const DIRECTION_REVERSE = 'reverse';
export const DIRECTION_ALTERNATE = 'alternate';
export const DIRECTION_ALTERNATE_REVERSE = 'alternate-reverse';


const Timers = {
    parse (opt) {
        var ani = {
            name: 'sample' + Date.now(),
            iteration: 1,
            duration: 1000,
            delay: 0,
            timing: Timing.linear,
            direction: DIRECTION_NORMAL, // reverse, alternate, alternate-reverse
            keyframes: {},
            ...opt
        };

        if (ani.iteration == 'infinite') {
            ani.iteration = Number.MAX_SAFE_INTEGER;
        } else {
            ani.iteration = Math.floor(ani.iteration);
        }

        ani.timing = Timing[ani.timing] || ani.timing;

        ani.realKeyframes = KeyFrames.parse(ani.keyframes, ani);

        ani.update = this.setupFunction(ani);

        return ani;
    }, 

    getDirection (ani, progress, runningTime) {
        if (ani.direction == DIRECTION_REVERSE) {
            // TODO: duration 안에서 reverse
            return 1 - progress;
        } else if (ani.direction == DIRECTION_ALTERNATE) {
            var targetIterator = Math.ceil(runningTime / ani.duration);
            var targetIterator2 = Math.floor(runningTime / ani.duration);

            if (targetIterator % 2 == 0) {
                return 1 - progress;
            }            

        } else if (ani.direction == DIRECTION_ALTERNATE_REVERSE) {

        }

        return progress; 
    },

    setupFunction (ani) {
        return (elapsed/* 전체 animation 실행 시간 */) => {

            var runningTime = (elapsed - ani.delay)        
            if (runningTime < 0) {
                return false;
            }

            /* duration 안의 진행지점  */
            var progress = runningTime / ani.duration;

            if (ani.iteration > 1 && runningTime < ani.iteration * ani.duration) {
                // 기간이 지나지 않았으면 duration 기간만큼 나눠서 다시 구한다. 
                var newRunningTime = runningTime - ani.duration * Math.floor(runningTime / ani.duration)
                progress = newRunningTime / ani.duration;
            }

            if (progress > 1 && ani.finished) {
                return false; 
            }

            if (progress > 1 && !ani.finished) {
                ani.finished = true;
                console.log('finished')
                // return true;     
                
                if (ani.direction == DIRECTION_NORMAL || ani.direction == DIRECTION_REVERSE ) {
                    progress = 1; 
                } else if (ani.direction == DIRECTION_ALTERNATE || ani.direction == DIRECTION_ALTERNATE_REVERSE) {
                    if (Math.floor(progress / ani.duration) % 2 == 0) {
                        progress = 0; 
                    } else {
                        progress = 1; 
                    }
                }
            }            

            progress = this.getDirection(ani, progress, runningTime);

            ani.realKeyframes.forEach(item => {
                item.functions.forEach(f => f(ani, progress))

                if (ani.finished == true) {
                    item.finished = true; 

                    this.setLastValue(ani, item);
                }
            })
  

            return true;
        }
    },

    setLastValue (ani, item) {

        if (ani.direction == DIRECTION_ALTERNATE) {
            return;  
        }

        var lastValue = item.values[item.values.length-1];
        if (ani.direction == DIRECTION_REVERSE) {
            lastValue = item.values[0]; 
        }
        console.log(lastValue);
        if (item.itemType == 'color') {
            ani.obj[item.key] = rgb(lastValue);
        } else {
            ani.obj[item.key] = lastValue.value + lastValue.type;
        }
    },
    makeTimer (list, opt = {}) {

        list = list.map(item => this.parse(item));

        var timer = {
            id: 0,
            start: 0, 
            pause: false
        }
    
        const frameStart = () => {
            timer.id = requestAnimationFrame(tick);
        }

        const move = (elapsed) => {
            timer.elapsed = elapsed;
            list.forEach(ani => ani.update(timer.elapsed))
            opt.callback && opt.callback();
        }        
    
        const tick = (now) => {

            timer.elapsed = now - timer.start;
            var unfinished = list.filter(ani => !ani.finished);

            // 끝나지 않음 
            if (!unfinished.length) {
                opt.callback && opt.callback();      
                opt.done && opt.done();
                end();
                return false; 
            }   

            // delay 가 걸려 있으면 시간만 실행되고 실제 값을 업데이트 하지 않음. 
            list.forEach(ani => ani.update(timer.elapsed))
            opt.callback && opt.callback();      

            if (!timer.pause) {
                frameStart();
            }
        }
    
        const start = () => {
            timer.start = performance.now();
            frameStart();
        }
    
        const end = () => {
            cancelAnimationFrame(timer.id);
        }
    
        const pause = () => {
            timer.pause = true; 
            cancelAnimationFrame(timer.id);
        }
    
        const restart = () => {
            timer.pause = false; 
            frameStart();
        }

    
        return {
            start, 
            end, 
            pause,
            restart,
            tick,
            move,
            timer,
            list
        }
    }
}

export default Timers;