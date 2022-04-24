import { timecode } from "elf/utils/time";
import _currentProject from "./_currentProject";

export default {
  command: "lastTimelineItem",
  execute: function (editor) {
    _currentProject(editor, (project, timeline) => {
      var lastTime = project.getSelectedTimelineLastTime();

      project.setTimelineCurrentTime(timecode(timeline.fps, lastTime));
      project.seek();
      editor.emit("playTimeline");
      editor.changeMode("SELECTION");
      editor.emit("afterChangeMode");
    });
  },
};
