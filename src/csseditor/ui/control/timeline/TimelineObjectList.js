import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK, LOAD, DEBOUNCE, VDOM, SCROLL } from "../../../../util/Event";
import icon from "../../icon/icon";
import { editor } from "../../../../editor/editor";

const PROPERTY_TITLE = {
  'stroke-dasharray': 'Stroke Dash Array',
  'stroke-dashoffset': 'Stroke Dash Offset',
  'stroke-linejoin': 'Stroke Line Join',
}

const getPropertyTitle = (key, defaultTitle = '') => {
  return PROPERTY_TITLE[key] || defaultTitle || key; 
}

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
          </select>
        `
      }

    makeTimelineObjectRow (animation) {
        var artboard = editor.selection.currentArtboard;

        var obj =  artboard.searchById(animation.id)

        if (!obj) {
            return; 
        }

        var selected = editor.timeline.checkLayer(obj.id);
        var layer = artboard.searchById(obj.id)        

        return /*html*/`
        <div class='timeline-object' data-timeline-animation-id="${obj.id}">
            <div class='timeline-object-row layer' data-selected='${selected}' data-layer-id='${obj.id}' data-property=''>
                <div class='icon'>${icon.chevron_right}</div>
                <div class='title'> ${obj.name}</div>
                <div class='tools'>
                    <!--${this.makePropertySelect()} -->
                    <button type="button" class='remove-timeline' data-layer-id='${obj.id}'>${icon.remove}</button>
                    <button type="button" class='empty'></button>                    
                </div>
            </div>

            ${animation.properties.map(property => {
                var selected = editor.timeline.checkProperty(obj.id, property.property)

                return /*html*/ `
                <div class='timeline-object-row layer-property' data-selected='${selected}' data-layer-id='${obj.id}' data-property='${property.property}'>
                <div class='icon'></div>                    
                    <div class='title'>${getPropertyTitle(property.property)}</div>
                    <div class='current-value'>
                      ${property.property === 'd' ? layer.totalLength : ''}
                      ${property.property === 'points' ? layer.totalLength : ''}
                      <!--<input type='text' data-property='${property.property}' data-layer-id="${obj.id}" value='' /> -->
                    </div>
                    <div class='tools'>
                        <button type="button" class='remove' data-layer-id='${obj.id}' data-property='${property.property}'>${icon.remove}</button>
                        <button type="button" class='add' data-layer-id='${obj.id}' data-property='${property.property}'></button>
                    </div>
                </div>`
            }).join('')}                                                      
        </div>
        `
    }


    // [EVENT('refreshOffsetValue')] (offset) {
    //   var input = this.$el.$(`input[data-property="${offset.property}"][data-layer-id="${offset.layerId}"]`)

    //   if (input) {
    //     input.val(offset.value);
    //   }
    // }

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

    refreshSelection () {
      this.$el.$$('[data-selected="true"]').forEach(it => {
        it.attr('data-selected', "false");
      })

      editor.timeline.each(it => {
        var $el = this.$el.$(`[data-layer-id="${it.layerId}"][data-property="${it.property}"]`)
        
        $el && $el.attr('data-selected', 'true')
      })
    }

    [CLICK('$el .timeline-object-row.layer .title')] (e) {
        var container = e.$delegateTarget.closest('timeline-object');
        
        container.toggleClass('collapsed')

        var layerId = e.$delegateTarget.closest('timeline-object-row').attr('data-layer-id')

        this.emit('toggleTimelineObjectRow', layerId, container.hasClass('collapsed'))

        editor.timeline.selectLayer(layerId)

        this.refreshSelection();
    }

    [CLICK('$el .timeline-object-row.layer .add-property')] (e) {
        var $row = e.$delegateTarget.closest('timeline-object-row');
        var property = $row.$('.property-select').val()
        var layerId = e.$delegateTarget.attr('data-layer-id')


        if (property) {
            var current = editor.selection.current;

            this.emit('add.timeline.property', {layerId, property, value: current[property]})
        }
    }

    [CLICK('$el .timeline-object-row.layer .remove-timeline')] (e) {
      var layerId = e.$delegateTarget.attr('data-layer-id')


      if (layerId) {
          this.emit('remove.timeline', layerId)
      }
  }

    [CLICK('$el .timeline-object-row.layer-property .add')] (e) {
      var layerId = e.$delegateTarget.attr('data-layer-id')
      var property = e.$delegateTarget.attr('data-property')

      if (property) {
        this.emit('copy.timeline.property', layerId, property)
      }       
    }

    [CLICK('$el .timeline-object-row.layer-property .remove')] (e) {
      var layerId = e.$delegateTarget.attr('data-layer-id')
      var property = e.$delegateTarget.attr('data-property')

      if (property) {
        this.emit('remove.timeline.property', layerId, property)
      }       
    }    

    [CLICK('$el .timeline-object-row.layer-property .title')] (e) {
      var [layerId, property] = e.$delegateTarget.closest('timeline-object-row').attrs('data-layer-id', 'data-property')

      editor.timeline.selectProperty(layerId, property)

      this.refreshSelection();

      this.emit('refreshTimeline')
    }

    [EVENT('refreshTimeline')] () {
        this.refresh();
    }
}