import BaseProperty from "./BaseProperty";
import { LOAD, CLICK } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import icon from "../../../icon/icon";
import { EVENT } from "../../../../../util/UIElement";

import { ArtBoard } from "../../../../../editor/items/ArtBoard";


export default class ArtBoardProperty extends BaseProperty {
  getTitle() {
    return "ArtBoards";
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
    return `
      <div class="property-item artboard-list" ref="$artboardList"></div>
    `;
  }

  [LOAD("$artboardList")]() {

    var project = editor.selection.currentProject;    
    if (!project) return ''

    return project.artboards.map( (artboard, index) => {
      var selected = artboard === editor.selection.currentArtboard ? 'selected' : ''
      return `
        <div class='artboard-item ${selected}'>
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

  selectArtboard(artboard) {

    if (artboard) {
      editor.selection.selectArtboard(artboard)
      editor.selection.select()
    }

    this.refresh()
    this.emit('refreshAllSelectArtBoard');
  }

  [CLICK('$add')] (e) {
    var project = editor.selection.currentProject;
    if (project) {
      var artboard = project.add(new ArtBoard())

      this.selectArtboard(artboard);
    }
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

      var index = +e.$delegateTarget.attr('data-index')

      var artboard = project.artboards[index]

      this.selectArtboard(artboard);
    }
  }

  [EVENT('refreshArtBoardList')] () {
    this.refresh();
  }

}
