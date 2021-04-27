
import BaseProperty from "../property/BaseProperty";
import "./timeline/TimelineObjectList";
import "./timeline/TimelineKeyframeList";
import { DRAGOVER, DROP, PREVENT, DEBOUNCE, SCROLL, SUBSCRIBE } from "el/base/Event";
import "./timeline/TimelineTopToolbar";
import "./timeline/KeyframeTimeView";
import "./timeline/KeyframeTimeGridView";
import "./timeline/TimelineValueEditor";

import "./timeline/TimelinePlayControl";
import "../property/TimelineAnimationProperty";
import { registElement } from "el/base/registElement";

export default class TimelineProperty extends BaseProperty {

  isFirstShow() {
    return false;
  }

  getTitle() {
    return this.$i18n('timeline.property.title'); 
  } 

  getTools() {
    return /*html*/`
      <object refClass="TimelinePlayControl" />
      
    `; 
  }

  getClassName() {
    return 'timeline full managed-tool'
  }

  getBody() {
    return /*html*/`
      <div class='timeline-animation-area'>
        <object refClass="TimelineAnimationProperty" />
      </div>
      <div class='timeline-area'>
        <div class='timeline-header'>
          <div class='timeline-object-toolbar'>
            <object refClass="TimelineTopToolbar" />
          </div>
          <div class='timeline-keyframe-toolbar' ref='$keyframeToolBar'>
            <object refClass="KeyframeTimeView" ref='$keyframeTimeView' /> 
          </div>
        </div>
        <div class='timeline-body'>
          <div class='timeline-object-area' ref='$area'>
            <object refClass="TimelineObjectList" />
          </div>
          <div class='timeline-keyframe-area' ref='$keyframeArea'>
            <object refClass="TimelineKeyframeList" ref='$keyframeList' />          
          </div>
          <object refClass="KeyframeTimeGridView" ref='$keyframeTimeGridView' />            
        </div>
      </div>
      <div class='timeline-value-area'>
        <object refClass="TimelineValueEditor" ref='$valueEditor' onchange='changeKeyframeValue' />
      </div>
    `;
  }

  [SCROLL('$keyframeArea')] (e) {
      this.refs.$area.setScrollTop(this.refs.$keyframeArea.scrollTop())
  }  

  [SCROLL('$area')] (e) {
    this.refs.$keyframeArea.setScrollTop(this.refs.$area.scrollTop())
  }    

  [SUBSCRIBE('refreshValueEditor') + DEBOUNCE(100)] () {
    this.children.$valueEditor.refresh();
  }

  afterRender() {
    this.trigger('refreshValueEditor');
    
  }

  [SUBSCRIBE('changeKeyframeValue')] (obj) {
    this.emit('setTimelineOffset', obj);
  }

  [DRAGOVER('$area') + PREVENT] (e) { }
  [DROP('$area') + PREVENT] (e) {
    this.emit('addTimelineItem', e.dataTransfer.getData('layer/id'));
  }

  onToggleShow() {
    this.emit('toggleFooter', this.isPropertyShow())    
    this.emit('timeline.view', this.isPropertyShow())    
  }

}

registElement({ TimelineProperty })