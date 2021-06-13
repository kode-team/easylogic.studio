

import "../menu-items";
import { CLICK } from "el/base/Event";
import { registElement } from "el/base/registElement";
import { PluginManager } from "el/editor/manager/PluginManager";
import { EditorElement } from "../common/EditorElement";

export default class ComponentItems extends EditorElement {

  template() {
    return /*html*/`
      <div class='component-items'>
        <div class='group'>
         <label>${this.$i18n('component.items.custom')}</label>
          <div class='list'>            
            <object refClass="AddCube" title='Cube' />
            <object refClass="AddCylinder" title='Cylinder' />          
          </div>          
        </div>          
        <div>
          <object refClass="CustomComponentItems" />
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.plugin')}</label>
          <div class='list'>
            ${this.$menuManager.getTargetMenuItems('sidebar').map(it => {
              return /*html*/`<object refClass="${it.refClass}" />`
            })}
          </div>          
        </div>                  
      </div>
    `;
  }


  [CLICK('$el button')] (e) {

    var selected = this.refs.$el.$('.selected');
    if (selected) selected.removeClass('selected');

    e.$dt.addClass('selected');        
  }  

}

registElement({ ComponentItems })