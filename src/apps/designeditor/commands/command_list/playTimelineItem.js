import _currentProject from "./_currentProject";

import { makeTimer, timecode } from "elf/core/time";

export default {
  command: "playTimelineItem",
  description: "Play button action",
  execute: function (
    editor,
    speed = 1,
    iterationCount = 1,
    direction = "normal"
  ) {
    editor.context.selection.empty();

    _currentProject(editor, (project, timeline) => {
      var lastTime = project.getSelectedTimelineLastTime();

      if (editor.timer) {
        editor.timer.stop();
      } else {
        editor.timer = makeTimer({
          elapsed: timeline.currentTime * 1000,
          speed,
          duration: lastTime * 1000,
          iterationCount,
          direction,
        });
      }

      editor.timer.play({
        duration: lastTime * 1000,
        elapsed: timeline.currentTime * 1000,
        speed,
        iterationCount,
        direction,
        tick: (elapsed) => {
          // console.log('tick', timecode(timeline.fps, elapsed / 1000), elapsed, elapsed/1000);
          project.seek(timecode(timeline.fps, elapsed / 1000));
          editor.emit("playTimeline");
        },
        last: (elapsed) => {
          // console.log('last', timecode(timeline.fps, elapsed / 1000), elapsed, elapsed/1000);
          project.seek(timecode(timeline.fps, elapsed / 1000));
          editor.emit("playTimeline");
          editor.nextTick(() => {
            editor.emit("stopTimeline");
          });
        },
        stop: (elapsed) => {
          // console.log('stop', timecode(timeline.fps, elapsed / 1000), elapsed, elapsed/1000);
          project.stop(timecode(timeline.fps, elapsed / 1000));
          editor.emit("stopTimeline");
        },
      });
    });
  },
};
