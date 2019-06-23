import BaseProperty from "./BaseProperty";
import { LOAD, CLICK } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import icon from "../../../icon/icon";
import { Project } from "../../../../../editor/items/Project";
import { CHANGE_SELECTION } from "../../../../types/event";
import { EVENT } from "../../../../../util/UIElement";


export default class ProjectProperty extends BaseProperty {
  getTitle() {
    return "Projects";
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

    this.emit(CHANGE_SELECTION)
  }

  getBody() {
    return html`
      <div class="property-item project-list" ref="$projectList"></div>
    `;
  }

  [LOAD("$projectList")]() {
    var projects = editor.projects || [];
    

    return projects.map( (project, index) => {
      var selected = project === editor.selection.currentProject ? 'selected' : '';
      return `
        <div class='property-item project-item ${selected}'>
          <label data-index='${index}'>${project.name}</label>
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
    }

    this.refresh()
    this.emit('addElement')
    this.emit(CHANGE_SELECTION)    
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

  [EVENT(CHANGE_SELECTION)] () {
    this.refresh()
  }

}
