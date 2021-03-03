import UIElement from "@core/UIElement";
import menuItems from "../menu-items";
import { CLICK } from "@core/Event";

export default class ComponentItems extends UIElement {

  components() {
    return menuItems
  }

  template() {
    return /*html*/`
      <div class='component-items'>
        <div class='group'>
          <label>${this.$i18n('component.items.canvas')}</label>
          <div class='list'>
            <span refclass="SelectTool" title='Select' />
            <span refclass="AddArtboard" title='Artboard' />            
          </div>
        </div>              
        <div class='group'>
        <label>${this.$i18n('component.items.layer')}</label>
          <div class='list'>
            <span refclass="AddRect" title='Rect' />
            <span refclass="AddCircle" title='Circle' />         
            <span refclass="AddText" title='Text' />
            <span refclass="AddImage" title='Image' />
            <span refclass="AddVideo" title='Video' />
          </div>
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.drawing')}</label>
          <div class='list'>            
            <!--<AddDrawBrush title='Brush' />-->
            <span refclass="AddDrawPath" title='Draw' />
            <span refclass="AddPath" title='Path' />
            <span refclass="AddSVGRect" title='Rect' />
            <span refclass="AddSVGCircle" title='Circle' />
            <!-- <AddSVGText title='Text' /> -->
            <span refclass="AddSVGTextPath" title='Text Path' />
          </div>          
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.custom')}</label>
          <div class='list'>            
            <span refClass="AddCube" title='Cube' />
            <span refClass="AddCylinder" title='Cylinder' />          
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
