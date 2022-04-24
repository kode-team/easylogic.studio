import { POINTERSTART, BIND, SUBSCRIBE_SELF } from "sapa";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";
import { MOVE } from "elf/editor/types/event";
import "./MediaProgressEditor.scss";
import { createComponent } from "sapa";

export default class MediaProgressEditor extends EditorElement {
  initState() {
    const [start, end, duration] = (this.props.value || "").split(":");

    return {
      start: +(start || 0),
      end: +(end || 1),
      duration: +(duration || 1),
    };
  }

  refresh() {
    this.load();

    this.children.$s.setValue(this.state.start * this.state.duration);
    this.children.$e.setValue(this.state.end * this.state.duration);

    this.children.$s.setMax(this.state.duration);
    this.children.$e.setMax(this.state.duration);
  }

  template() {
    const { start, end, duration } = this.state;

    return /*html*/ `
            <div class='elf--media-progress-editor'>
                <div class='drag-area'>
                    <div class='progress-bar' ref='$progress'></div>
                    <div class='bar' ref='$bar'></div>                
                    <div class='drag-item start' ref='$start'></div>
                    <div class='drag-item end' ref='$end'></div>
                </div>
                <div class='item'>
                    ${createComponent("NumberRangeEditor", {
                      ref: "$s",
                      label: "Start",
                      key: "start",
                      min: 0,
                      max: duration,
                      step: 0.001,
                      value: start * duration,
                      onchange: "changeValue",
                    })}
                </div>
                <div class='item'>
                    ${createComponent("NumberRangeEditor", {
                      ref: "$e",
                      label: "End",
                      key: "end",
                      min: 0,
                      max: duration,
                      step: 0.001,
                      value: end * duration,
                      onchange: "changeValue",
                    })}
                </div>                
            </div>
        `;
  }

  [SUBSCRIBE_SELF("changeValue")](key, value) {
    this.updateData(
      {
        [key]: value / this.state.duration,
      },
      true
    );
  }

  [POINTERSTART("$start") + MOVE("moveStart")]() {
    this.rect = this.refs.$progress.rect();
    this.pos = Length.parse(this.refs.$start.css("left")).toPx(this.rect.width);
    this.max = Length.parse(this.refs.$end.css("left")).toPx(this.rect.width);
  }

  moveStart(dx) {
    var realPos = Math.min(this.max.value, Math.max(0, this.pos.value + dx));
    this.state.start = realPos / this.rect.width;
    this.children.$s.setValue(this.state.start * this.state.duration);

    this.refresh();
    this.updateData();
  }

  [BIND("$start")]() {
    return {
      "data-info": this.state.start,
      style: {
        left: Length.percent((this.state.start || 0) * 100),
      },
    };
  }

  [POINTERSTART("$end") + MOVE("moveStartForEnd")]() {
    this.rect = this.refs.$progress.rect();
    this.pos = Length.parse(this.refs.$end.css("left")).toPx(this.rect.width);
    this.min = Length.parse(this.refs.$start.css("left")).toPx(this.rect.width);
    this.max = this.rect.width;
  }

  moveStartForEnd(dx) {
    var realPos = Math.max(
      this.min.value,
      Math.min(this.max.value, this.pos.value + dx)
    );
    this.state.end = realPos / this.rect.width;
    this.children.$e.setValue(this.state.end * this.state.duration);
    this.refresh();
    this.updateData();
  }

  [BIND("$end")]() {
    return {
      "data-info": this.state.end,
      style: {
        left: Length.percent((this.state.end || 1) * 100),
      },
    };
  }

  [BIND("$bar")]() {
    const start = this.state.start || 0;
    const end = this.state.end || 1;
    return {
      style: {
        left: Length.percent(start * 100),
        width: Length.percent((end - start) * 100),
      },
    };
  }

  getValue() {
    const { start, end, duration } = this.state;
    return `${start}:${end}:${duration}`;
  }

  setValue(value) {
    const [start, end, duration] = value.split(":");
    this.setState({
      start: Number(start),
      end: Number(end),
      duration: Number(duration),
    });
  }

  updateData(data = {}, isRefresh = false) {
    this.setState(data, isRefresh);

    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.getValue(),
      this.props.params
    );
  }
}
