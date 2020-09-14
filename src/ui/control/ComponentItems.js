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
            <SelectTool title='Select' />
            <AddArtboard title='Artboard' />            
          </div>
        </div>              
        <div class='group'>
        <label>${this.$i18n('component.items.layer')}</label>
          <div class='list'>
            <AddRect title='Rect' />
            <AddCircle title='Circle' />         
            <AddText title='Text' />
            <AddImage title='Image' />
            <AddVideo title='Video' />
          </div>
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.drawing')}</label>
          <div class='list'>            
            <!--<AddDrawBrush title='Brush' />-->
            <AddDrawPath title='Draw' />
            <AddPath title='Path' />
            <AddSVGRect title='Rect' />
            <AddSVGCircle title='Circle' />
            <!-- <AddSVGText title='Text' /> -->
            <AddSVGTextPath title='Text Path' />
          </div>          
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.custom')}</label>
          <div class='list'>            
            <AddCube title='Cube' />
            <AddCylinder title='Cylinder' />          
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
