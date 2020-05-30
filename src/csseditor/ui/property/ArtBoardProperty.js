import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DOUBLECLICK, FOCUSOUT, PREVENT, STOP, VDOM, KEYDOWN, ENTER } from "../../../util/Event";
import icon from "../icon/icon";
import { EVENT } from "../../../util/UIElement";

export default class ArtBoardProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('artboard.property.title');
  }

  getClassName() {
    return 'full'
  }

  getTools() {
    return /*html*/`
      <button type='button' ref='$add' title="Add a artboard">${icon.add}</button>
    `
  }

  getBody() {
    return /*html*/`
      <div class="artboard-list scrollbar" ref="$artboardList"></div>
    `;
  }

  [LOAD("$artboardList") + VDOM]() {

    var project = this.$selection.currentProject;    
    if (!project) return ''

    return project.artboards.map( (artboard, index) => {
      var selected = artboard === this.$selection.currentArtboard ? 'selected' : ''
      var title = ''; 

      if (artboard.hasLayout()) {
        title = this.$i18n('artboard.property.layout.title.' + artboard.layout)
      }

      return /*html*/`
        <div class='artboard-item ${selected}' data-layout="${artboard.layout}" data-artboard-id='${artboard.id}'>
          <div class='preview icon'>${icon.doc}</div>
          <div class='detail'>
            <label data-index='${index}' data-layout-title='${title}' >${artboard.name}</label>
            <div class="tools">
              <button type="button" class="remove" data-index="${index}" title='Remove'>${icon.remove2}</button>
            </div>
          </div>
        </div>
      `
    })
  }


  [DOUBLECLICK('$artboardList .artboard-item')] (e) {
    this.startInputEditing(e.$dt.$('label'))
  }

  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {

      var project = this.$selection.currentProject
      if (project) {
        var artboard = project.artboards[index]
  
        if (artboard) {
          artboard.reset({
            name: text
          })
          this.emit('refreshArtBoardName', artboard.id, text);
        }
      }
    });    
  }

  [KEYDOWN('$artboardList .artboard-item label') + ENTER + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$dt);
  }

  [FOCUSOUT('$artboardList .artboard-item label') + PREVENT  + STOP ] (e) {
    this.modifyDoneInputEditing(e.$dt);
  }


  [CLICK('$add')] (e) {
    this.emit('addArtBoard');
  }

  [CLICK('$artboardList .artboard-item .remove')] (e) {
    var project = this.$selection.currentProject
    if (project) {
      var index = +e.$dt.attr('data-index')

      project.artboards.splice(index);

      var artboard = project.artboards[index] || project.artboards[index - 1];

      this.emit('selectArtboard', artboard);
    }
  }

  [CLICK('$artboardList .artboard-item label')] (e) {
    var project = this.$selection.currentProject
    if (project) {
      var $item = e.$dt.closest('artboard-item');
      $item.onlyOneClass('selected');

      var index = +e.$dt.attr('data-index')

      var artboard = project.artboards[index]

      this.emit('selectArtboard', artboard);
    }
  }

  [EVENT('refreshArtBoardList')] () {
    this.refresh();
  }

  [EVENT('changeItemLayout')] () {
    this.refresh();
  }

}
