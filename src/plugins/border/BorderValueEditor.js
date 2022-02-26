import { Length } from "el/editor/unit/Length";
import { Border } from "el/editor/property-parser/Border";
import { SUBSCRIBE_SELF } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './BorderValueEditor.scss';
import { BorderStyle } from "el/editor/types/model";
import { iconUse } from "el/editor/icon/icon";
import { createComponent } from "el/sapa/functions/jsx";

const borderStyleList = [
  BorderStyle.NONE,
  BorderStyle.HIDDEN,
  BorderStyle.SOLID,
  BorderStyle.DASHED,
  BorderStyle.DOTTED,
  BorderStyle.DOUBLE,
  BorderStyle.GROOVE,
  BorderStyle.RIDGE,
  BorderStyle.INSET,
  BorderStyle.OUTSET
].join(',');



export default class BorderValueEditor extends EditorElement {

  initState() {

    return {
      value: Border.parseValue(this.props.value)
    }
  }

  updateData(obj) {
    this.setState(obj, false);
    this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params);  
  }

  getValue() {
    return Border.joinValue(this.state.value)
  }

  setValue(value) {
    this.state.value = Border.parseValue(value);
    this.refresh();
  }

  refresh () {

    const width = Length.parse(this.state.value.width === 'undefined' ? 0 : this.state.value.width);

    this.children.$width.setValue(width.value || 0)
    this.children.$style.setValue(this.state.value.style || 'solid')
    this.children.$color.setValue(this.state.value.color || 'rgba(0, 0, 0, 1)')
  }
   

  template() {
    var {width, style, color} = this.state.value; 
    return /*html*/`
      <div class="elf--border-value-editor">
        <div class='editor-area'>
          ${createComponent("NumberInputEditor", {
            label: iconUse("line_weight"),
            compact: true,
            ref: '$width',
            min: 0,
            max: 100,
            step: 1,
            key: "width", 
            value: width,
            onchange: 'changeKeyValue' 
          })}
          ${createComponent("SelectEditor", {
            ref: '$style',
            key: 'style',
            label: iconUse('line_style'),
            title: 'Style',
            compact: true,
            options: borderStyleList,
            value: style || 'solid',
            onchange: "changeKeyValue",

          })}
          ${createComponent("ColorViewEditor", {
            ref: '$color',
            key: 'color',
            mini: true,
            value: color|| 'rgba(0, 0, 0, 1)',
            onchange: "changeKeyValue"
          })}
        </div>
      </div>
    `;
  }


  [SUBSCRIBE_SELF('changeKeyValue')] (key, v) {
    var value = this.state.value;
    value[key] = v; 

    this.updateData({ value })
  }

}