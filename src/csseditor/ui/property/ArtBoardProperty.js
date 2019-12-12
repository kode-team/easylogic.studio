import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DOUBLECLICK, FOCUSOUT, KEY, PREVENT, STOP, VDOM, KEYDOWN } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import icon from "../icon/icon";
import { EVENT } from "../../../util/UIElement";

export default class ArtBoardProperty extends BaseProperty {
  getTitle() {
    return editor.i18n('artboard.property.title');
  }

  getClassName() {
    return 'full'
  }

  getTools() {
    return `
      <button type='button' ref='$add' title="Add a artboard">${icon.add}</button>
    `
  }

  getBody() {
    return /*html*/`
      <div class="artboard-list scrollbar" ref="$artboardList"></div>
    `;
  }

  [LOAD("$artboardList") + VDOM]() {

    var project = editor.selection.currentProject;    
    if (!project) return ''

    return project.artboards.map( (artboard, index) => {
      var selected = artboard === editor.selection.currentArtboard ? 'selected' : ''

      return /*html*/`
        <div class='artboard-item ${selected}' data-layout="${artboard.layout}" data-artboard-id='${artboard.id}'>
          <div class='preview'>${icon.doc}</div>
          <div class='detail'>
            <label data-index='${index}'>${artboard.name}</label>
            <div class="tools">
              <button type="button" class="remove" data-index="${index}" title='Remove'>${icon.remove2}</button>
            </div>
          </div>
        </div>
      `
    })
  }


  [DOUBLECLICK('$artboardList .artboard-item')] (e) {
    this.startInputEditing(e.$delegateTarget.$('label'))
  }

  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {

      var project = editor.selection.currentProject
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

  [KEYDOWN('$artboardList .artboard-item label') + KEY('Enter') + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
  }

  [FOCUSOUT('$artboardList .artboard-item label') + PREVENT  + STOP ] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
  }

  selectArtboard(artboard) {

    if (artboard) {
      editor.selection.selectArtboard(artboard)      
      editor.selection.select(artboard)
    }

    this.emit('refreshAllSelectArtBoard');
    this.emit('refreshSelection')
  }

  [CLICK('$add')] (e) {
    this.emit('add.artboard');
  }

  [CLICK('$artboardList .artboard-item .remove')] (e) {
    var project = editor.selection.currentProject
    if (project) {
      var index = +e.$delegateTarget.attr('data-index')

      project.artboards.splice(index);

      var artboard = project.artboards[index] || project.artboards[index - 1];

      this.selectArtboard(artboard);
    }
  }

  [CLICK('$artboardList .artboard-item label')] (e) {
    var project = editor.selection.currentProject
    if (project) {
      var $item = e.$delegateTarget.closest('artboard-item');
      $item.onlyOneClass('selected');

      var index = +e.$delegateTarget.attr('data-index')

      var artboard = project.artboards[index]

      this.selectArtboard(artboard);
    }
  }

  [EVENT('refreshArtBoardList')] () {
    this.refresh();
  }

  [EVENT('changeItemLayout')] () {
    editor.selection.each((item, index) => {
      var el = this.refs.$artboardList.$(`[data-artboard-id="${item.id}"]`)
      if (el) {
        el.attr('data-layout', item.layout)
      }
    })

  }

}
