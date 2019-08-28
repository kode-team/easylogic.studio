import UIElement, { COMMAND, EVENT } from "../../../../util/UIElement";
import { editor } from "../../../../editor/editor";
import { DEBOUNCE } from "../../../../util/Event";
import { isArray, isUndefined } from "../../../../util/functions/func";
import { makeTimer, second, timecode } from "../../../../util/functions/time";

export default class TimelineCommand extends UIElement {

    [COMMAND('add.timeline')] (layerId) {
        this.currentArtboard((artboard, timeline) => {
            if (layerId) {
                artboard.addTimelineLayer(layerId);
            } else {
                artboard.addTimeline();                
            }
            this.emit('refreshTimeline');
            this.emit('addTimeline');
        })
    }

    [COMMAND('select.timeline')] (selectedId) {
        this.currentArtboard((artboard, timeline) => {
            artboard.selectTimeline(selectedId);                
            this.emit('refreshTimeline');
        })        
    }

    [COMMAND('set.timeline.offset') + DEBOUNCE(100)] (obj) {
        this.currentArtboard((artboard, timeline) => {
            artboard.setTimelineKeyframeOffsetValue(obj.layerId, obj.property, obj.id, obj.value, obj.timing, obj.time);
            this.emit('refreshTimeline');
        })
    }

    [COMMAND('refresh.selected.offset')] () {
        var offset = editor.timeline.items[0]
        if (offset) {
            this.emit('refreshOffsetValue', offset)
        }                    

    }

    [COMMAND('add.timeline.property')] (layerList, property, value, timing = 'linear') {
        this.currentArtboard((artboard, timeline) => {

            if (isArray(layerList) === false) {
                layerList = [layerList]
            }
    
            var list = [] 
            layerList.forEach(id => {
                var obj = artboard.addTimelineKeyframe(id, property, value + "", timing);

                if (obj) {
                    list.push(obj);
                }
            })

            editor.timeline.select(...list);

            this.emit('refreshTimeline');
            this.trigger('refresh.selected.offset');
        }) 
        
    }


    [COMMAND('add.timeline.current.property')] (property, timing = 'linear') {
        this.currentArtboard((artboard, timeline) => {
            var list = []
            editor.selection.each(item => {
                var obj = artboard.addTimelineKeyframe(item.id, property, item[property] + "", timing);

                if (obj) {
                    list.push(obj);
                }
            })

            editor.timeline.select(...list);            
            this.emit('refreshTimeline');
            this.trigger('refresh.selected.offset');
        })        
    }

    [COMMAND('delete.timeline.keyframe')] () {
        this.currentArtboard((artboard, timeline) => {
            editor.timeline.each(item => {
                artboard.deleteTimelineKeyframe(item.layerId, item.property, item.id);
            })

            editor.timeline.empty();
            this.emit('refreshTimeline')
            this.trigger('refresh.selected.offset');            
        })
    }

    [COMMAND('add.timeline.keyframe')] (layerId, property, time, timing = 'linear') {
        this.currentArtboard((artboard, timeline) => {
            var item = artboard.searchById(layerId);

            var obj = artboard.addTimelineKeyframe(item.id, property, item[property] + "", timing, time);
            editor.timeline.select(obj);            
            this.emit('refreshTimeline');
            this.trigger('refresh.selected.offset');
        })        
    }

    [COMMAND('change.timeline.offset')] () {
        this.currentArtboard((artboard, timeline) => {
            list.forEach(keyframe => {
                artboard.setTimelineKeyframeOffsetTime(keyframe.layerId, keyframe.property, keyframe.id, keyframe.time)
            })
            this.emit('refreshTimeline');
        })
    }

    [COMMAND('change.property')] (key, value) {
        this.currentArtboard((artboard, timeline) => {
            editor.selection.each(item => {
                var newValue = isUndefined(value) ? item[key] : value
                newValue = newValue + ""
                artboard.setTimelineKeyframeOffsetValue(item.id, key, undefined, newValue )
            })

            this.emit('refreshTimelineOffsetValue');
        })

    }

    [COMMAND('copy.timeline.property')] (layerId, property, newTime = null) {

        this.currentArtboard((artboard, timeline) => {
            artboard.copyTimelineKeyframe(layerId, property, newTime);
            
            this.emit('refreshTimeline');
        })
    }    

    [EVENT('moveTimeline')] () {
        this.trigger('pause.timeline');
    }

    [COMMAND('pause.timeline')] () {
        if (this.state.timer) {
            this.state.timer.stop();
        }
    }

    currentArtboard (callback) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            var timeline = artboard.getSelectedTimeline();

            callback && callback (artboard, timeline)            
        }
    }

    [COMMAND('last.timeline')] () {

        this.currentArtboard((artboard, timeline) => {
            var lastTime = artboard.getSelectedTimelineLastTime();

            artboard.setTimelineCurrentTime(timecode(timeline.fps, lastTime));
            artboard.seek();
            this.emit('playTimeline');
        })
    }

    [COMMAND('next.timeline')] () {

        this.currentArtboard((artboard, timeline) => {
            var nextTime = artboard.getSelectedTimelineNextTime();

            artboard.setTimelineCurrentTime(timecode(timeline.fps, nextTime));
            artboard.seek();
            this.emit('playTimeline');
        })
    }


    [COMMAND('first.timeline')] () {

        this.currentArtboard((artboard, timeline) => {
            var firstTime = artboard.getSelectedTimelineFirstTime();

            artboard.setTimelineCurrentTime(timecode(timeline.fps, firstTime));
            artboard.seek();
            this.emit('playTimeline');
        })
    }    


    [COMMAND('prev.timeline')] () {

        this.currentArtboard((artboard, timeline) => {
            var prevTime = artboard.getSelectedTimelinePrevTime();

            artboard.setTimelineCurrentTime(timecode(timeline.fps, prevTime));
            artboard.seek();

            this.emit('playTimeline');
        })
    }    

    [COMMAND('play.timeline')] (speed = 1, iterationCount = 1, direction = 'normal') {

        editor.selection.empty()
        this.emit('refreshSelection');


        this.currentArtboard((artboard, timeline) => {
          
            var lastTime = artboard.getSelectedTimelineLastTime();

            if (this.state.timer) {
                this.state.timer.stop()
            } else {
                this.state.timer = makeTimer({
                    elapsed: timeline.currentTime * 1000,
                    speed,
                    duration: lastTime * 1000,
                    iterationCount, 
                    direction
                })
            }

            this.state.timer.play({
                duration: lastTime * 1000,
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
        })
        
    }

}