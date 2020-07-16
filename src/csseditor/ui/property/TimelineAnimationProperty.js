import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DOUBLECLICK, FOCUSOUT, KEY, PREVENT, STOP, VDOM, KEYDOWN, DEBOUNCE, ENTER } from "../../../util/Event";
import icon from "../icon/icon";
import { EVENT } from "../../../util/UIElement";

export default class TimelineAnimationProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('timeline.animation.property.title');
  }

  getClassName() {
    return 'full'
  }

  getTools() {
    return /*html*/`
      <button type='button' ref='$add' title="Add an animation">${icon.add}</button>
    `
  }

  getBody() {
    return /*html*/`
      <div class="timeline-animation-list" ref="$timelineAnimationList"></div>
    `;
  }

  [LOAD("$timelineAnimationList") + VDOM]() {

    var project = this.$selection.currentProject;    
    if (!project) return ''

    return project.timeline.map( (timeline, index) => {
      var selected = timeline.selected ? 'selected' : ''
      return /*html*/`
        <div class='timeline-animation-item ${selected}'>
          <div class='preview icon'>
            ${icon.local_movie}
          </div>
          <div class='detail'>
            <label data-id='${timeline.id}'>${timeline.title}</label>
            <div class="tools">
              <button type="button" class="remove" data-id="${timeline.id}" title='Remove'>${icon.remove2}</button>
            </div>
          </div>
        </div>
      `
    })
  }


  [DOUBLECLICK('$timelineAnimationList .timeline-animation-item')] (e) {
    this.startInputEditing(e.$dt.$('label'))
  }

  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {
      var id = input.attr('data-id');

      var project = this.$selection.currentProject
      if (project) {
        project.setTimelineTitle(id, text);
      }
    });    
  }

  [KEYDOWN('$timelineAnimationList .timeline-animation-item label') + ENTER + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$dt);
  }

  [FOCUSOUT('$timelineAnimationList .timeline-animation-item label') + PREVENT  + STOP ] (e) {
    this.modifyDoneInputEditing(e.$dt);
  }

  [CLICK('$add')] (e) {
    this.emit('addTimelineItem');
  }

  [CLICK('$timelineAnimationList .timeline-animation-item .remove')] (e) {
    var id = e.$dt.attr('data-id');
    this.emit('removeAnimationItem', id);
    // this.refresh();
  }

  [CLICK('$timelineAnimationList .timeline-animation-item label')] (e) {
    var id = e.$dt.attr('data-id');

    var project = this.$selection.currentProject;

    if (project) {
      project.selectTimeline(id);                 

  
      var $item = e.$dt.closest('timeline-animation-item');
      $item.onlyOneClass('selected');

      this.emit('refreshTimeline');
      this.emit('selectTimeline');          
    }

  }

  [EVENT('addTimeline', 'removeTimeline', 'removeAnimation')] () {
    this.refresh();
  }
    
  [EVENT('refreshTimeline', 'refreshSelection', 'refreshArtboard') + DEBOUNCE(100)] () {
    this.refresh();
  }
}
