import _currentProject from "./_currentProject";

import { timecode } from "elf/core/time";

export default {
  command: "prevTimelineItem",
  execute: function (editor) {
    _currentProject(editor, (project, timeline) => {
      var prevTime = project.getSelectedTimelinePrevTime();

      project.setTimelineCurrentTime(timecode(timeline.fps, prevTime));
      project.seek();

      editor.emit("playTimeline");
    });
  },
};
