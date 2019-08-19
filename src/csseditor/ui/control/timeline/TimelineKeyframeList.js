import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK, LOAD, VDOM, DEBOUNCE, POINTERSTART, MOVE, IF, END } from "../../../../util/Event";
import { editor } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
import { OBJECT_TO_PROPERTY, OBJECT_TO_CLASS } from "../../../../util/functions/func";
import { timecode, second } from "../../../../util/functions/time";

const PADDING = 20 

export default class TimelineKeyframeList extends UIElement {

    config (key) {
        return this.parent.state[key];
    }

    calculateTimeToPosition (offsetTime, startTime, endTime) {
        
        var rate =  (offsetTime - startTime) / (endTime - startTime);

        return Length.px(this.rect.totalWidth * rate + PADDING/2);
    }



    makeKeyframe (layerId, timeline, property) {

        var list = property.keyframes.filter(offset => {
            return timeline.displayStartTime <= offset.time && offset.time <= timeline.displayEndTime
        }).map((offset, index) => {
            var left = this.calculateTimeToPosition(offset.time, timeline.displayStartTime, timeline.displayEndTime);

            return { left, ...offset, index}
        })


        return /*html*/`
        <div class='keyframe-back'${OBJECT_TO_PROPERTY({
            'data-layer-id': layerId,
            'data-property': property.property
        })}>

            ${list.map((it, index) => {

                var next = list[index+1];

                if (!next) return '';

                var start = Length.px(it.left.value); 
                var width = Length.px(next.left.value - it.left.value);

                return /*html*/`<div class='${OBJECT_TO_CLASS({
                    'offset-line': true
                })}' style='left: ${start}; width: ${width}'} ></div>`
            }).join('')}
        </div>
        <div class='keyframe'>

            ${list.map(it => {
                return /*html*/`<div class='${OBJECT_TO_CLASS({
                    'offset': true,
                    selected: it.selected
                })}' style='left: ${it.left}' ${OBJECT_TO_PROPERTY({
                    'data-layer-id': layerId,
                    'data-property': property.property,
                    'data-offset-index': it.index
                })} ></div>`
            }).join('')}
        </div>`
    }

    makeTimelineKeyframeRow (timeline, animation) {

        var artboard = editor.selection.currentArtboard;

        var obj =  artboard.searchById(animation.id)

        if (!obj) {
            return; 
        }

        var key = {} 
        animation.properties.map(property => property.keyframes.map(it => it.time)).forEach(it => {
            it.forEach(a => key[a] = true )
        })

        var times = Object.keys(key).map(it => +it);


        return /*html*/`
        <div class='timeline-keyframe' data-timeline-layer-id="${obj.id}">
            <div class='timeline-keyframe-row layer'>
                ${times.map(time => {
                    var left = this.calculateTimeToPosition(time, timeline.displayStartTime, timeline.displayEndTime);
                    return /*html*/`<div class='offset' style='left: ${left}'></div>`
                }).join('')}
            </div>

            ${animation.properties.map(property => {
                return /*html*/ `
                <div class='timeline-keyframe-row layer-property'>
                    ${property.keyframes.length ? this.makeKeyframe(obj.id, timeline, property) : ''}
                </div>`
            }).join('')}                                                      
        </div>
        `        
    }

    template() {
        return /*html*/ `<div class='timeline-keyframe-list'></div>`
    }

    [LOAD() + VDOM] () {

        var artboard = editor.selection.currentArtboard || { timeline: [] }

        var selectedTimeline = artboard.getSelectedTimeline();

        if (!selectedTimeline) return ''; 

        var {width} = this.$el.rect();
        var totalWidth = width - PADDING; 
        var startX = PADDING/2; 
        this.rect = {
            totalWidth, startX
        }


        return selectedTimeline.animations.map(animation => {
            return this.makeTimelineKeyframeRow(selectedTimeline, animation);
        })
    }

    // 처음과 끝 포인트는 시작시간과 endTime  을 설정하는 도구가 된다. 

    [CLICK('$el .timeline-keyframe-row.layer .title')] (e) {
        e.$delegateTarget.closest('timeline-keyframe').toggleClass('collapsed')
    }


    get currentTimeline () {
        var currentArtboard = editor.selection.currentArtboard;
    
        if (currentArtboard) {
            return currentArtboard.getSelectedTimeline();
        }
    }    


    hasCurrentTimeline() {
        return !!this.currentTimeline;
    }


    [POINTERSTART('$el .timeline-keyframe-row.layer-property .offset') 
        + IF('hasCurrentTimeline') 
        + MOVE('moveOffset') 
        + END('moveEndOffset')] (e) {
        this.$offset = e.$delegateTarget;
        var index = +this.$offset.attr('data-offset-index');
        var property = this.$offset.attr('data-property')
        var layerId = this.$offset.attr('data-layer-id');

        this.$keyframeBack = this.$offset.closest('timeline-keyframe-row').$('.keyframe-back');

        var {width} = this.$el.rect();
        var totalWidth = width - PADDING; 
        var startX = PADDING/2; 
        this.rect = {
            totalWidth, startX
        }

        var currentArtboard = editor.selection.currentArtboard;
        if (currentArtboard) {
            this.offset = currentArtboard.getTimelineKeyframeByIndex(layerId, property, index);
            this.layerId = layerId;
            this.property = property;
            this.cachedOffsetTime = this.offset.time; 
        }
        this.timeline = this.currentTimeline;

        this.$el.$$('.selected').forEach(it => {
            var index = +it.attr('data-offset-index');
            var property = it.attr('data-property')
            var layerId = it.attr('data-layer-id');

            var selectedOffset = currentArtboard.getTimelineKeyframeByIndex(layerId, property, index);
            selectedOffset.selected = false; 

            it.removeClass('selected');
        })
        this.$offset.addClass('selected');
        this.offset.selected = true; 

        this.emit('select.timeline.offset', this.layerId, this.property, this.offset.time);

        editor.selection.selectById(this.layerId);
        
    }

    moveOffset (dx, dy) {

        var {displayStartTime, displayEndTime, fps} = this.timeline

        var sign = dx < 0 ? -1 : 1; 
        var dxRate = Math.abs(dx) / this.rect.totalWidth; 
        var dxTime = dxRate * (displayEndTime - displayStartTime) 

        var newOffsetTime = this.cachedOffsetTime + dxTime * sign; 

        newOffsetTime = Math.max(newOffsetTime, displayStartTime);
        newOffsetTime = Math.min(newOffsetTime, displayEndTime);

        var code = timecode(fps, newOffsetTime);
        newOffsetTime = second(fps, code);

        this.offset.time = newOffsetTime;

        var left = this.calculateTimeToPosition(newOffsetTime, displayStartTime, displayEndTime);

        this.$offset.css('left', left);

        this.refreshOffsetLine();

        this.emit('refreshSelection');
    }

    refreshOffsetLine() {
        var artboard = editor.selection.currentArtboard;


        var property = artboard.getTimelineProperty(this.layerId, this.property)
        var timeline = artboard.getSelectedTimeline();
        artboard.sortTimelineKeyframe(this.layerId, this.property);
        if (property) {
            var list = property.keyframes.filter(offset => {
                return timeline.displayStartTime <= offset.time && offset.time <= timeline.displayEndTime
            }).map((offset, index) => {
                var left = this.calculateTimeToPosition(offset.time, timeline.displayStartTime, timeline.displayEndTime);
    
                return { left, ...offset, index}
            })
    
            this.$keyframeBack.html(`${list.map((it, index) => {
    
                var next = list[index+1];
    
                if (!next) return '';
    
                var start = Length.px(it.left.value); 
                var width = Length.px(next.left.value - it.left.value);
    
                return /*html*/`<div class='${OBJECT_TO_CLASS({
                    'offset-line': true
                })}' style='left: ${start}; width: ${width}'} ></div>`
            }).join('')}`)
        }


    }


    moveEndOffset () {
        var currentArtboard = editor.selection.currentArtboard;
        if (currentArtboard) {
            currentArtboard.sortTimelineKeyframe(this.layerId, this.property)
            currentArtboard.setSelectedOffset(this.layerId, this.property, this.offset.time);  
            this.refresh();
            this.emit('refreshSelectionTool')                         
        }
    }

    [EVENT('resizeTimeline', 'addTimeline', 'moveTimeline') + DEBOUNCE(100)] () {
        this.refresh();
    }

    [EVENT('refreshTimeline')] () {
        this.refresh();
    }
}