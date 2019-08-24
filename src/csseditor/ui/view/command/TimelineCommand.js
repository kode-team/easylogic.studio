import UIElement, { COMMAND, EVENT } from "../../../../util/UIElement";
import { editor } from "../../../../editor/editor";
import { DEBOUNCE } from "../../../../util/Event";
import { isArray, isUndefined } from "../../../../util/functions/func";
import { makeTimer, second, timecode } from "../../../../util/functions/time";

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
            this.emit('addTimeline');
        }   
    }

    [COMMAND('select.timeline')] (selectedId) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            artboard.selectTimeline(selectedId);                
            this.emit('refreshTimeline');
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

    [COMMAND('add.timeline.property')] (layerList, property, value, timing = 'linear') {

        if (isArray(layerList) === false) {
            layerList = [layerList]
        }

        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            var list = [] 
            layerList.forEach(id => {
                var obj = artboard.addTimelineKeyframe(id, property, value + "", timing);

                if (obj) {
                    list.push({id: obj.id, layerId: obj.layerId, property: obj.property});
                }
            })

            editor.timeline.select(...list);

            this.emit('refreshTimeline');
            this.trigger('refresh.selected.offset');
        }
        
    }


    [COMMAND('add.timeline.current.property')] (property, timing = 'linear') {
        var artboard = editor.selection.currentArtboard;
        if (artboard) {
            var list = []
            editor.selection.each(item => {
                var obj = artboard.addTimelineKeyframe(item.id, property, item[property] + "", timing);

                if (obj) {
                    list.push({id: obj.id, layerId: obj.layerId, property: obj.property});
                }
            })

            editor.timeline.select(...list);            
            this.emit('refreshTimeline');
            this.trigger('refresh.selected.offset');
        }

    }

    [COMMAND('change.property')] (key, value) {


        var artboard = editor.selection.currentArtboard;
        if (artboard) {
            editor.selection.each(item => {
                var newValue = isUndefined(value) ? item[key] : value
                newValue = newValue + ""

                artboard.setPropertyOffsetValue(item.id, key, undefined, newValue )
            })

            this.emit('refreshTimelineOffsetValue');
        }

    }

    [COMMAND('copy.timeline.property')] (layerId, property) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {

            artboard.copyTimelineKeyframe(layerId, property);
            
            this.emit('refreshTimeline');
        }
        
    }    

    [EVENT('moveTimeline')] () {
        this.trigger('pause.timeline');
    }

    [COMMAND('pause.timeline')] () {
        if (this.state.timer) {
            this.state.timer.stop();
        }
    }

    [COMMAND('play.timeline')] (speed = 1, iterationCount = 1, direction = 'normal') {

        editor.selection.empty()
        this.emit('refreshSelection');

        var artboard = editor.selection.currentArtboard;

        if (artboard) {

            var timeline = artboard.getSelectedTimeline();

            if(timeline) {

                if (this.state.timer) {
                    this.state.timer.stop()
                } else {
                    this.state.timer = makeTimer({
                        elapsed: timeline.currentTime * 1000,
                        speed,
                        duration: timeline.totalTime * 1000,
                        iterationCount, 
                        direction
                    })
                }

                this.state.timer.play({
                    duration: timeline.totalTime * 1000,
                    elapsed: timeline.currentTime * 1000,
                    speed,
                    iterationCount,
                    direction,
                    tick: (elapsed, timer) => {
                        // console.log(timecode(timeline.fps, elapsed / 1000));
                        artboard.seek(timecode(timeline.fps, elapsed / 1000))
                        this.emit('playTimeline');
                    },
                    last: (elapsed, timer) => {                 
                        this.emit('stopTimeline');
                        artboard.setTimelineCurrentTime(0);
                    }
                })                
    
            }

        }


        
    }

}