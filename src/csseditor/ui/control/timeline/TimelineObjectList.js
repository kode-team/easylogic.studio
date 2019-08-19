import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK, LOAD, DEBOUNCE, VDOM } from "../../../../util/Event";
import icon from "../../icon/icon";
import { editor } from "../../../../editor/editor";

export default class TimelineObjectList extends UIElement {


    [EVENT('refreshCanvas', 'refreshSelection', 'refreshSelectionStyleView') + DEBOUNCE(1000)] () {
        this.refresh();
    }


    makePropertySelect() {
        return /*html*/`
          <select class='property-select'>
            <optgroup label='--'>
              <option value='var'>var</option>
            </optgroup>            
            <optgroup label='Motion'>
              <option value='offset-distance'>offset-distance</option>
            </optgroup>      
            <optgroup label='Size'>
              <option value='width'>width</option>
              <option value='height'>height</option>
            </optgroup>      
            <optgroup label='Box Model'>
              <option value='margin-left'>margin-left</option>
              <option value='margin-right'>margin-right</option>
              <option value='margin-bottom'>margin-bottom</option>
              <option value='margin-top'>margin-top</option>
              <option value='padding-left'>padding-left</option>
              <option value='padding-right'>padding-right</option>
              <option value='padding-bottom'>padding-bottom</option>
              <option value='padding-top'>padding-top</option>       
            </optgroup>
            <optgroup label='Border'>
              <option value='border'>border</option>
              <option value='border-top'>border-top</option>
              <option value='border-bottom'>border-bottom</option>
              <option value='border-left'>border-left</option>
              <option value='border-right'>border-right</option>
            </optgroup>
            <optgroup label='Border Radius'>
              <option value='border-radius'>border-radius</option>
            </optgroup>        
            <optgroup label='Style'>
              <option value='background-color'>background-color</option>
              <option value='background-image'>background-image</option>
              <option value='box-shadow'>box-shadow</option>
              <option value='text-shadow'>text-shadow</option>
              <option value='filter'>filter</option>      
              <option value='backdrop-filter'>backdrop-filter</option>          
            </optgroup>            
            <optgroup label='Transform'>
              <option value='transform'>transform</option>
              <option value='transform-origin'>transform-origin</option>
              <option value='perspective'>perspective</option>
              <option value='perspective-origin'>perspective-origin</option>
            </optgroup>
            <optgroup label='Font'>
              <option value='font-size'>font-size</option>
            </optgroup>
            <optgroup label='Animation'>
              <option value='animation-timing-function'>timing-function</option>
            </optgroup>        
          </select>
        `
      }

    makeTimelineObjectRow (animation) {
        var artboard = editor.selection.currentArtboard;

        var obj =  artboard.searchById(animation.id)

        if (!obj) {
            return; 
        }

        return /*html*/`
        <div class='timeline-object' data-timeline-animation-id="${obj.id}">
            <div class='timeline-object-row layer'>
                <div class='icon'>${icon.chevron_right}</div>
                <div class='title'> ${obj.name}</div>
                <div class='tools'>
                    ${this.makePropertySelect()}
                    <button type="button" class='add-property' data-layer-id="${obj.id}">${icon.add}</button>
                </div>
            </div>

            ${animation.properties.map(property => {
                return /*html*/ `
                <div class='timeline-object-row layer-property'>
                    <div class='icon'></div>                    
                    <div class='title'>${property.property}</div>
                    <div class='current-value'>
                    
                    </div>
                    <div class='tools'>
                        <button type="button" class='add' data-layer-id='${obj.id}' data-property='${property.property}'></button>
                    </div>
                </div>`
            }).join('')}                                                      
        </div>
        `
    }

    template() {
        return /*html*/ `
            <div class='timeline-object-list'></div>
        `
    }

    [LOAD() + VDOM] () {

        var artboard = editor.selection.currentArtboard || { timeline: [] }

        var selectedTimeline = artboard.getSelectedTimeline();

        if (!selectedTimeline) return ''; 

        return selectedTimeline.animations.map(animation => {
            return this.makeTimelineObjectRow(animation);
        })
    }

    [CLICK('$el .timeline-object-row.layer .title')] (e) {
        e.$delegateTarget.closest('timeline-object').toggleClass('collapsed')
    }

    [CLICK('$el .timeline-object-row.layer .add-property')] (e) {
        var $row = e.$delegateTarget.closest('timeline-object-row');
        var property = $row.$('.property-select').val()
        var layerId = e.$delegateTarget.attr('data-layer-id')


        if (property) {
            var current = editor.selection.current;

            this.emit('add.timeline.property', layerId, property, current[property])
        }
    }

    [CLICK('$el .timeline-object-row.layer-property .add')] (e) {
      var layerId = e.$delegateTarget.attr('data-layer-id')
      var property = e.$delegateTarget.attr('data-property')

      if (property) {
        this.emit('copy.timeline.property', layerId, property)
    }      
    }

    [EVENT('refreshTimeline')] () {
        this.refresh();
    }
}