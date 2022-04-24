export default {
  command: "pauseTimelineItem",
  execute: function (editor) {
    if (editor.timer) {
      editor.timer.stop();
    }
  },
};
