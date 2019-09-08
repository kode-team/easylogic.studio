import { DomItem } from "./DomItem";
import { uuidShort } from "../../util/functions/math";
import { isUndefined, isNotUndefined, clone } from "../../util/functions/func";
import { second, timecode, framesToTimecode } from "../../util/functions/time";
import { createInterpolateFunction, createCurveFunction, createTimingFunction } from "../util/interpolate";

export class TimelineItem extends DomItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      timeline: [
        /*{ id: "xxx", 
          title: "xxxx", 
          currentTimecode: '00:00:00:00',
          totalTimecode: '00:00:10:00',
          currentTime: 0,
          totalTime: second(60, '00:00:10:00'),
          displayStartTime: second(60, '00:00:00:00'),
          displayEndTime: second(60, '00:00:10:00'),
          fps: 60,
          animations: [
          {id: 'xxxxx', properties: [
            {property: 'width', keyframes: [ {time: 10, value: Length.px(10), timing: 'linear'} ] },
            {property: 'height', keyframes: [ {time: 10, value: Length.px(10), timing: 'linear'} ] },
            {property: 'translateX', keyframes: [ {time: 10, value: Length.px(10), timing: 'linear'} ] },
            {property: 'rotateZ', keyframes: [ {time: 10, value: Length.px(10), timing: 'linear'} ] },
            {property: 'perspective', keyframes: [ {time: 10, value: Length.px(10), timing: 'linear'} ] },
            {property: 'width', keyframes: [ {time: 10, value: Length.px(10), timing: 'linear'} ] },
          ]}
        ]} */
      ],
      compiledTimeline: {},
      ...obj
    });
  }

  searchTimelineOffset (time) {
    var timeline = this.getSelectedTimeline();
    var filteredTimeline = [] 
    if (timeline) {

      timeline.animations.forEach(animation => {
        animation.properties.forEach(p => {
          var list = this.getCompiledTimingFunction(animation.id, p.property);

          filteredTimeline.push(list.find(keyframe => {
            return keyframe.startTime <= time && time < keyframe.endTime
          }))
        })
      })
    }

    return filteredTimeline.filter(it => it);
  }

  getCompiledTimingFunction (layerId, property) {
    return this.json.compiledTimeline[`${layerId}.${property}`];
  }

  compiledTimingFunction (layerId, property) {

    var p = this.getTimelineProperty(layerId, property);
    var layer = this.searchById(layerId);

    if (p.keyframes.length === 1) {
      this.json.compiledTimeline[`${layerId}.${property}`] = [] 
      return ;
    }

    this.json.compiledTimeline[`${layerId}.${property}`] = p.keyframes.map( (offset, index) => {

      var nextOffset = p.keyframes[index + 1];

      if (!nextOffset) {
        nextOffset = { time: offset.time + 1, value: offset.value + ''};
      }

      var it = {
        layer,
        property: p.property,
        startTime: offset.time,
        endTime: nextOffset.time, 
        startValue: offset.value,
        endValue: nextOffset.value,
        timing: offset.timing,
        interpolateFunction: createInterpolateFunction(layer, p.property, offset.value, nextOffset.value),
        timingFunction: createTimingFunction(offset.timing)
      }

      it.func = this.makeTimingFunction(it);      
  
      return it; 
    }).filter(it => it);
  }

  makeTimingFunction (it) {
    // 시작시간 끝 시간이 있음 . 그리고 현재 시간이 있음 
    return (time) => {
      var t = (time - it.startTime)/(it.endTime - it.startTime);
      return it.interpolateFunction(it.timingFunction(t), t, it.timingFunction);
    }
  }

  seek (frameOrCode, filterFunction = (it => it)) {

    var timeline = this.getSelectedTimeline();

    if (timeline) {

      if (isNotUndefined(frameOrCode)) {
        this.setTimelineCurrentTime(frameOrCode);
      }

      var time = timeline.currentTime;

      // console.log('-------------------------', time);

      this.searchTimelineOffset(time).filter(filterFunction).forEach(it => {

        if (it.property === 'offset-path') {

          // 객체 속성은 function 안에서 변경한다. 
          it.func(time)

        } else {
          it.layer.reset({
            [it.property]: it.func(time) 
          })
        }

      });

    }

  }

  getSelectedTimeline () {
    var timeline = this.json.timeline;

    var a = timeline.filter(it => it.selected);

    var selectedTimeline = a.length ? a[0] : timeline[0]

    return selectedTimeline || null;
  }

  getKeyframeListReturnArray() {
    var timeline = this.getSelectedTimeline();
    var keyframes = []     
    if (timeline) {

      timeline.animations.forEach(a => {
        a.properties.forEach(p => {
          keyframes.push(...p.keyframes);
        })
      })
    }

    return keyframes; 
  }

  getKeyframeList(callback) {
    var timeline = this.getSelectedTimeline(); 
    if (timeline) {

      timeline.animations.forEach(a => {
        a.properties.forEach(p => {
          p.keyframes.forEach(k => {
            callback && callback (timeline, k);
          })
        })
      })
    }
  }

  getSelectedTimelineLastTime () {
    var time = 0; 
    this.getKeyframeList((timeline, keyframe) => {
      time = Math.max(keyframe.time, time);
    })

    return time; 
  }

  getSelectedTimelineFirstTime () {

    var time = Number.MAX_SAFE_INTEGER; 
    this.getKeyframeList((timeline, keyframe) => {
      time = Math.min(keyframe.time, time);
    })

    return time; 
  }

  getSelectedTimelinePrevTime () {

    var time = this.getSelectedTimelineFirstTime(); 
    this.getKeyframeList((timeline, keyframe) => {
      if (timecode(timeline.fps, keyframe.time) < timeline.currentTimecode) {
        time = Math.max(keyframe.time, time);
      }      
    })

    return time; 
  }


  getSelectedTimelineNextTime () {
    var time = this.getSelectedTimelineLastTime(); 
    this.getKeyframeList((timeline, keyframe) => {

      if (timecode(timeline.fps, keyframe.time) > timeline.currentTimecode) {      
        time = Math.min(keyframe.time, time);
      }      
    })

    return time; 
  }

  selectTimeline (id) {
    this.json.timeline.forEach(it => {
      it.selected = it.id === id; 
    })
  }

  addTimeline (fps = 60, endTimecode = '00:00:10:00' ) {
    var id = uuidShort();
    var selectedTimeline = {
      id,
      title: 'sample', 
      ...this.getTimelineLayerInfo(fps, endTimecode),
      animations: [] 
    }
    this.json.timeline.push(selectedTimeline)

    this.selectTimeline(id);

    return selectedTimeline;
  }

  addTimelineLayer (layerId, fps = 60, endTimecode = '00:00:10:00' ) {
    var selectedTimeline = this.getSelectedTimeline();

    if (!selectedTimeline) {
      selectedTimeline = this.addTimeline(fps, endTimecode);
    }

    selectedTimeline.selected = true; 

    if (layerId) {
      var layer = selectedTimeline.animations.filter(it => it.id === layerId) 

      if (!layer[0]) {
        selectedTimeline.animations.push({
          id: layerId, properties: [] 
        })
      }
    }


  }

  getTimelineLayerInfo (fps = 60, endTimecode = '00:00:10:00') {

    var endTime = second(fps, endTimecode);

    return {
      fps,
      currentTimecode: timecode(fps, 0),
      totalTimecode: timecode(fps, endTime),
      currentTime: 0,
      totalTime: endTime,
      displayStartTime: 0,
      displayEndTime: endTime
    }

  }

  setTimelineCurrentTime (frameOrCode) {
    var timeline = this.getSelectedTimeline();
    var {fps, totalTimecode} = timeline

    if (timeline) {
      var frame = frameOrCode;
      var code = frameOrCode; 
  
      if ((+frame) + '' === frame) {
        frame = +frame; 
        code = framesToTimecode(fps, frame);
      }
  
      if (code > totalTimecode) {
          code = totalTimecode;
      }
  
      var currentTime = second(fps, code);

      timeline.currentTime = currentTime;
      timeline.currentTimecode = timecode(fps, currentTime);

    }
    
  }

  setDisplayTimeDxRate (dxRate, initStartTime, initEndTime) {

    var timeline = this.getSelectedTimeline();

    if (timeline) {

      var dxTime = dxRate * timeline.totalTime 

      var startTime = initStartTime + dxTime; 
      var endTime = initEndTime + dxTime; 
  
  
      startTime = Math.max(startTime, 0);
      startTime = Math.min(startTime, endTime);        
  
      if (startTime === 0) {
          endTime = initEndTime - initStartTime;
      }
  
      endTime = Math.max(endTime, startTime);                
      endTime = Math.min(endTime, timeline.totalTime);
  
      if (endTime === timeline.totalTime) {
          startTime = timeline.totalTime - (initEndTime - initStartTime);
      }
  
  
      timeline.displayStartTime = startTime;
      timeline.displayEndTime = endTime;
    }
     

  }

  setDisplayStartTimeRate (rate) {
    var timeline = this.getSelectedTimeline();

    if (timeline) {
      timeline.displayStartTime = rate * timeline.totalTime;
    }
  }

  setDisplayEndTimeRate (rate) {
    var timeline = this.getSelectedTimeline();

    if (timeline) {
      timeline.displayEndTime = rate * timeline.totalTime;
    }
  }  

  setTimelineCurrentTimeRate (rate) {
    var timeline = this.getSelectedTimeline();
    
    if (timeline) {
      var {displayStartTime, displayEndTime, fps} = timeline
      var currentTime = displayStartTime + (displayEndTime - displayStartTime) * rate

      this.setTimelineCurrentTime(timecode(fps, currentTime));
    }

  }  

  setTimelineTotalTime (frameOrCode) {
    var timeline = this.getSelectedTimeline();

    if (timeline) {
      var frame = frameOrCode;
      var code = frameOrCode; 
  
      if ((+frame) + '' === frame) {
        frame = +frame; 
        code = framesToTimecode(timeline.fps, frame);
      }
  
      if (second(timeline.fps, code) < timeline.displayEndTime) {
        timeline.displayEndTime = second(timeline.fps, code)
        timeline.displayStartTime = 0; 
      }

      timeline.totalTimecode = code; 
      timeline.totalTime = second(timeline.fps, code);

    }
    
  }  


  getTimelineObject (layerId) {
    var selectedTimeline = this.getSelectedTimeline();

    if (selectedTimeline) {
      return selectedTimeline.animations.find(it => it.id === layerId) ;
    }
  }

  addTimelineProperty (layerId, property) {
    this.addTimelineLayer(layerId);
    var timelineObject = this.getTimelineObject(layerId);

    if (timelineObject) {
      var p = timelineObject.properties.filter(it => it.property === property);

      if (!p.length) {
        timelineObject.properties.push({
          property, keyframes: [] 
        })
        this.compiledTimingFunction(layerId, property);                
      } 

    }
  }

  getTimelineProperty (layerId, property) {

    var timeline = this.getSelectedTimeline();

    if (timeline) {

      layerId = layerId || timeline.selectedLayerId
      property = property || timeline.selectedProperty

      var timelineObject = this.getTimelineObject(layerId);

      if (timelineObject) {
        return timelineObject.properties.find(it => it.property === property);
      }
    }


  }


  setSelectedOffset(layerId, property, time) {
    var timeline = this.getSelectedTimeline();

    if (timeline) {
      timeline.selectedLayerId = layerId;
      timeline.selectedProperty = property;
      timeline.selectedOffsetTime = time;

      var p = this.getTimelineProperty();
      p.keyframes.forEach(it => {
        it.selected = it.time === time; 
      })
    }

  }

  deleteTimelineKeyframe (layerId, property, offsetId) {
    var p = this.getTimelineProperty(layerId, property);

    if (p) {
      p.keyframes = p.keyframes.filter(it => it.id != offsetId);
    }
  }

  removeTimelineProperty (layerId, property) {
    var layer = this.getTimelineObject(layerId);

    if (layer) {
      layer.properties = layer.properties.filter(p => p.property != property);
    }
  }  

  removeTimeline (layerId) {
    var timeline = this.getSelectedTimeline();

    if (timeline) {
      timeline.animations = timeline.animations.filter(ani => ani.id != layerId);
    }
  }  

  setTimelineKeyframeOffsetTime (layerId, property, offsetId, changedTime) {
    var keyframe = this.getTimelineKeyframeById(layerId, property, offsetId)
    if (keyframe) {
      keyframe.time = changedTime;

      this.compiledTimingFunction(layerId, property);                   
    }
  }

  setTimelineKeyframeOffsetValue (layerId, property, offsetId, value = undefined, timing = undefined, time = undefined) {

    var keyframe = this.getTimelineKeyframeById(layerId, property, offsetId)
    if (keyframe) {
      if (isNotUndefined(time)) { keyframe.time = time; }
      if (isNotUndefined(value)) { keyframe.value = value; }
      if (isNotUndefined(timing)) { keyframe.timing = timing; }

      this.compiledTimingFunction(layerId, property);             
    }


  }  

  addTimelineKeyframe (layerId, property, value, timing = 'linear', newTime = null) {
    this.addTimelineProperty(layerId, property);
    var timeline = this.getSelectedTimeline();
    var p = this.getTimelineProperty(layerId, property);

    if (p) {
      var time = newTime || timeline.currentTime;

      var times = p.keyframes.filter(it => it.time === time); 

      if (!times.length) {
        value = (isUndefined(value) || value === '') ? this.getDefaultPropertyValue(property) : value;

        var obj = { id: uuidShort(), layerId, property, time, value, timing }
        p.keyframes.push(obj)

        p.keyframes.sort( (a, b) => {
          return a.time > b.time ? 1 : -1; 
        })

        this.compiledTimingFunction(layerId, property);        

        return obj;
      }
    }
  }

  getDefaultPropertyValue(property) {

    switch(property) {
    case 'mix-blend-mode': 
      return 'normal';
    case 'rotate': 
      return '0deg';
    case 'box-shadow':  
      return '0px 0px 0px 0px rgba(0, 0, 0, 1)';
    case 'text-shadow':  
      return '0px 0px 0px rgba(0, 0, 0, 1)';
    case 'opacity': 
      return 1; 
    // case 'background-color':
    // case 'color':
    // case 'text-fill-color':
    // case 'text-stroke-color':
    // case 'transform': 
    // case 'transform-origin':
    default: 
      return '';
    }

  }

  copyTimelineKeyframe (layerId, property, newTime = null) {
    var p = this.getTimelineProperty(layerId, property);

    if (p) {
      var timeline = this.getSelectedTimeline();
      var time = newTime || timeline.currentTime;

      var times = p.keyframes.filter(it => it.time < time); 
      var value = this.getDefaultPropertyValue(property);
      var timing = 'linear';
      if (times.length) {

        times.sort((a, b) => {
          return a.time > b.time ? -1 : 1; 
        })

        value = times[0].value + "";
        timing = times[0].timing + ""
      }

      this.addTimelineKeyframe(layerId, property, value, timing);

    }
  }

  getTimelineKeyframe (layerId, property, time) {
    var p = this.getTimelineProperty(layerId, property);

    if (p) {
      return p.keyframes.find(it => it.time === time); 
    }
  }

  getTimelineKeyframeById (layerId, property, id) {
    var p = this.getTimelineProperty(layerId, property);

    if (p) {
      return p.keyframes.find(it => it.id === id)
    }
  }    

  sortTimelineKeyframe (layerId, property) {
    var p = this.getTimelineProperty(layerId, property);

    if (p) {
      p.keyframes.sort((a, b) => {
        return a.time > b.time ? 1 : -1; 
      })
      this.compiledTimingFunction(layerId, property);      
    }
  }

  setFps (fps) {
    var timeline = this.getSelectedTimeline();

    if (timeline) {
        timeline.fps = fps; 

        timeline.currentTimecode = timecode(fps, timeline.currentTime);
        timeline.totalTimecode = timecode(fps, timeline.totalTime);
    }
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      timeline: clone(this.json.timeline)
    }
  }  

}
