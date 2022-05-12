import { DEBOUNCE, THROTTLE, SUBSCRIBE } from "sapa";

import { RESIZE_WINDOW, REFRESH_SELECTION } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class KeyframeTimeGridView extends EditorElement {
  template() {
    return /*html*/ `
            <div class='keyframe-time-grid-view'>
                <canvas ref="$canvas"></canvas>
            </div>
        `;
  }

  refresh() {
    this.refreshCanvas();
  }

  currentTimeline() {
    var project = this.$context.selection.currentProject;

    if (project) {
      return project.getSelectedTimeline();
    }
  }

  hasCurrentTimeline() {
    return !!this.currentTimeline();
  }

  refreshCanvas() {
    const strokeStyle = this.$theme("timeline_line_color");
    const timeline = this.currentTimeline();

    if (timeline) {
      var originalRect = this.$el.rect();
      var { width } = originalRect;
      var { currentTime, displayStartTime, displayEndTime } = timeline;

      this.refs.$canvas.resize(this.$el.rect());
      this.refs.$canvas.update(function () {
        var rect = this.rect();
        var realWidth = width - 20;
        var restX = 10;

        var left =
          ((currentTime - displayStartTime) /
            (displayEndTime - displayStartTime)) *
          realWidth;
        this.drawOption({ strokeStyle, lineWidth: 1 });
        this.drawLine(left + restX, 0, left + restX, rect.height);
      });
    }
  }

  [SUBSCRIBE(RESIZE_WINDOW) + DEBOUNCE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshTimeline", "playTimeline", "toggleFooterEnd")]() {
    this.refresh();
  }

  [SUBSCRIBE("moveTimeline", REFRESH_SELECTION) + THROTTLE(50)]() {
    this.refresh();
  }
}
