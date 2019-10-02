import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DOUBLECLICK, FOCUSOUT, KEY, PREVENT, STOP, VDOM, KEYDOWN, DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import icon from "../icon/icon";
import { EVENT } from "../../../util/UIElement";

export default class TimelineAnimationProperty extends BaseProperty {
  getTitle() {
    return "Animations";
  }

  getClassName() {
    return 'full'
  }

  getTools() {
    return `
      <button type='button' ref='$add' title="Add an animation">${icon.add}</button>
    `
  }

  getBody() {
    return `
      <div class="timeline-animation-list" ref="$timelineAnimationList"></div>
    `;
  }

  [LOAD("$timelineAnimationList") + VDOM]() {

    var artboard = editor.selection.currentArtboard;    
    if (!artboard) return ''

    return artboard.timeline.map( (timeline, index) => {
      var selected = timeline.selected ? 'selected' : ''
      return /*html*/`
        <div class='timeline-animation-item ${selected}'>
          <div class='preview'></div>
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
    this.startInputEditing(e.$delegateTarget.$('label'))
  }

  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {
      var id = input.attr('data-id');

      var artboard = editor.selection.currentArtboard
      if (artboard) {
        artboard.setTimelineTitle(id, text);
      }
    });    
  }

  [KEYDOWN('$timelineAnimationList .timeline-animation-item label') + KEY('Enter') + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
  }

  [FOCUSOUT('$timelineAnimationList .timeline-animation-item label') + PREVENT  + STOP ] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
  }

  [CLICK('$add')] (e) {
    this.emit('add.timeline');
  }

  [CLICK('$timelineAnimationList .timeline-animation-item .remove')] (e) {
    var id = e.$delegateTarget.attr('data-id');
    this.emit('remove.animation', id);
    // this.refresh();
  }

  [CLICK('$timelineAnimationList .timeline-animation-item label')] (e) {
    var id = e.$delegateTarget.attr('data-id');

    var artboard = editor.selection.currentArtboard;

    if (artboard) {
      artboard.selectTimeline(id);                 

  
      var $item = e.$delegateTarget.closest('timeline-animation-item');
      $item.onlyOneClass('selected');

      this.emit('refreshTimeline');
      this.emit('selectTimeline');          
    }

  }

  [EVENT('addTimeline', 'removeTimeline', 'removeAnimation')] () {
    this.refresh();
  }
    
  [EVENT('refreshTimeline', 'refreshSelection', 'refreshAllSelectArtBoard') + DEBOUNCE(100)] () {
    this.refresh();
  }
}
