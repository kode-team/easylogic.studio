import _currentProject from "./_currentProject";

import { timecode } from "elf/core/time";

export default {
  command: "lastTimelineItem",
  execute: function (editor) {
    _currentProject(editor, (project, timeline) => {
      var lastTime = project.getSelectedTimelineLastTime();

      project.setTimelineCurrentTime(timecode(timeline.fps, lastTime));
      project.seek();
      editor.emit("playTimeline");
    });
  },
};
