
import UIElement from "@sapa/UIElement";
import "../menu-items";
import { CLICK } from "@sapa/Event";
import { registElement } from "@sapa/registerElement";
import { PluginManager } from "@manager/PluginManager";

export default class ComponentItems extends UIElement {

  template() {
    return /*html*/`
      <div class='component-items'>
        <!--<div class='group'>
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
            <object refClass="AddIFrame" title='IFrame' />            
          </div>
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.drawing')}</label>
          <div class='list'>            
            <object refClass="AddDrawPath" title='Draw' />
            <object refClass="AddPath" title='Path' />
            <object refClass="AddSVGRect" title='Rect' />
            <object refClass="AddSVGCircle" title='Circle' />
            <object refClass="AddSVGTextPath" title='Text Path' />
          </div>          
        </div> -->
        <div class='group'>
         <label>${this.$i18n('component.items.custom')}</label>
          <div class='list'>            
            <object refClass="AddCube" title='Cube' />
            <object refClass="AddCylinder" title='Cylinder' />          
          </div>          
        </div>          
        <div class='group'>
         <label>${this.$i18n('component.items.chart')}</label>
          <div class='list'>            
            <object refClass="AddAreaChart" title='AreaChart' />          
            <object refClass="AddLineChart" title='LineChart' />                        
          </div>          
        </div>
        <div class='group'>
         <label>${this.$i18n('component.items.plugin')}</label>
          <div class='list'>
            <object refClass="AddBarChart" title="BarChart" />
            <object refClass="AddSimplePlugin" title="Simple" />
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