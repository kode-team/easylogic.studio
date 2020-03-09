import _currentArtboard from "./_currentArtBoard";
import { timecode } from "../../util/functions/time";

export default {
    command: 'prevTimelineItem',
    execute: function (editor) {

        _currentArtboard(editor, (artboard, timeline) => {
            var prevTime = artboard.getSelectedTimelinePrevTime();

            artboard.setTimelineCurrentTime(timecode(timeline.fps, prevTime));
            artboard.seek();

            editor.emit('playTimeline');
            editor.changeMode('SELECTION');
            editor.emit('afterChangeMode')
        })
    }    

}