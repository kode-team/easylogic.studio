import { CLICK } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import CustomComponentItems from "./CustomComponentItems";



export default class ComponentItems extends EditorElement {

  components() {
    return {
      CustomComponentItems
    }
  }

  template() {
    return /*html*/`
      <div class='component-items'>
        <div>
          <object refClass="CustomComponentItems" />
        </div>      
        <div class='group'>
         <label>${this.$i18n('component.items.custom')}</label>
          <div class='list'>            
            <object refClass="AddCube" title='Cube' />
            <object refClass="AddCylinder" title='Cylinder' />          
          </div>          
        </div>          
        <div class='group'>
         <label>${this.$i18n('component.items.plugin')}</label>
          <div class='list'>
            ${this.$menuManager.generate('sidebar')}
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