import UIElement, { EVENT } from "el/base/UIElement";
import { CLICK, LOAD, DEBOUNCE, DOMDIFF, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../../common/EditorElement";

const PROPERTY_TITLE = {
  'stroke-dasharray': 'Stroke Dash Array',
  'stroke-dashoffset': 'Stroke Dash Offset',
  'stroke-linejoin': 'Stroke Line Join',
}

const getPropertyTitle = (key, defaultTitle = '') => {
  return PROPERTY_TITLE[key] || defaultTitle || key; 
}

export default class TimelineObjectList extends EditorElement {


    [SUBSCRIBE('refreshCanvas', 'refreshSelection') + DEBOUNCE(1000)] () {
        this.refresh();
    }

    makeTimelineObjectRow (animation) {
        var project = this.$selection.currentProject;

        var obj =  project.searchById(animation.id)

        if (!obj) {
            return; 
        }

        var selected = this.$timeline.checkLayer(obj.id);
        var layer = project.searchById(obj.id)        

        return /*html*/`
        <div class='timeline-object' data-timeline-animation-id="${obj.id}">
            <div class='timeline-object-row layer' data-selected='${selected}' data-layer-id='${obj.id}' data-property=''>
                <div class='icon'>${icon.chevron_right}</div>
                <div class='title'> ${obj.name}</div>
                <div class='tools'>
                    <button type="button" class='remove-timeline' data-layer-id='${obj.id}'>${icon.remove}</button>
                    <button type="button" class='empty'></button>                    
                </div>
            </div>

            ${animation.properties.map(property => {
                var selected = this.$timeline.checkProperty(obj.id, property.property)

                return /*html*/ `
                <div class='timeline-object-row layer-property' data-selected='${selected}' data-layer-id='${obj.id}' data-property='${property.property}'>
                  <div class='icon'></div>                    
                    <div class='title'>${getPropertyTitle(property.property)}</div>
                    <div class='current-value'>
                      ${property.property === 'd' ? layer.totalLength : ''}
                      ${property.property === 'points' ? layer.totalLength : ''}
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

    template() {
        return /*html*/ `
            <div class='timeline-object-list'></div>
        `
    }
    
    [LOAD() + DOMDIFF] () {

        var project = this.$selection.currentProject;

        if (!project) return '';

        var selectedTimeline = project.getSelectedTimeline();

        if (!selectedTimeline) return ''; 

        return selectedTimeline.animations.map(animation => {
            return this.makeTimelineObjectRow(animation);
        })
    }

    refreshSelection () {
      this.$el.$$('[data-selected="true"]').forEach(it => {
        it.attr('data-selected', "false");
      })

      this.$timeline.each(it => {
        var $el = this.$el.$(`[data-layer-id="${it.layerId}"][data-property="${it.property}"]`)
        
        $el && $el.attr('data-selected', 'true')
      })
    }

    [CLICK('$el .timeline-object-row.layer .title')] (e) {
        var container = e.$dt.closest('timeline-object');
        
        container.toggleClass('collapsed')

        var layerId = e.$dt.closest('timeline-object-row').attr('data-layer-id')

        this.$timeline.selectLayer(layerId)
        this.$timeline.toggleLayerContainer(container.attr('data-timeline-animation-id'));

        this.refreshSelection();
        this.emit('toggleTimelineObjectRow', layerId, container.hasClass('collapsed'))        
    }

    [CLICK('$el .timeline-object-row.layer .add-property')] (e) {
        var $row = e.$dt.closest('timeline-object-row');
        var property = $row.$('.property-select').val()
        var layerId = e.$dt.attr('data-layer-id')


        if (property) {
            var current = this.$selection.current;

            this.emit('addTimelineProperty', {
              layerId, 
              property, 
              value: current[property]
            })
        }
    }

    [CLICK('$el .timeline-object-row.layer .remove-timeline')] (e) {
      var layerId = e.$dt.attr('data-layer-id')


      if (layerId) {
          this.emit('removeTimeline', layerId)
      }
  }

    [CLICK('$el .timeline-object-row.layer-property .add')] (e) {
      var layerId = e.$dt.attr('data-layer-id')
      var property = e.$dt.attr('data-property')

      if (property) {
        this.emit('copyTimelineProperty', layerId, property)
      }       
    }

    [CLICK('$el .timeline-object-row.layer-property .remove')] (e) {
      var layerId = e.$dt.attr('data-layer-id')
      var property = e.$dt.attr('data-property')

      if (property) {
        this.emit('removeTimelineProperty', layerId, property)
      }       
    }    

    [CLICK('$el .timeline-object-row.layer-property .title')] (e) {
      var [layerId, property] = e.$dt.closest('timeline-object-row').attrs('data-layer-id', 'data-property')

      this.$timeline.selectProperty(layerId, property)

      this.refreshSelection();

      this.emit('refreshTimeline')
    }

    [SUBSCRIBE('refreshTimeline')] () {
        this.refresh();
    }
}

registElement({ TimelineObjectList })