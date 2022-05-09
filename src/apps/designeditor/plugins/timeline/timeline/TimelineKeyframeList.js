import {
  CLICK,
  LOAD,
  DOMDIFF,
  DEBOUNCE,
  POINTERSTART,
  IF,
  DOUBLECLICK,
  KEYUP,
  KEY,
  SUBSCRIBE,
  isUndefined,
  Dom,
  classnames,
} from "sapa";

import { PathParser } from "elf/core/parser/PathParser";
import { timecode, second } from "elf/core/time";
import makeInterpolateOffset from "elf/editor/interpolate/interpolate-functions/offset-path/makeInterpolateOffset";
import { MOVE, END, RESIZE_WINDOW } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

const PADDING = 20;

export default class TimelineKeyframeList extends EditorElement {
  config(key) {
    return this.parent.state[key];
  }

  initState() {
    return {
      rect: null,
    };
  }

  calculateTimeToPosition(offsetTime, startTime, endTime) {
    var rate = (offsetTime - startTime) / (endTime - startTime);

    return this.rect.totalWidth * rate + PADDING / 2;
  }

  makeSubOffset(property, value) {
    var subOffset = [];

    if (property === "offset-path") {
      var [id] = value.split(",").map((it) => it.trim());
      var pathLayer = this.$model.get(id);
      if (pathLayer) {
        value = pathLayer.d;
      }
    } else {
      value = null;
    }

    if (value) {
      var parser = new PathParser(value);
      var { totalLength, interpolateList } = makeInterpolateOffset(
        parser.segments
      );

      var prevLength = 0;
      subOffset = interpolateList.map((it) => {
        var obj = { totalLength, length: it.length + prevLength };
        prevLength += it.length;
        return obj;
      });

      subOffset.pop(); // delete last length
    }

    return subOffset;
  }

  makeKeyframe(layerId, timeline, property) {
    var list = property.keyframes
      .filter((offset) => {
        return (
          timeline.displayStartTime <= offset.time &&
          offset.time <= timeline.displayEndTime
        );
      })
      .map((offset, index) => {
        var left = this.calculateTimeToPosition(
          offset.time,
          timeline.displayStartTime,
          timeline.displayEndTime
        );

        var subOffset = this.makeSubOffset(property.property, offset.value);

        return { left, ...offset, subOffset, index };
      });

    return /*html*/ `
        <div class='keyframe-back' 
            data-layer-id="${layerId}"
            data-property="${property.property}"
        >

            ${list
              .map((it, index) => {
                var next = list[index + 1];

                if (!next) return "";

                var start = it.left.value;
                var width = next.left.value - it.left.value;

                var selected =
                  this.$timeline.checked(it.id) &&
                  this.$timeline.checked(next.id);

                return /*html*/ `
                    <div 
                        data-selected="${selected}"
                        class="offset-line"
                        style='left: ${start}; width: ${width}'} ></div>

                    ${it.subOffset
                      .map((subOffset, subOffsetIndex) => {
                        var subOffsetLeft =
                          it.left.value +
                          (subOffset.length / subOffset.totalLength) * width;
                        return /*html*/ `
                        <div 
                            class='sub-offset'    
                            style='left: ${subOffsetLeft}'
                            data-offset-id="${it.id}"
                            data-layer-id="${layerId}"
                            data-property="${property.property}"
                            data-suboffset-index="${subOffsetIndex}"
                        ></div>
        
                        `;
                      })
                      .join("")}
                `;
              })
              .join("")}
        </div>
        <div class='keyframe'>

            ${list
              .map((it) => {
                var selected = this.$timeline.checked(it.id);

                return /*html*/ `<div class='offset' style='left: ${it.left}'
                    data-selected="${selected}"
                    data-offset-id="${it.id}"
                    data-layer-id="${layerId}"
                    data-property="${property.property}"
                    data-offset-index="${it.index}"
                ></div>

