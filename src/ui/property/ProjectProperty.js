import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, PREVENT, STOP, FOCUSOUT, DOUBLECLICK, DOMDIFF, KEYDOWN, ENTER } from "@core/Event";
import icon from "@icon/icon";

import { EVENT } from "@core/UIElement";
import { registElement } from "@core/registerElement";


export default class ProjectProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('project.property.title');
  }

  getClassName() {
    return 'full';
  }

  getTools() {
    return /*html*/`
      <button type='button' ref='$add' title="Add a project">${icon.add}</button>
    `
  }

  [CLICK('$add')] () {
    this.emit('addProject');
  }

  getBody() {
    return /*html*/`
      <div class="project-list scrollbar" ref="$projectList"></div>
    `;
  }

  [LOAD("$projectList") + DOMDIFF]() {
    var projects = this.$editor.projects || [];
    

    return projects.map( (project, index) => {
      var selected = project === this.$selection.currentProject ? 'selected' : '';
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
    this.startInputEditing(e.$dt.$('label'))
  }

  modifyDoneInputEditing (input) {
    this.endInputEditing(input, (index, text) => {

      var project = this.$editor.projects[index]
      if (project) {
        project.reset({
          name: text
        })
      }
    });    
  }

  [KEYDOWN('$projectList .project-item label') + ENTER + PREVENT + STOP] (e) {
    this.modifyDoneInputEditing(e.$dt);
    return false;
  }

  [FOCUSOUT('$projectList .project-item label') + PREVENT  + STOP ] (e) {
    this.modifyDoneInputEditing(e.$dt);
  }



  selectProject (project) {

    if (project) {
      this.$selection.selectProject(project)

      if (project.artboards.length) {
        this.$selection.selectArtboard(project.artboards[0])
        this.$selection.select();
      }
    }

    this.refresh()       
    this.emit('refreshAllSelectProject');    
  }

  [CLICK('$projectList .project-item label')] (e) {
    var index = +e.$dt.attr('data-index')

    this.selectProject(this.$editor.projects[index])
  }


  [CLICK('$projectList .project-item .remove')] (e) {
    var index = +e.$dt.attr('data-index')

    this.$editor.projects.splice(index);

    var project = this.$editor.projects[index] || this.$editor.projects[index - 1];

    this.selectProject(project);
  }

  [EVENT('refreshProjectList')] () {
    this.refresh();
  }

}

registElement({ ProjectProperty })