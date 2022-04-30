import {
  THROTTLE,
  IF,
  PREVENT,
  KEYDOWN,
  KEYUP,
  ENTER,
  CLICK,
  SUBSCRIBE,
} from "sapa";

import icon from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class KeyframeTimeControl extends EditorElement {
  template() {
    return /*html*/ `
        <div class='keyframe-time-control'>
            <div class='time-manager'>
                <button type="button" ref='$timer'>${icon.timer}</button>
                <label>
                    <input type="text" ref='$currentTime' />
                </label>
                <label>FPS <input type="number" ref='$fps' min="0" max="999" /></label>
                <label>
                    <input type="text" ref='$duration' />
                </label>
            </div>
        </div>`;
  }

  refresh() {
    this.refreshTimeInfo();
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

  refreshTimeInfo() {
    var timeline = this.currentTimeline;

    if (timeline) {
      this.refs.$currentTime.val(timeline.currentTimecode);
      this.refs.$duration.val(timeline.totalTimecode);
      this.refs.$fps.val(timeline.fps);
    }
  }

  refreshCurrentTime() {
    var timeline = this.currentTimeline;

    if (timeline) {
      this.refs.$currentTime.val(timeline.currentTimecode);
    }
  }

  [SUBSCRIBE("playTimeline")]() {
    this.refreshCurrentTime();
  }

  [SUBSCRIBE("refreshTimeline")]() {
    this.refresh();
  }

  [SUBSCRIBE("moveTimeline", "refreshSelection") + THROTTLE(10)]() {
    this.refresh();
  }

  [KEYUP("$fps") + ENTER]() {
    var fps = +this.refs.$fps.val();

    var project = this.$context.selection.currentProject;

    if (project) {
      project.setFps(fps);
      this.emit("moveTimeline");
    }
  }

  checkNumberOrTimecode(e) {
    var value = e.target.value.trim();
    if (+value + "" === value) {
      return true;
    } else if (value.match(/^[0-9:]+$/)) {
      return true;
    }

    return false;
  }

  checkKey(e) {
    if (e.key.match(/^[0-9:]+$/)) {
      return true;
    } else if (
      e.code === "Backspace" ||
      e.code === "ArrowRight" ||
      e.code === "ArrowLeft"
    ) {
      return true;
    }

    return false;
  }

  [CLICK("$timer")]() {
    var project = this.$context.selection.currentProject;

    if (project) {
      project.seek(this.refs.$currentTime.value, () => {
        return true;
      });
      this.emit("playTimeline");
    }
  }

  [KEYDOWN("$currentTime")](e) {
    if (!this.checkKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  [KEYUP("$currentTime") +
    ENTER +
    IF("checkNumberOrTimecode") +
    IF("hasCurrentTimeline") +
    PREVENT]() {
    var frame = this.refs.$currentTime.value;
    var project = this.$context.selection.currentProject;

    if (project) {
      project.setTimelineCurrentTime(frame);
    }

    this.refresh();
    this.emit("moveTimeline");
  }

  [KEYDOWN("$duration")](e) {
    if (!this.checkKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  [KEYUP("$duration") +
    ENTER +
    IF("checkNumberOrTimecode") +
    IF("hasCurrentTimeline") +
    PREVENT]() {
    var frame = this.refs.$duration.value;
    var project = this.$context.selection.currentProject;

    if (project) {
      project.setTimelineTotalTime(frame);
    }

    this.refresh();
    this.emit("moveTimeline");
  }
}
