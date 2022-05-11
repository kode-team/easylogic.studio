import { CLICK, SUBSCRIBE, SUBSCRIBE_SELF, createComponent } from "sapa";

import "./DrawManager.scss";

import { REFRESH_SELECTION } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class DrawManager extends EditorElement {
  initState() {
    return {
      tolerance: 1,
      stroke: "black",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      msg: this.$i18n("path.manager.msg"),
    };
  }

  [SUBSCRIBE(REFRESH_SELECTION)]() {
    var current = this.$context.selection.current;

    if (current) {
      this.children.$stroke?.setValue(current.stroke || "rgba(0, 0, 0, 1)");
      this.children.$strokeWidth?.setValue(
        current.strokeWidth || Length.number(1)
      );
    }
  }

  [SUBSCRIBE("setColorAsset")]({ color }) {
    if (this.$el.isShow()) {
      this.setState(
        {
          stroke: color,
        },
        false
      );
      this.children.$stroke.setValue(color);
      this.updateData({
        stroke: color,
      });
    }
  }

  template() {
    return /*html*/ `
      <div class='elf--draw-manager'>
        <div class="tools left" ref="$left">
            <button type="button" class="primary" data-value='DrawEditorDone' title='${this.$i18n(
              "draw.manager.mode.modify"
            )}' >Done</button>
        </div>      
        <div class='tools'>   
          <div >        
            <label data-tooltip="${this.$i18n(
              "draw.manager.tolerance"
            )}">Tolerance</label>       
            ${createComponent("NumberInputEditor", {
              ref: "$tolerance",
              key: "tolerance",
              value: 1,
              min: 0,
              max: 100,
              step: 0.01,
              unit: "number",
              onchange: "changeValue",
            })}
          </div>              
          <div >
            <label>${this.$i18n("svg.item.property.stroke")}</label>          
            ${createComponent("FillSingleEditor", {
              ref: "$stroke",
              simple: true,
              value: this.state.stroke,
              key: "stroke",
              onchange: "changeValue",
            })}
          </div>

          <div >
            <label>${this.$i18n(
              "svg.item.property.strokeWidth"
            )}</label>          
            ${createComponent("NumberInputEditor", {
              ref: "$strokeWidth",
              key: "strokeWidth",
              value: this.state["strokeWidth"],
              onchange: "changeValue",
            })}
          </div>      
          

          <div>
            <label data-tooltip="${this.$i18n(
              "svg.item.property.lineCap"
            )}">Cap</label>          
            ${createComponent("SelectEditor", {
              ref: "$strokeLineCap",
              key: "strokeLinecap",
              value: this.state["strokeLinecap"],
              options: ["butt", "round", "square"],
              onchange: "changeValue",
            })}
          </div> 
          <div>
            <label data-tooltip="${this.$i18n(
              "svg.item.property.lineJoin"
            )}">Join</label>          
            ${createComponent("SelectEditor", {
              ref: "$strokeLineJoin",
              key: "strokeLinejoin",
              value: this.state["strokeLinejoin"],
              options: ["miter", "bevel", "round"],
              onchange: "changeValue",
            })}
          </div>
        </div>
      </div>    
    `;
  }

  [SUBSCRIBE_SELF("changeValue")](key, value) {
    this.updateData({
      [key]: value,
    });
  }

  updateData(obj = {}) {
    this.setState(obj, false);
    this.state.instance.trigger(this.state.changeEvent, obj);
  }

  [SUBSCRIBE("changePathManager")](mode) {
    this.setState({ mode });
  }

  [SUBSCRIBE("showDrawManager")](obj = {}) {
    obj.changeEvent = obj.changeEvent || "changeDrawManager";
    this.setState(obj);
    this.$el.show();

    this.emit("hidePathManager");
  }

  [SUBSCRIBE("hideDrawManager")]() {
    this.$el.hide();
  }

  [CLICK("$left button")](e) {
    var message = e.$dt.attr("data-value");

    this.emit(message);
  }
}
