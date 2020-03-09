import _currentArtboard from "./_currentArtBoard";
import { timecode } from "../../util/functions/time";

export default {
    command: 'nextTimelineItem',
    execute: function (editor) {

        _currentArtboard(editor, (artboard, timeline) => {
            var nextTime = artboard.getSelectedTimelineNextTime();

            artboard.setTimelineCurrentTime(timecode(timeline.fps, nextTime));
            artboard.seek();
            editor.emit('playTimeline');
            editor.changeMode('SELECTION');
            editor.emit('afterChangeMode')
        })
    }
}