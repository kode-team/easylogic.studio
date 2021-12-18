
import { timecode } from "el/utils/time";
import _currentProject from "./_currentProject";

export default {
    command: 'prevTimelineItem',
    execute: function (editor) {

        _currentProject(editor, (project, timeline) => {
            var prevTime = project.getSelectedTimelinePrevTime();

            project.setTimelineCurrentTime(timecode(timeline.fps, prevTime));
            project.seek();

            editor.emit('playTimeline');
            editor.changeMode('SELECTION');
            editor.emit('afterChangeMode')
        })
    }    

}