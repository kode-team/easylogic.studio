import BaseProperty from "./BaseProperty";
import { LOAD, CLICK } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import icon from "../../../icon/icon";
import { Project } from "../../../../../editor/items/Project";

import { EVENT } from "../../../../../util/UIElement";


export default class ProjectProperty extends BaseProperty {
  getTitle() {
    return "Projects";
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
    var project = editor.add(new Project())

    editor.selection.selectProject(project);

    this.refresh();

    this.emit('refreshSelection')
  }

  getBody() {
    return `
      <div class="property-item project-list" ref="$projectList"></div>
    `;
  }

  [LOAD("$projectList")]() {
    var projects = editor.projects || [];
    

    return projects.map( (project, index) => {
      var selected = project === editor.selection.currentProject ? 'selected' : '';
      return `
        <div class='property-item project-item ${selected}'>
          <label data-index='${index}'>${project.name || 'New Project'}</label>
          <div class="tools">
            <button type="button" class="remove" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
      `
    })
  }

  selectProject (project) {

    if (project) {
      editor.selection.selectProject(project)

      if (project.artboards.length) {
        editor.selection.selectArtboard(project.artboards[0])
        editor.selection.select();
      }
    }

    this.refresh()       
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
