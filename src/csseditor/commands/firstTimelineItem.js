import _currentArtboard from "./_currentArtBoard";
import { timecode } from "../../util/functions/time";

export default {
    command: 'firstTimelineItem',
    execute: function (editor) {

        _currentArtboard(editor, (artboard, timeline) => {
            var firstTime = artboard.getSelectedTimelineFirstTime();

            artboard.setTimelineCurrentTime(timecode(timeline.fps, firstTime));
            artboard.seek();
            editor.emit('playTimeline');
            editor.changeMode('SELECTION');
            editor.emit('afterChangeMode')
        })
    }    
}