
import BaseProperty from "../property/BaseProperty";
import TimelineObjectList from "./timeline/TimelineObjectList";
import TimelineKeyframeList from "./timeline/TimelineKeyframeList";
import { DRAGOVER, DROP, PREVENT, DEBOUNCE, SCROLL } from "@core/Event";
import TimelineTopToolbar from "./timeline/TimelineTopToolbar";
import KeyframeTimeView from "./timeline/KeyframeTimeView";
import KeyframeTimeGridView from "./timeline/KeyframeTimeGridView";
import TimelineValueEditor from "./timeline/TimelineValueEditor";
import { EVENT } from "@core/UIElement";
import TimelinePlayControl from "./timeline/TimelinePlayControl";
import TimelineAnimationProperty from "../property/TimelineAnimationProperty";

export default class TimelineProperty extends BaseProperty {

  components() {
    return {
      TimelineAnimationProperty,
      TimelinePlayControl,
      TimelineValueEditor,
      KeyframeTimeView,
      TimelineKeyframeList,
      TimelineObjectList,
      TimelineTopToolbar,
      KeyframeTimeGridView
    }
  }

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

  [EVENT('refreshValueEditor') + DEBOUNCE(100)] () {
    this.children.$valueEditor.refresh();
  }

  afterRender() {
    this.trigger('refreshValueEditor');
    
  }

  [EVENT('changeKeyframeValue')] (obj) {
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
