import UIElement from "../../../util/UIElement";
import menuItems from "../menu-items";
import { editor } from "../../../editor/editor";
import { CLICK } from "../../../util/Event";

const i18n = editor.initI18n('component.items');

export default class ComponentItems extends UIElement {

  components() {
    return menuItems
  }

  template() {
    return /*html*/`
      <div class='component-items'>
        <div class='group'>
          <label>${i18n('canvas')}</label>
          <div class='list'>
            <SelectTool title='Select' />
            <AddArtboard title='Artboard' />            
          </div>
        </div>              
        <div class='group'>
        <label>${i18n('layer')}</label>
          <div class='list'>
            <AddRect title='Rect' />
            <AddCircle title='Circle' />         
            <AddText title='Text' />
            <AddImage title='Image' />
          </div>
        </div>
        <div class='group'>
        <label>${i18n('3dlayer')}</label>
          <div class='list'>            
            <AddCube title='Cube' />
            <AddCylinder title='Cylinder' />
          </div>
        </div>
        <div class='group'>
        <label>${i18n('drawing')}</label>
          <div class='list'>            
            <AddPath title='Path' />
            <AddSVGRect title='Rect' />
            <AddSVGCircle title='Circle' />
            <AddSVGText title='Text' />
            <AddSVGTextPath title='Text Path' />
            <AddPolygon title='Polygon' />
            <AddStar title='Star' />
          </div>          
        </div>        
      </div>
    `;
  }


  [CLICK('$el button')] (e) {

    var selected = this.refs.$el.$('.selected');
    if (selected) selected.removeClass('selected');

    e.$delegateTarget.addClass('selected');        
  }  

}
