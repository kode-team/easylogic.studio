import BaseProperty from "../../el/editor/ui/property/BaseProperty";
import { LOAD, CLICK, PREVENT, STOP, FOCUSOUT, DOUBLECLICK, DOMDIFF, KEYDOWN, ENTER, SUBSCRIBE } from "el/sapa/Event";
import icon from "el/editor/icon/icon";

import './ProjectProperty.scss';

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
      <div class="elf--project-list scrollbar" ref="$projectList"></div>
    `;
  }

  [LOAD("$projectList") + DOMDIFF]() {
    var projects = this.$model.projects || [];
    

    return projects.map( (projectId, index) => {
      var selected = projectId === this.$selection.currentProject.id ? 'selected' : '';
      const project = this.$model.get(projectId);
      return /*html*/`
        <div class='project-item ${selected}'>
          <div class='detail'>
            <label data-id='${projectId}'>${project.name || 'New Project'}</label>
            <div class="tools">
              <button type="button" class="remove" data-id="${projectId}" title='Remove'>${icon.remove2}</button>
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

    // TODO: project 를 selection 할 때 히스토리에 추가해야함 

    if (project) {
      this.$selection.selectProject(project.id)
    }

    this.refresh()       
    this.emit('refreshAllSelectProject');    
    this.command('refreshSelection');    
  }

  [CLICK('$projectList .project-item label')] (e) {
    var id = e.$dt.attr('data-id')

    this.selectProject(this.$model.get(id))
  }


  [CLICK('$projectList .project-item .remove')] (e) {
    var id = e.$dt.attr('data-id')

    this.command('removeProject', 'remove project', id);

    this.nextTick(() => {
      this.refresh();
    })
  }

  [SUBSCRIBE('refreshProjectList', 'refreshAll')] () {
    this.refresh();
  }

}