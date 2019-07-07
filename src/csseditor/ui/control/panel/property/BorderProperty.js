import BaseProperty from "./BaseProperty";
import { CLICK, LOAD, DEBOUNCE } from "../../../../../util/Event";
import { Length } from "../../../../../editor/unit/Length";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";


const borderStyleLit = [
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset"
].join(',');

const borderTypeList = ["all", "top", "right", "bottom", "left"];

export default class BorderProperty extends BaseProperty {
  getTitle() {
    return "Border";
  }

  afterRender() {
    this.refresh();
  }

  [LOAD("$borderDirection")]() {
    var current = editor.selection.current || { border: {} };

    return borderTypeList.map(type => {
      return `<button type="button" data-value="${type}" ref="$${type}" has-value='${!!current
        .border[type]}'></button>`;
    });
  }

  getTemplateForBorderProperty() {
    return `
      <div class="property-item border-item">
        <div
          class="border-direction"
          ref="$borderDirection"
          data-selected-value="all"
        ></div>
        <div class='editor-area'>
          <RangeEditor label='width' ref='$width' min="0" max="100" step="1" key='width' onchange='changeRangeEditor' />
        </div>
        <div class='editor-area'>
          <SelectEditor label='Style' ref='$style' key='style' options='${borderStyleLit}' onchange="changeRangeEditor" />
        </div>
        <div class='editor-area'>
          <ColorViewEditor ref='$color'  onchange="changeBorderColor" />
        </div>
      </div>
    `;
  }

  getBody() {
    return `
        ${this.getTemplateForBorderProperty()}
    `;
  }

  [EVENT('changeRangeEditor')] (key, value) {
    this.refreshBorderInfo()
  }


  [EVENT("changeBorderColor")]() {
    this.refreshBorderInfo();
  }  

  refreshBorderInfo() {


    var current = editor.selection.current;

    if (current) {
      var type = this.refs.$borderDirection.attr("data-selected-value");
      var width = this.children.$width.getValue().clone()
      var style = this.children.$style.getValue();
      var color = this.children.$color.getValue();

      current.setBorder(type, { width, style, color});

      this.refresh();

      this.emit("refreshElement", current);
    }
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    var current = editor.selection.current;
    if (current) {
      if (current.is('artboard')) {
        this.hide();
      } else {
        this.show();
        this.refresh();
      }
    } else {
      this.hide();
    }

  }  


  [CLICK("$borderDirection button")](e) {
    var type = e.$delegateTarget.attr("data-value");
    this.refs.$borderDirection.attr("data-selected-value", type);

    var current = editor.selection.current;
    if (current) {
      current.setBorder(type);

      var border = current.getBorder(type);
      if (border) {

        this.children.$width.setValue(border.width || Length.px(0))
        this.children.$style.setValue(border.style || 'none')
        this.children.$color.setValue(border.color || 'rgba(0, 0, 0, 1)')
      }


    }

    this.refresh();
  }

}
