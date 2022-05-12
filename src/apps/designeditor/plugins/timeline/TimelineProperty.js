import {
  DRAGOVER,
  DROP,
  PREVENT,
  DEBOUNCE,
  SCROLL,
  SUBSCRIBE,
  createComponent,
} from "sapa";

import KeyframeTimeGridView from "./timeline/KeyframeTimeGridView";
import KeyframeTimeView from "./timeline/KeyframeTimeView";
import TimelineKeyframeList from "./timeline/TimelineKeyframeList";
import TimelineObjectList from "./timeline/TimelineObjectList";
import TimelinePlayControl from "./timeline/TimelinePlayControl";
import TimelineTopToolbar from "./timeline/TimelineTopToolbar";
import TimelineValueEditor from "./timeline/TimelineValueEditor";
import TimelineAnimationProperty from "./TimelineAnimationProperty";

import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class TimelineProperty extends BaseProperty {
  components() {
    return {
      TimelineKeyframeList,
      TimelineObjectList,
      TimelineTopToolbar,
      KeyframeTimeView,
      KeyframeTimeGridView,
      TimelineValueEditor,
      TimelinePlayControl,
      TimelineAnimationProperty,
    };
  }

  isFirstShow() {
    return false;
  }

  getTitle() {
    return this.$i18n("timeline.property.title");
  }

  getTools() {
    return createComponent("TimelinePlayControl");
  }

  getClassName() {
    return "timeline full managed-tool";
  }

  getBody() {
    return /*html*/ `
      <div class='timeline-animation-area'>
        ${createComponent("TimelineAnimationProperty")}
      </div>
      <div class='timeline-area'>
        <div class='timeline-header'>
          <div class='timeline-object-toolbar'>
            ${createComponent("TimelineTopToolbar")}
          </div>
          <div class='timeline-keyframe-toolbar' ref='$keyframeToolBar'>
            ${createComponent("KeyframeTimeView", { ref: "$keyframeTimeView" })}
          </div>
        </div>
        <div class='timeline-body'>
          <div class='timeline-object-area' ref='$area'>
            ${createComponent("TimelineObjectList")}
          </div>
          <div class='timeline-keyframe-area' ref='$keyframeArea'>
            ${createComponent("TimelineKeyframeList", { ref: "$keyframeList" })}
          </div>
            ${createComponent("KeyframeTimeGridView", {
              ref: "$keyframeTimeGridView",
            })}
        </div>
      </div>
      <div class='timeline-value-area'>
      ${createComponent("TimelineValueEditor", {
        ref: "$valueEditor",
        onchange: "changeKeyframeValue",
      })}
      </div>
    `;
  }

  [SCROLL("$keyframeArea")]() {
    this.refs.$area.setScrollTop(this.refs.$keyframeArea.scrollTop());
  }

  [SCROLL("$area")]() {
    this.refs.$keyframeArea.setScrollTop(this.refs.$area.scrollTop());
  }

  [SUBSCRIBE("refreshValueEditor") + DEBOUNCE(100)]() {
    this.children.$valueEditor.refresh();
  }

  afterRender() {
    this.trigger("refreshValueEditor");
  }

  [SUBSCRIBE("changeKeyframeValue")](obj) {
    this.$commands.emit("setTimelineOffset", obj);
  }

  [DRAGOVER("$area") + PREVENT]() {}
  [DROP("$area") + PREVENT](e) {
    this.$commands.emit("addTimelineItem", e.dataTransfer.getData("layer/id"));
  }

  onToggleShow() {
    this.emit("toggleFooter", this.isPropertyShow());
    this.emit("timeline.view", this.isPropertyShow());
  }
}
