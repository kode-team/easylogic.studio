import _currentProject from "./_currentProject";

import { timecode } from "elf/core/time";

export default {
  command: "nextTimelineItem",
  execute: function (editor) {
    _currentProject(editor, (project, timeline) => {
      var nextTime = project.getSelectedTimelineNextTime();

      project.setTimelineCurrentTime(timecode(timeline.fps, nextTime));
      project.seek();
      editor.emit("playTimeline");
    });
  },
};
