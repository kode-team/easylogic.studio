import { DEBOUNCE, POINTERSTART, THROTTLE, IF, SUBSCRIBE } from "sapa";

import { second, framesToTimecode } from "elf/core/time";
import {
  REFRESH_SELECTION,
  MOVE,
  END,
  RESIZE_WINDOW,
} from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

const PADDING = 20;

export default class KeyframeTimeView extends EditorElement {
  template() {
    return /*html*/ `
        <div class='keyframe-time-view'>
            <div class='time-duration'>
                <div class='duration-handle-left'></div>
                <div class='duration-handle-right'></div>
                <div class='duration-slider' ref='$slider'>
                    <div class='gauge' ref='$gauge'></div>
                    <div class='start' ref='$start'></div>
                    <div class='end' ref='$end'></div>
                </div>
            </div>
            <canvas ref="$canvas"></canvas>
        </div>`;
  }

  refresh() {
    this.refreshTimeDisplay();
    this.refreshCanvas();
  }

  get currentTimeline() {
    var currentProject = this.$context.selection.currentProject;

    if (currentProject) {
      return currentProject.getSelectedTimeline();
    }

    return null;
  }

  hasCurrentTimeline() {
    return !!this.currentTimeline;
  }

  refreshTimeDisplay() {
    var timeline = this.currentTimeline;

    if (timeline) {
      var start = Length.percent(
        (timeline.displayStartTime / timeline.totalTime) * 100
      );
      var end = Length.percent(
        (timeline.displayEndTime / timeline.totalTime) * 100
      );

      this.refs.$start.css("left", start);
      this.refs.$end.css("left", end);
      this.refs.$gauge.css({
        left: start,
        width: Length.percent(end.value - start.value),
      });
    }
  }

  [POINTERSTART("$start") +
    IF("hasCurrentTimeline") +
    MOVE("moveStartButton")]() {
    this.sliderRect = this.refs.$slider.rect();
    this.endX = Length.parse(this.refs.$end.css("left")).toPx(
      this.sliderRect.width
    );
  }

  moveStartButton() {
    var currentX = this.$config.get("pos").x - this.sliderRect.x;
    var minX = 0;
    var maxX = this.endX;

    currentX = Math.max(currentX, minX);
    currentX = Math.min(currentX, maxX);

    var displayTimeRate = currentX / this.sliderRect.width;

    this.$context.selection.currentProject.setDisplayStartTimeRate(
      displayTimeRate
    );

    this.refreshTimeDisplay();
    this.refreshCanvas();
    this.emit("moveTimeline");
  }

  [POINTERSTART("$end") + IF("hasCurrentTimeline") + MOVE("moveEndButton")]() {
    this.sliderRect = this.refs.$slider.rect();
    this.startX = Length.parse(this.refs.$start.css("left")).toPx(
      this.sliderRect.width
    );
  }

  moveEndButton() {
    var currentX = this.$config.get("pos").x - this.sliderRect.x;
    var minX = this.startX;
    var maxX = this.sliderRect.width;

    currentX = Math.max(currentX, minX);
    currentX = Math.min(currentX, maxX);

    var displayTimeRate = currentX / this.sliderRect.width;

    this.$context.selection.currentProject.setDisplayEndTimeRate(
      displayTimeRate
    );

    this.refreshTimeDisplay();
    this.refreshCanvas();
    this.emit("moveTimeline");
  }

  [POINTERSTART("$gauge") +
    IF("hasCurrentTimeline") +
    MOVE("moveGaugeButton")]() {
    this.sliderRect = this.refs.$slider.rect();
    var { displayStartTime, displayEndTime } = this.currentTimeline;
    this.timelineStartTime = displayStartTime;
    this.timelineEndTime = displayEndTime;
  }

  moveGaugeButton(dx) {
    var dxRate = dx / this.sliderRect.width;

    this.$context.selection.currentProject.setDisplayTimeDxRate(
      dxRate,
      this.timelineStartTime,
      this.timelineEndTime
    );

    this.refreshTimeDisplay();
    this.refreshCanvas();
    this.emit("moveTimeline");
  }

  config(key) {
    return this.parent.state[key];
  }

  setConfig(key, value) {
    this.parent.setState({ [key]: value }, false);
  }

