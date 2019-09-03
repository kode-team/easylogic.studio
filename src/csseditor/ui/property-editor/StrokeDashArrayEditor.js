import { LOAD } from "../../../util/Event";
import UIElement, { EVENT } from "../../../util/UIElement";
import NumberRangeEditor from "./NumberRangeEditor";
import { isArray } from "../../../util/functions/func";

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
    return `<div class='stroke-dasharray-editor' ref='$body'></div>`
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
      return `
        <div>
          <NumberRangeEditor 
            ref='$${num}' 
            label='${num}' 
            key='${index}' 
            value="0" 
            min="0"
            max="1000"
            step="1"
            calc="false"
            unit="number" 
            onchange="changeRangeEditor" 
          />
        </div>
      `
    }).join(' ');
  }

  [EVENT('changeRangeEditor')] (key, value) {
    var index = +key
    this.state.value[index] = value 

    this.modifyStrokeDashArray();
  }


  modifyStrokeDashArray () {
    this.parent.trigger(this.props.onchange, this.props.key,  this.toStringValue(), this.props.params);
  }


}
