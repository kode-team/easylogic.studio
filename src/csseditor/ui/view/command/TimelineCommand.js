import UIElement, { COMMAND } from "../../../../util/UIElement";
import { editor } from "../../../../editor/editor";
import { DEBOUNCE } from "../../../../util/Event";

export default class TimelineCommand extends UIElement {


    [COMMAND('add.timeline')] (layerId) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            if (layerId) {
                artboard.addTimelineLayer(layerId);
            } else {
                artboard.addTimeline();                
            }
            this.emit('refreshTimeline');
        }   
    }

    [COMMAND('select.timeline')] (selectedId) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            artboard.selectTimeline(selectedId);                
            this.emit('refreshTimeline');
        }   
    }


    [COMMAND('select.timeline.offset')] (selectedId, property, time) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            // artboard.sortTimelineKeyframe(selectedId, property); 
            artboard.setSelectedOffset(selectedId, property, time);

            this.trigger('refresh.selected.offset');
        }   
    }    

    [COMMAND('set.timeline.offset') + DEBOUNCE(100)] (obj) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            artboard.setSelectedTimelineKeyframe(obj);
        }
    }

    [COMMAND('refresh.selected.offset')] () {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            var offset = artboard.getSelectedPropertyOffset();
            if (offset) {
                this.emit('refreshOffsetValue', offset.property, offset.value, offset.timing)
            }            
        }        

    }

    [COMMAND('add.timeline.property')] (layerId, property, value, timing = 'linear') {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            artboard.addTimelineKeyframe(layerId, property, value, timing);
            this.emit('refreshTimeline');
            this.trigger('refresh.selected.offset');
        }
        
    }

    [COMMAND('copy.timeline.property')] (layerId, property) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {

            artboard.copyTimelineKeyframe(layerId, property);
            
            this.emit('refreshTimeline');
        }
        
    }    

}