import _currentArtboard from "./_currentArtBoard";
import { timecode } from "../../util/functions/time";

export default {
    command: 'lastTimelineItem',
    execute: function (editor) {

        _currentArtboard(editor, (artboard, timeline) => {
            var lastTime = artboard.getSelectedTimelineLastTime();

            artboard.setTimelineCurrentTime(timecode(timeline.fps, lastTime));
            artboard.seek();
            editor.emit('playTimeline');
            editor.changeMode('SELECTION');
            editor.emit('afterChangeMode')
        })
    }

}