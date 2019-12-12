import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, KEYUP, KEY, PREVENT, STOP, FOCUSOUT, DOUBLECLICK, VDOM, KEYDOWN } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import icon from "../icon/icon";
import { Project } from "../../../editor/items/Project";

import { EVENT } from "../../../util/UIElement";


export default class ProjectProperty extends BaseProperty {
  getTitle() {
    return editor.i18n('project.property.title');
  }

  getClassName() {
    return 'full';
  }

  getTools() {
    return `
      <button type='button' ref='$add' title="Add a project">${icon.add}</button>
    `
  }

  [CLICK('$add')] () {
    this.emit('add.project');
  }

  getBody() {
    return /*html*/`
      <div class="project-list scrollbar" ref="$projectList"></div>
    `;
  }

  [LOAD("$projectList") + VDOM]() {
    var projects = editor.projects || [];
    

    return projects.map( (project, index) => {
      var selected = project === editor.selection.currentProject ? 'selected' : '';
      return /*html*/`
        <div class='project-item ${selected}'>
          <div class='detail'>
            <label data-index='${index}'>${project.name || 'New Project'}</label>
            <div class="tools">
              <button type="button" class="remove" data-index="${index}" title='Remove'>${icon.remove2}</button>
            </div>
          </div>
        </div>
      `
    })
  }


  [DOUBLECLICK('$projectList .project-item')] (e) {
    this.startInputEditing(e.$delegateTarget.$('label'))
  }

  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {

      var project = editor.projects[index]
      if (project) {
        project.reset({
          name: text
        })
      }
    });    
  }

  [KEYDOWN('$projectList .project-item label') + KEY('Enter') + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
    return false;
  }

  [FOCUSOUT('$projectList .project-item label') + PREVENT  + STOP ] (e) {
    this.modifyDoneInputEditing(e.$delegateTarget);
  }



  selectProject (project) {

    if (project) {
      editor.selection.selectProject(project)

      if (project.artboards.length) {
        editor.selection.selectArtboard(project.artboards[0])
        editor.selection.select();
      }
    }

    // this.refresh()       
    this.emit('refreshAllSelectProject');    
  }

  [CLICK('$projectList .project-item label')] (e) {
    var index = +e.$delegateTarget.attr('data-index')

    this.selectProject(editor.projects[index])
  }


  [CLICK('$projectList .project-item .remove')] (e) {
    var index = +e.$delegateTarget.attr('data-index')

    editor.projects.splice(index);

    var project = editor.projects[index] || editor.projects[index - 1];

    this.selectProject(project);
  }

  [EVENT('refreshProjectList')] () {
    this.refresh();
  }

}
