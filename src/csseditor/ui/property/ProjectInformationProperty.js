import BaseProperty from "./BaseProperty";
import { LOAD, VDOM } from "../../../util/Event";
import { editor } from "../../../editor/editor";

import { EVENT } from "../../../util/UIElement";


export default class ProjectInformationProperty extends BaseProperty {
  getTitle() {
    return "Information";
  }

  getClassName() {
    return 'full';
  }

  getBody() {
    return /*html*/`
      <div class="project-info" ref="$info">
        <div class='project-info-item'>
          <label>Name</label>
          <div><input type='text' /></div>
        </div>
        <div class='project-info-item'>
          <label>Description</label>
          <div>
            <textarea ></textarea>
          </div>
        </div>
      </div>
    `;
  }

  [LOAD("$projectInfo") + VDOM]() {
    var projects = editor.selection.currentProject || {} 
    

    return `

    `
  }

  [EVENT('refreshProjectList', 'refreshAllSelectProject')] () {
    this.refresh();
  }

}
