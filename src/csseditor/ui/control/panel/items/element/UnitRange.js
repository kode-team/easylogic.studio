import UIElement from "../../../../../../util/UIElement";
import {
  UNIT_PX,
  POSITION_LEFT,
  POSITION_TOP,
  POSITION_RIGHT,
  POSITION_BOTTOM,
  POSITION_CENTER
} from "../../../../../../util/css/types";
import { INPUT, CHANGE } from "../../../../../../util/Event";
import { Length } from "../../../../../../editor/unit/Length";

const position_list = [
  POSITION_LEFT,
  POSITION_TOP,
  POSITION_RIGHT,
  POSITION_BOTTOM,
  POSITION_CENTER
];

export default class UnitRange extends UIElement {
  created() {
    this.min = this.props.min || 0;
    this.max = this.props.max || 1000;
    this.step = this.props.step || 1;
    this.value = this.props.value || 0;
    this.unit = this.props.unit || UNIT_PX;
    this.showClass = "show";

    if (this.parent[this.props.maxvaluefunction]) {
      this.maxValueFunction = this.parent[this.props.maxvaluefunction].bind(
        this.parent
      );
    } else {
      this.maxValueFunction = () => {};
    }

    if (this.parent[this.props.updatefunction]) {
      this.updateFunction = this.parent[this.props.updatefunction].bind(
        this.parent
      );
    } else {
      this.updateFunction = () => {};
    }
  }

  template() {
    var value = position_list.includes(this.value) ? "0px" : this.value;
    var unit = Length.parse(value);
    return `
            <div class='unit-range'>
                <div class='base-value'>
                    <input ref="$range" type="range" class='range' min="${
                      this.min
                    }" max="${this.max}" step="${this.step}" value="${
      unit.value
    }" />
                    <input ref="$number" type="number" class='number' min="${
                      this.min
                    }" max="${this.max}" step="${this.step}" value="${
      unit.value
    }"  />
                    <select ref='$select'>
                        <option value='px' ${
                          unit.isPx() ? "selected" : ""
                        }>px</option>
                        <option value='%' ${
                          unit.isPercent() ? "selected" : ""
                        }>%</option>
                        <option value='em' ${
                          unit.isEm() ? "selected" : ""
                        }>em</option>
                    </select>
                </div>
            </div>
        `;
  }

  refreshValue(len = Length.px(0)) {
    this.selectUnit(len);
  }

  selectUnit(len) {
    this.len = len;
    this.refs.$range.val(this.len.value);
    this.refs.$number.val(this.len.value);
    this.refs.$select.val(this.len.unit);
  }

  [CHANGE("$select")]() {
    var unit = this.refs.$select.value;
    this.selectUnit(this.len.to(unit, this.maxValueFunction()));
  }

  [INPUT("$range")](e) {
    var value = +this.refs.$range.val();
    this.refs.$number.val(this.len.value);
    this.len = new Length(value, this.refs.$select.value);

    this.updateRange();
  }

  [INPUT("$number")](e) {
    var value = +this.refs.$number.val();
    this.refs.$range.val(this.len.value);
    this.len = new Length(value, this.refs.$select.value);

    this.updateRange();
  }

  updateRange() {
    this.updateFunction(this.len);
  }
}
