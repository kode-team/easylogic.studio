import {
  LOAD,
  CLICK,
  DOUBLECLICK,
  FOCUSOUT,
  PREVENT,
  STOP,
  DOMDIFF,
  KEYDOWN,
  DEBOUNCE,
  ENTER,
  SUBSCRIBE,
} from "sapa";

import "./TimelineAnimationProperty.scss";

import icon from "elf/editor/icon/icon";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class TimelineAnimationProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("timeline.animation.property.title");
  }

  getClassName() {
    return "full";
  }

  getTools() {
    return /*html*/ `
      <button type='button' ref='$add' title="Add an animation">${icon.add}</button>
    `;
  }

  getBody() {
    return /*html*/ `
      <div class="elf--timeline-animation-list" ref="$timelineAnimationList"></div>
    `;
  }

  [LOAD("$timelineAnimationList") + DOMDIFF]() {
    var project = this.$context.selection.currentProject;
    if (!project) return "";

    return project.timeline.map((timeline) => {
      var selected = timeline.selected ? "selected" : "";
      return /*html*/ `
        <div class='timeline-animation-item ${selected}'>
          <div class='preview icon'>
            ${icon.local_movie}
          </div>
          <div class='detail'>
            <label data-id='${timeline.id}'>${timeline.title}</label>
            <div class="tools">
              <button type="button" class="remove" data-id="${timeline.id}" title='Remove'>${icon.remove2}</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  [DOUBLECLICK("$timelineAnimationList .timeline-animation-item")](e) {
    this.startInputEditing(e.$dt.$("label"));
  }

  modifyDoneInputEditing(input) {
    this.endInputEditing(input, (index, text) => {
      var id = input.attr("data-id");

      var project = this.$context.selection.currentProject;
      if (project) {
        project.setTimelineTitle(id, text);
      }
    });
  }

  [KEYDOWN("$timelineAnimationList .timeline-animation-item label") +
    ENTER +
    PREVENT +
    STOP](e) {
    this.modifyDoneInputEditing(e.$dt);
  }

  [FOCUSOUT("$timelineAnimationList .timeline-animation-item label") +
    PREVENT +
    STOP](e) {
    this.modifyDoneInputEditing(e.$dt);
  }

  [CLICK("$add")]() {
    this.emit("addTimelineItem");
  }

  [CLICK("$timelineAnimationList .timeline-animation-item .remove")](e) {
    var id = e.$dt.attr("data-id");
    this.emit("removeAnimationItem", id);
    // this.refresh();
  }

  [CLICK("$timelineAnimationList .timeline-animation-item label")](e) {
    var id = e.$dt.attr("data-id");

    var project = this.$context.selection.currentProject;

    if (project) {
      project.selectTimeline(id);

      var $item = e.$dt.closest("timeline-animation-item");
      $item.onlyOneClass("selected");

      this.emit("refreshTimeline");
      this.emit("selectTimeline");
    }
  }

  [SUBSCRIBE("addTimeline", "removeTimeline", "removeAnimation")]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshTimeline", "refreshSelection", "refreshArtboard") +
    DEBOUNCE(100)]() {
    this.refresh();
  }
}