                `;
              })
              .join("")}
        </div>`;
  }

  makeTimelineKeyframeRow(timeline, animation) {
    var obj = this.$model.get(animation.id);

    if (!obj) {
      return;
    }

    var key = {};
    animation.properties
      .map((property) => {
        return property.keyframes.map((it) => it.time);
      })
      .forEach((it) => {
        it.forEach((a) => (key[a] = true));
      });

    var times = Object.keys(key).map((it) => +it);

    return /*html*/ `
        <div class='timeline-keyframe ${classnames({
          collapsed: animation.collapsed,
        })}' data-timeline-layer-id="${obj.id}">
            <div 
                class='timeline-keyframe-row layer' 
                data-row-index="${this.state.rowIndex++}"
                data-layer-id="${obj.id}"
            >
                <div class='keyframe-shadow'>
                ${times
                  .map((time) => {
                    var left = this.calculateTimeToPosition(
                      time,
                      timeline.displayStartTime,
                      timeline.displayEndTime
                    );
                    return /*html*/ `<div class='offset' style='left: ${left}'></div>`;
                  })
                  .join("")}
                </div>
            </div>

            ${animation.properties
              .map((property) => {
                return /*html*/ `
                <div 
                    class='timeline-keyframe-row layer-property'
                    data-row-index="${this.state.rowIndex++}"
                    data-property="${property.property}"
                    data-layer-id="${obj.id}"
                >
                    ${
                      property.keyframes.length
                        ? this.makeKeyframe(obj.id, timeline, property)
                        : ""
                    }
                </div>`;
              })
              .join("")}                                                      
        </div>
        `;
  }

  template() {
    return /*html*/ `
            <div class='timeline-keyframe-container' tabIndex="-1">
                <div ref='$keyframeList' class='timeline-keyframe-list'></div>
                <div class='drag-area' ref='$dragArea'></div>
            </div>
        `;
  }

  hasDragPlace(e) {
    var dom = Dom.create(e.target);
    return (
      dom.hasClass("offset") === false && dom.hasClass("offset-line") === false
    );
  }

  getRowIndex(index) {
    if (isUndefined(index)) {
      index = this.state.rowIndex;
    } else {
      index = +index;
    }

    return index;
  }

  [KEYUP("$el") + KEY("Backspace")]() {
    this.$commands.emit("deleteTimelineKeyframe");
  }

  isNotMoved(dx, dy) {
    return dx === 0 && dy === 0;
  }

  [POINTERSTART("$el") +
    IF("hasDragPlace") +
    MOVE("moveDragArea") +
    END("moveEndDragArea")](e) {
    this.dragXY = this.getRealPosition(e);
    this.startRowIndex = this.getRowIndex(
      Dom.create(e.target).attr("data-row-index")
    );
    this.left = null;
    this.width = null;
  }

  moveDragArea(dx, dy) {
    if (this.isNotMoved(dx, dy)) return;
    var left =
      dx < 0 ? Length.px(this.dragXY.x + dx) : Length.px(this.dragXY.x);
    var top = dy < 0 ? Length.px(this.dragXY.y + dy) : Length.px(this.dragXY.y);
    var width = Math.abs(dx);
    var height = Math.abs(dy);

    this.refs.$dragArea.css({ left, top, width, height });

    this.left = left;
    this.width = width;
  }

  getLayerList() {
    var rowIndex = this.getRowIndex(
      Dom.create(this.$config.get("bodyEvent").target).attr("data-row-index")
    );

    var startIndex = Math.min(rowIndex, this.startRowIndex);
    var endIndex = Math.max(rowIndex, this.startRowIndex);

    var arr = [];
    for (var i = startIndex; i <= endIndex; i++) {
      arr.push(`[data-row-index="${i}"]`);
    }
    var list = this.refs.$keyframeList.$$(arr.join(",")).map((it) => {
      var [layerId, property] = it.attrs("data-layer-id", "data-property");
      return { layerId, property };
    });

    return list;
  }

  getTime(start, end, rate) {
    return start + (end - start) * rate;
  }

  moveEndDragArea(dx, dy) {
    if (this.isNotMoved(dx, dy)) return;
    if (!this.left) {
      if (this.doubleClicked) {
        this.doubleClicked = false;
      } else {
        this.$timeline.empty();
        this.refresh();
      }
      return;
    }

    this.refs.$dragArea.css({
      left: null,
      top: null,
      width: null,
      height: null,
    });

    var width = this.$el.width();

    var startTime = this.getTimeRateByPosition(this.left.value / width);
    var endTime = this.getTimeRateByPosition(
      (this.left.value + this.width) / width
    );

    this.$timeline.selectBySearch(this.getLayerList(), startTime, endTime);
    this.refresh();

    this.startRowIndex = null;
  }

  [LOAD("$keyframeList") + DOMDIFF]() {
    var project = this.$context.selection.currentProject;

    if (!project) return "";

    var selectedTimeline = project.getSelectedTimeline();

    if (!selectedTimeline) return "";

    if (!this.state.rect) {
      this.state.rect = this.$el.rect();
    }

    var { width } = this.state.rect;
    var totalWidth = width - PADDING;
    var startX = PADDING / 2;
    this.rect = {
      totalWidth,
      startX,
    };
    this.state.rowIndex = 0;

    return selectedTimeline.animations.map((animation) => {
      return this.makeTimelineKeyframeRow(selectedTimeline, animation);
    });
  }

  [CLICK("$el .timeline-keyframe-row.layer .title")](e) {
    e.$dt.closest("timeline-keyframe").toggleClass("collapsed");
  }

  // eslint-disable-next-line getter-return
  get currentTimeline() {
    var project = this.$context.selection.currentProject;

    if (project) {
      return project.getSelectedTimeline();
    }
  }

  hasCurrentTimeline() {
    return !!this.currentTimeline;
  }

  getRealPosition(e) {
    var rect = this.$el.rect();
    var pos = {
      x: e.xy.x - rect.left,
      width: rect.width,
      y: e.xy.y - rect.top,
      height: rect.height,
    };

    var min = 10;
    var max = pos.width - 10;

    if (pos.x < min) {
      pos.x = min;
    }

    if (pos.x > max) {
      pos.x = max;
    }

    pos.rate = (pos.x - min) / (max - min);

    return pos;
  }

  getTimeRateByPosition(rate) {
    var selectedTimeline = this.currentTimeline;

    if (selectedTimeline) {
      var { displayStartTime, displayEndTime } = selectedTimeline;
      return this.getTime(displayStartTime, displayEndTime, rate);
    }

    return 0;
  }

  [DOUBLECLICK("$el .layer-property")](e) {
    var [layerId, property] = e.$dt.attrs("data-layer-id", "data-property");
    var time = this.getTimeRateByPosition(this.getRealPosition(e).rate);
    this.$commands.emit("addTimelineKeyframe", { layerId, property, time });

    this.doubleClicked = true;
    this.refresh();
  }

  [POINTERSTART("$el .layer-property .offset") +
    IF("hasCurrentTimeline") +
    MOVE("moveOffset") +
    END("moveEndOffset")](e) {
    this.$offset = e.$dt;

    var id = this.$offset.attr("data-offset-id");
    var property = this.$offset.attr("data-property");
    var layerId = this.$offset.attr("data-layer-id");

    this.$keyframeBack = this.$offset
      .closest("timeline-keyframe-row")
      .$(".keyframe-back");

    var { width } = this.$el.rect();
    var totalWidth = width - PADDING;
    var startX = PADDING / 2;
    this.rect = {
      totalWidth,
      startX,
    };

    var project = this.$context.selection.currentProject;
    if (project) {
      this.offset = project.getTimelineKeyframeById(layerId, property, id);
      this.layerId = layerId;
      this.property = property;
      this.cachedOffsetTime = this.offset.time;
    }
    this.timeline = this.currentTimeline;

    if (this.$timeline.checked(id)) {
      // NOOP , selection 변한 없음.
    } else {
      this.$timeline.select(this.offset);
    }

    this.cachedOffsetList = {};

    this.$timeline.cachedList().forEach((it) => {
      this.cachedOffsetList[it.id] = it.time;
    });

    this.emit("refreshOffsetValue", this.offset);
  }

  moveOffset(dx, dy) {
    if (this.isNotMoved(dx, dy)) return;
    var { displayStartTime, displayEndTime, fps } = this.timeline;

    var sign = dx < 0 ? -1 : 1;
    var dxRate = Math.abs(dx) / this.rect.totalWidth;
    var dxTime = dxRate * (displayEndTime - displayStartTime);

    this.$timeline.each((item) => {
      var newOffsetTime = this.cachedOffsetList[item.id] + dxTime * sign;

      newOffsetTime = Math.max(newOffsetTime, displayStartTime);
      newOffsetTime = Math.min(newOffsetTime, displayEndTime);

      var code = timecode(fps, newOffsetTime);
      newOffsetTime = second(fps, code);

      item.time = newOffsetTime;
    });

    this.refresh();
    this.emit("refreshOffsetValue", this.offset);
  }

  [SUBSCRIBE("toggleTimelineObjectRow")](id, isToggle) {
    this.$el
      .$(`.timeline-keyframe[data-timeline-layer-id="${id}"]`)
      .toggleClass("collapsed", isToggle);
  }

  moveEndOffset(dx, dy) {
    if (this.isNotMoved(dx, dy)) {
      this.refresh();
      this.emit("refreshOffsetValue", this.offset);
      return;
    }
    var project = this.$context.selection.currentProject;
    if (project) {
      this.$timeline.each((item) => {
        project.sortTimelineKeyframe(item.layerId, item.property);
      });
      this.refresh();
    }
  }

  [SUBSCRIBE("addTimeline", "moveTimeline") + DEBOUNCE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshTimeline", "toggleFooterEnd")]() {
    this.refresh();
  }

  [SUBSCRIBE(RESIZE_WINDOW) + DEBOUNCE(100)]() {
    this.refresh();
  }
}
