import _currentProject from "./_currentProject";
import { timecode } from "../../util/functions/time";

export default {
    command: 'firstTimelineItem',
    execute: function (editor) {

        _currentProject(editor, (project, timeline) => {
            var firstTime = project.getSelectedTimelineFirstTime();

            project.setTimelineCurrentTime(timecode(timeline.fps, firstTime));
            project.seek();
            editor.emit('playTimeline');
            editor.changeMode('SELECTION');
            editor.emit('afterChangeMode')
        })
    }    
}