  refreshCanvas() {
    var timeline_grid_font_color = this.$theme("timeline_grid_font_color");
    var timeline_timeview_bottom_color = this.$theme(
      "timeline_timeview_bottom_color"
    );
    var timeline_line_color = this.$theme("timeline_line_color");

    var timeline = this.currentTimeline;

    if (timeline) {
      var originalRect = this.$el.rect();
      var { width } = originalRect;

      var { displayStartTime, displayEndTime, fps, currentTime } = timeline;

      var startFrame = Math.floor(displayStartTime * fps);
      var endFrame = Math.floor(displayEndTime * fps);
      var width = originalRect.width;

      var totalFrame = endFrame - startFrame;
      var splitFrame = 5;

      if (totalFrame < 100) {
        splitFrame = 10;
      } else if (totalFrame < 1000) {
        splitFrame = 100;
      } else if (totalFrame < 10000) {
        splitFrame = 1000;
      } else if (totalFrame < 100000) {
        splitFrame = 10000;
      }

      if (startFrame % splitFrame !== 0) {
        startFrame = startFrame + (splitFrame - (startFrame % splitFrame));
      }

      var textOption = {
        textAlign: "center",
        textBaseline: "middle",
        font: "10px sans-serif",
      };

      this.refs.$canvas.resize({
        width,
        height: 24,
      });
      this.refs.$canvas.update(function () {
        var rect = this.rect();
        var realWidth = width - PADDING;
        this.drawOption({
          strokeStyle: "rgba(204, 204, 204, 0.3)",
          lineWidth: 0.5,
          ...textOption,
        });
        var restX = 10;
        var y = 7;
        for (; startFrame < endFrame; startFrame += splitFrame) {
          var startX =
            ((second(fps, startFrame) - displayStartTime) /
              (displayEndTime - displayStartTime)) *
            realWidth;
          this.drawOption({ fillStyle: timeline_grid_font_color });
          this.drawText(
            startX + restX,
            y,
            framesToTimecode(fps, startFrame).replace(/00:/g, "") + "f"
          );
        }

        this.drawOption({
          strokeStyle: timeline_timeview_bottom_color,
          lineWidth: 1,
        });
        this.drawLine(0, rect.height - 0.5, rect.width, rect.height);

        var left =
          ((currentTime - displayStartTime) /
            (displayEndTime - displayStartTime)) *
          realWidth;
        var markTop = 10;
        var markWidth = 4;
        this.drawOption({
          strokeStyle: timeline_line_color,
          fillStyle: timeline_line_color,
          lineWidth: 1,
        });
        this.drawPath(
          [left - markWidth + restX, rect.height - markTop],
          [left + markWidth + restX, rect.height - markTop],
          [left + markWidth + restX, rect.height - markWidth],
          [left + restX, rect.height],
          [left - markWidth + restX, rect.height - markWidth],
          [left - markWidth + restX, rect.height - markTop]
        );
      });
    }
  }

  [POINTERSTART("$canvas") +
    IF("hasCurrentTimeline") +
    MOVE() +
    END("moveEndCurrentTime")]() {
    this.selectedCanvasOffset = this.refs.$canvas.offset();
    this.originalRect = this.$el.rect();
    this.width = this.originalRect.width - PADDING;
    this.emit("hideSelectionToolView");
    this.$context.selection.empty();
    this.emit(REFRESH_SELECTION);
  }

  move() {
    var totalWidth = this.width;
    var minX = 0;
    var maxX = totalWidth;
    var currentX = this.$config.get("pos").x - this.selectedCanvasOffset.left;

    currentX = Math.max(currentX, minX);
    currentX = Math.min(currentX, maxX);

    this.$context.selection.currentProject.setTimelineCurrentTimeRate(
      currentX / totalWidth
    );

    this.refresh();
    this.$context.selection.currentProject.seek();

    this.emit("moveTimeline");
  }

  moveEndCurrentTime() {
    this.emit("resetSelection");
  }

  [SUBSCRIBE(RESIZE_WINDOW) + DEBOUNCE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshTimeline", "playTimeline", "toggleFooterEnd")]() {
    this.refresh();
  }

  [SUBSCRIBE("moveTimeline", REFRESH_SELECTION) + THROTTLE(10)]() {
    this.refresh();
  }
}
