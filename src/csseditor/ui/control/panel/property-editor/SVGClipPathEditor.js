import { html } from "../../../../../util/functions/func";
import icon from "../../../icon/icon";
import { EMPTY_STRING } from "../../../../../util/css/types";
import UIElement from "../../../../../util/UIElement";
import { CHANGE, CLICK } from "../../../../../util/Event";


export default class SVGClipPathEditor extends UIElement {

  initState() {
    return {
      fit: !!this.props.value.fit,
      icon: this.props.value.icon || ''
    }
  }

  template() {

    var checked = this.state.fit ? 'checked="checked"' : EMPTY_STRING

    return html`
      <div class='svg-clip-path-editor clippath-list'>
          <div class='label' >
              <label>${this.props.title || ''}</label>
              <div class='tools'>
              </div>
          </div>
          <div>
            <label>Fit to size <input type='checkbox' ref='$fit' ${checked}  /> </label>
          </div>
          <div>
            <select ref="$clippathSelect">
            ${Object.keys(icon).map(iconName => {
              var selected = this.state.icon === iconName ? 'selected' : ''; 
              return `<option value='${iconName}' ${selected}>${iconName}</option>`;
            }).join(EMPTY_STRING)}
          </select>
          </div>
      </div>`;
  }

  updateData (data = {}) {
    this.setState(data, false)

    this.modifyClipPath()
  }

  [CLICK('$fit')] () {
    
    this.updateData({ 
      fit : this.refs.$fit.checked()
    })
  }

  [CHANGE('$clippathSelect')] () {
    this.updateData({ 
      icon : this.refs.$clippathSelect.value
    })
  }
  
  modifyClipPath () {
    var {icon ,fit } = this.state
    this.parent.trigger(this.props.onchange, this.props.key, {icon, fit} )
  }

}
