import _currentArtboard from "./_currentArtBoard";
import { makeTimer, timecode } from "../../util/functions/time";

export default {
    command: 'playTimelineItem',
    execute: function (editor, speed = 1, iterationCount = 1, direction = 'normal') {

        editor.selection.empty()
        editor.emit('refreshSelection');
        editor.changeMode('play');
        editor.emit('afterChangeMode')

        _currentArtboard(editor, (artboard, timeline) => {
          
            var lastTime = artboard.getSelectedTimelineLastTime();

            if (editor.timer) {
                editor.timer.stop()
            } else {
                editor.timer = makeTimer({
                    elapsed: timeline.currentTime * 1000,
                    speed,
                    duration: lastTime * 1000,
                    iterationCount, 
                    direction
                })
            }

            editor.timer.play({
                duration: lastTime * 1000,
                elapsed: timeline.currentTime * 1000,
                speed,
                iterationCount,
                direction,
                tick: (elapsed, timer) => {
                    // console.log(timecode(timeline.fps, elapsed / 1000), elapsed, elapsed/1000);
                    artboard.seek(timecode(timeline.fps, elapsed / 1000))
                    editor.emit('playTimeline');
                },
                last: (elapsed, timer) => {                 
                    editor.emit('stopTimeline');
                    // artboard.setTimelineCurrentTime(0);
                    editor.changeMode('SELECTION');
                    editor.emit('afterChangeMode')
                }
            })      
        })
        
    }
}