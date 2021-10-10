import { LOAD, CLICK, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './StrokeDashArrayEditor.scss';

export default class StrokeDashArrayEditor extends EditorElement {


  initialize() {
    super.initialize();

    this.notEventRedefine = true;
  }  


  initState() {

    var value = this.generateValue(this.props.value || '')
    
    return {
      label: this.props.label || '',
      value
    }
  }

  template() {

    const { label } = this.state; 
    const hasLabel = !!label

    return /*html*/`
      <div class='elf--stroke-dasharray-editor'>
        <div class='tools ${hasLabel ? 'has-label': ''}'>
          ${hasLabel ? `<label class='label'>${label}</label>` : ''}
          <label ref='$add'>${icon.add} ${this.$i18n('stroke.dasharray.editor.add')}</label>
        </div>      
        <div ref='$body'></div>
      </div>
    `
  }

  toStringValue () {
    return this.state.value.join(' ');
  }

  getValue () {
    return this.toStringValue()
  }

  generateValue (value) {
    return value.split(" ").filter(Boolean).map(it => +it);
  }

  setValue (value) {

    if (Array.isArray(value)) {

    } else {
      value = this.generateValue(value);
    }

    this.setState({
      value
    })

  }

  [LOAD('$body')] () {

    return this.state.value.map( (value, index) =>  {
      var num = index + 1; 
      return /*html*/`
        <div class='dasharray-item'>
          <object refClass="NumberRangeEditor"  
            ref='$${num}' 
            label='${num}'
            key='${index}' 
            value="${value}" 
            min="0"
            max="100"
            step="1"
            onchange="changeRangeEditor" 
          />
          <button type="button" data-index="${index}" class='delete'>${icon.remove2}</button>
        </div>
      `
    });
  }

  [SUBSCRIBE_SELF('changeRangeEditor')] (key, value) {
    var index = +key
    this.state.value[index] = value 

    this.modifyStrokeDashArray();
  }

  [CLICK('$add')] () {

    this.setState({
      value: [...this.state.value, 0]
    })
  }

  [CLICK('$body .delete')] (e) {
    const index = +e.$dt.attr('data-index');

    this.state.value.splice(index, 1);

    this.refresh();
    this.modifyStrokeDashArray();    
  }


  modifyStrokeDashArray () {
    this.parent.trigger(this.props.onchange, this.props.key,  this.toStringValue(), this.props.params);
  }


}