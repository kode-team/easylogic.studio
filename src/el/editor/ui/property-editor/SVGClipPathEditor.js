
import { CLICK, SUBSCRIBE } from "el/base/Event";
import "./IconListViewEditor";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class SVGClipPathEditor extends EditorElement {

  initState() {
    return {
      fit: !!this.props.value.fit,
      icon: this.props.value.icon || ''
    }
  }

  template() {

    var checked = this.state.fit ? 'checked="checked"' : ''

    return /*html*/`
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
            <object refClass="IconListViewEditor" ref='$svg' key='svg' value="${this.state.icon}" column="6" onchange='changeClipPath' />
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

  [SUBSCRIBE('changeClipPath')] (key, icon) {
    this.updateData({ icon })
  }
  
  modifyClipPath () {
    var {icon ,fit } = this.state
    this.parent.trigger(this.props.onchange, this.props.key, {icon, fit} )
  }

}

registElement({ SVGClipPathEditor })