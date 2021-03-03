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
            <object refClass="SelectTool" title='Select' />
            <object refClass="AddArtboard" title='Artboard' />            
          </div>
        </div>              
        <div class='group'>
        <label>${this.$i18n('component.items.layer')}</label>
          <div class='list'>
            <object refClass="AddRect" title='Rect' />
            <object refClass="AddCircle" title='Circle' />         
            <object refClass="AddText" title='Text' />
            <object refClass="AddImage" title='Image' />
            <object refClass="AddVideo" title='Video' />
          </div>
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.drawing')}</label>
          <div class='list'>            
            <!--<AddDrawBrush title='Brush' />-->
            <object refClass="AddDrawPath" title='Draw' />
            <object refClass="AddPath" title='Path' />
            <object refClass="AddSVGRect" title='Rect' />
            <object refClass="AddSVGCircle" title='Circle' />
            <!-- <AddSVGText title='Text' /> -->
            <object refClass="AddSVGTextPath" title='Text Path' />
          </div>          
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.custom')}</label>
          <div class='list'>            
            <object refClass="AddCube" title='Cube' />
            <object refClass="AddCylinder" title='Cylinder' />          
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
