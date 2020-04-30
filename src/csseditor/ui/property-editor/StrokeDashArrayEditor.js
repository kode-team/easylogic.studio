import { LOAD, CLICK } from "../../../util/Event";
import UIElement, { EVENT } from "../../../util/UIElement";
import NumberRangeEditor from "./NumberRangeEditor";
import { isArray } from "../../../util/functions/func";
import icon from "../icon/icon";

export default class StrokeDashArrayEditor extends UIElement {
  components() {
    return { 
      NumberRangeEditor
    }
  }
  initState() {

    var value = this.props.value || ' '
    
    value = value.split(' ').map(it => +it);

    return {
      value
    }
  }

  template() {
    return /*html*/`
      <div class='stroke-dasharray-editor'>
        <div ref='$body'></div>
        <div class='tools'>
          <label ref='$add'>${icon.add} ${this.$i18n('stroke.dasharray.editor.add')}</label>
        </div>
      </div>
    `
  }

  toStringValue () {
    return this.state.value.join(' ');
  }

  getValue () {
    return this.toStringValue()
  }

  setValue (value) {

    if (isArray(value)) {

    } else {
      value = value.split(" ").map(it => +it);
    }

    this.setState({
      value
    })

  }

  [LOAD('$body')] () {

    return this.state.value.map( (it, index) =>  {
      var num = index + 1; 
      return /*html*/`
        <div class='dasharray-item'>
          <NumberRangeEditor 
            ref='$${num}' 
            label='${num}' 
            key='${index}' 
            value="0" 
            min="0"
            max="1000"
            step="1"
            onchange="changeRangeEditor" 
          />
        </div>
      `
    });
  }

  [EVENT('changeRangeEditor')] (key, value) {
    var index = +key
    this.state.value[index] = value 

    this.modifyStrokeDashArray();
  }

  [CLICK('$add')] () {
    this.state.value.push(0);

    this.refresh();
  }


  modifyStrokeDashArray () {
    this.parent.trigger(this.props.onchange, this.props.key,  this.toStringValue(), this.props.params);
  }


}
