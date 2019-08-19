
import BaseProperty from "../property/BaseProperty";
import TimelineObjectList from "./timeline/TimelineObjectList";
import TimelineKeyframeList from "./timeline/TimelineKeyframeList";
import { DRAGOVER, DROP, PREVENT, DEBOUNCE } from "../../../util/Event";
import TimelineTopToolbar from "./timeline/TimelineTopToolbar";
import KeyframeTimeView from "./timeline/KeyframeTimeView";
import KeyframeTimeGridView from "./timeline/KeyframeTimeGridView";
import AnimationSelector from "./timeline/AnimationSelector";
import TimelineValueEditor from "./timeline/TimelineValueEditor";
import { EVENT } from "../../../util/UIElement";

export default class TimelineProperty extends BaseProperty {

  components() {
    return {
      TimelineValueEditor,
      AnimationSelector,
      KeyframeTimeView,
      TimelineKeyframeList,
      TimelineObjectList,
      TimelineTopToolbar,
      KeyframeTimeGridView
    }
  }

  initState () {
    return {
      'timeline.keyframe.selectedId': null,
      'timeline.keyframe.selectedType': null,
    }
  }

  isFirstShow() {
    return true;
  }

  getTitle() {
    return 'Timeline'; 
  } 

  getTools() {
    return /*html*/`
      <AnimationSelector />
    `; 
  }

  getClassName() {
    return 'timeline full managed-tool'
  }

  getBody() {
    return /*html*/`
      <div class='timeline-area'>
        <div class='timeline-header'>
          <div class='timeline-object-toolbar'>
            <TimelineTopToolbar />
          </div>
          <div class='timeline-keyframe-toolbar' ref='$keyframeToolBar'>
            <KeyframeTimeView ref='$keyframeTimeView' /> 
          </div>
        </div>
        <div class='timeline-body'>
          <div class='timeline-object-area' ref='$area'>
            <TimelineObjectList />
          </div>
          <div class='timeline-keyframe-area' ref='$keyframeArea'>
            <TimelineKeyframeList ref='$keyframeList' />
            <KeyframeTimeGridView ref='$keyframeTimeGridView' />            
          </div>
        </div>
      </div>
      <div class='timeline-value-area'>
        <TimelineValueEditor ref='$valueEditor' onchange='changeKeyframeValue' />
      </div>
    `;
  }

  [EVENT('refreshValueEditor') + DEBOUNCE(100)] () {
    this.children.$valueEditor.refresh();
  }

  afterRender() {
    this.trigger('refreshValueEditor');
    
  }

  [EVENT('changeKeyframeValue')] (obj) {
    this.emit('set.timeline.offset', obj);
  }

  [DRAGOVER('$area') + PREVENT] (e) { }
  [DROP('$area') + PREVENT] (e) {
    this.emit('add.timeline', e.dataTransfer.getData('layer/id'));
  }
}
