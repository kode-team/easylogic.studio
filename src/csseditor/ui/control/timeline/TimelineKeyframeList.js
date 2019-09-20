import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK, LOAD, VDOM, DEBOUNCE, POINTERSTART, MOVE, IF, END, DOUBLECLICK, KEYUP, KEY, RESIZE, SCROLL } from "../../../../util/Event";
import { editor } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
import { OBJECT_TO_PROPERTY, OBJECT_TO_CLASS, isUndefined } from "../../../../util/functions/func";
import { timecode, second } from "../../../../util/functions/time";
import Dom from "../../../../util/Dom";

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

                var selected = editor.timeline.checked(it.id) && editor.timeline.checked(next.id)

                return /*html*/`<div ${OBJECT_TO_PROPERTY({
                    'data-selected': `${selected}`,
                    'class': {
                        'offset-line': true
                    }
                })} style='left: ${start}; width: ${width}'} ></div>`
            }).join('')}
        </div>
        <div class='keyframe'>

            ${list.map(it => {
                var selected = editor.timeline.checked(it.id);

                return /*html*/`<div class='${OBJECT_TO_CLASS({
                    'offset': true
                })}' style='left: ${it.left}' ${OBJECT_TO_PROPERTY({
                    'data-selected': `${selected}`,
                    'data-offset-id': it.id,
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
            <div class='timeline-keyframe-row layer'  ${OBJECT_TO_PROPERTY({
                'data-row-index': this.state.rowIndex++,
                "data-layer-id": obj.id 
            })} >
                <div class='keyframe-shadow'>
                ${times.map(time => {
                    var left = this.calculateTimeToPosition(time, timeline.displayStartTime, timeline.displayEndTime);
                    return /*html*/`<div class='offset' style='left: ${left}'></div>`
                }).join('')}
                </div>
            </div>

            ${animation.properties.map(property => {
                return /*html*/ `
                <div class='timeline-keyframe-row layer-property' ${OBJECT_TO_PROPERTY({
                    'data-row-index': this.state.rowIndex++,
                    "data-property": property.property,
                    "data-layer-id": obj.id 
                })} >
                    ${property.keyframes.length ? this.makeKeyframe(obj.id, timeline, property) : ''}
                </div>`
            }).join('')}                                                      
        </div>
        `        
    }

    template() {
        return /*html*/ `
            <div class='timeline-keyframe-container' tabIndex="-1">
                <div ref='$keyframeList' class='timeline-keyframe-list'></div>
                <div class='drag-area' ref='$dragArea'></div>
            </div>
        `
    }

    hasDragPlace (e) {
        var dom = Dom.create(e.target);
        return dom.hasClass('offset') === false &&
                dom.hasClass('offset-line') === false 
    }

    getRowIndex (index) {
        if (isUndefined(index)) {
            index = this.state.rowIndex;
        } else {
            index = +index;
        }

        return index;
    }

    [KEYUP('$el') + KEY('Backspace')] (e) {
        this.emit('delete.timeline.keyframe');
    }

    [POINTERSTART('$el') + IF('hasDragPlace') + MOVE('moveDragArea') + END('moveEndDragArea')] (e) {
        this.dragXY = this.getRealPosition(e)
        this.startRowIndex = this.getRowIndex(Dom.create(e.target).attr('data-row-index'))
        this.left = null;
        this.width = null;        
    }

    moveDragArea (dx, dy) {
        var left = dx < 0 ? Length.px(this.dragXY.x + dx) : Length.px(this.dragXY.x);
        var top = dy < 0 ? Length.px(this.dragXY.y + dy) : Length.px(this.dragXY.y);
        var width = Length.px(Math.abs(dx)) 
        var height = Length.px(Math.abs(dy))

        this.refs.$dragArea.css({ left, top,  width, height})

        this.left = left;
        this.width = width
    }

    getLayerList () {
        
        var rowIndex = this.getRowIndex(Dom.create(editor.config.get('bodyEvent').target).attr('data-row-index'))

        var startIndex = Math.min(rowIndex, this.startRowIndex);
        var endIndex = Math.max(rowIndex, this.startRowIndex);

        var arr = [] 
        for(var i = startIndex; i <= endIndex; i++) {
            arr.push(`[data-row-index="${i}"]`);
        }
        var list = this.refs.$keyframeList.$$(arr.join(',')).map(it => {
            var [layerId, property] = it.attrs('data-layer-id', 'data-property')
            return {layerId, property}
        });

        return list; 
    }

    getTime (start, end, rate) {
        return start + (end - start) * rate; 
    }

    moveEndDragArea (dx, dy) {
        if (!this.left) {

            if (this.doubleClicked) {
                this.doubleClicked = false; 
            } else {
                editor.timeline.empty()
                this.refresh();
            }
            return; 
        }

        this.refs.$dragArea.css({ left: null, top: null,  width: null, height: null})

        var width = this.$el.width();

        var startTime = this.getTimeRateByPosition((this.left.value) / width );
        var endTime = this.getTimeRateByPosition((this.left.value + this.width.value) / width);

        editor.timeline.selectBySearch(this.getLayerList(), startTime, endTime);
        this.refresh();

        this.startRowIndex = null; 
    }

    [LOAD('$keyframeList') + VDOM] () {

        var artboard = editor.selection.currentArtboard

        if (!artboard) return '';

        var selectedTimeline = artboard.getSelectedTimeline();

        if (!selectedTimeline) return ''; 

        var {width} = this.$el.rect();
        var totalWidth = width - PADDING; 
        var startX = PADDING/2; 
        this.rect = {
            totalWidth, startX
        }
        this.state.rowIndex = 0; 


        return selectedTimeline.animations.map(animation => {
            return this.makeTimelineKeyframeRow(selectedTimeline, animation);
        })
    }

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

    getRealPosition (e) {
        var rect = this.$el.rect()
        var pos = {
            x: e.xy.x - rect.left, 
            width: rect.width,
            y: e.xy.y - rect.top, 
            height: rect.height
        }

        var min = 10; 
        var max = pos.width - 10; 

        if(pos.x < min) {
            pos.x = min;
        } 
        
        if (pos.x > max) {
            pos.x = max; 
        }

        pos.rate = (pos.x - min) / (max - min);

        return pos;
    }

    getTimeRateByPosition (rate) {
        var selectedTimeline = this.currentTimeline;

        if (selectedTimeline) {
            var { displayStartTime, displayEndTime} = selectedTimeline;
            return this.getTime(displayStartTime, displayEndTime, rate);
        }

        return 0; 
    }

    [DOUBLECLICK('$el .timeline-keyframe-row.layer-property')] (e) {

        var [layerId, property] = e.$delegateTarget.attrs('data-layer-id', 'data-property')
        var time = this.getTimeRateByPosition(this.getRealPosition(e).rate);
        this.emit('add.timeline.keyframe', {layerId, property, time});

        this.refresh();
        this.doubleClicked = true; 
    }

    [POINTERSTART('$el .timeline-keyframe-row.layer-property .offset') 
        + IF('hasCurrentTimeline') 
        + MOVE('moveOffset') 
        + END('moveEndOffset')] (e) {

        this.$offset = e.$delegateTarget;

        var id = this.$offset.attr('data-offset-id');
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
            this.offset = currentArtboard.getTimelineKeyframeById(layerId, property, id);
            this.layerId = layerId;
            this.property = property;
            this.cachedOffsetTime = this.offset.time; 
        }
        this.timeline = this.currentTimeline;
        
        if (editor.timeline.checked(id)) {
            // NOOP , selection 변한 없음.
        } else {
            editor.timeline.select(this.offset)
        }

        this.cachedOffsetList = {}
        
        editor.timeline.cachedList().forEach(it => {
            this.cachedOffsetList[it.id] = it.time; 
        })

        this.emit('refreshOffsetValue', this.offset)

    }

    moveOffset (dx, dy) {

        var {displayStartTime, displayEndTime, fps} = this.timeline

        var sign = dx < 0 ? -1 : 1; 
        var dxRate = Math.abs(dx) / this.rect.totalWidth; 
        var dxTime = dxRate * (displayEndTime - displayStartTime) 

        editor.timeline.each(item => {
            var newOffsetTime = this.cachedOffsetList[item.id] + dxTime * sign 

            newOffsetTime = Math.max(newOffsetTime, displayStartTime);
            newOffsetTime = Math.min(newOffsetTime, displayEndTime);

            var code = timecode(fps, newOffsetTime);
            newOffsetTime = second(fps, code);

            item.time = newOffsetTime; 
        })

        this.refresh();        
        this.emit('refreshOffsetValue', this.offset)        
    }

    [EVENT('toggleTimelineObjectRow')] (id, isToggle) {
        this.$el.$(`.timeline-keyframe[data-timeline-layer-id="${id}"]`).toggleClass('collapsed', isToggle);
    }

    moveEndOffset () {
        var currentArtboard = editor.selection.currentArtboard;
        if (currentArtboard) {
            editor.timeline.each(item => {
                currentArtboard.sortTimelineKeyframe(item.layerId, item.property)
            })
            this.refresh();                        
        }
    }

    [EVENT('addTimeline', 'moveTimeline') + DEBOUNCE(100)] () {
        this.refresh();
    }

    [EVENT('refreshTimeline', 'toggleFooterEnd')] () {
        this.refresh();
    }

    [RESIZE('window') + DEBOUNCE(100)] () {
        this.refresh();
    }
}