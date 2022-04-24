import BaseWindow from "./BaseWindow";

import { SUBSCRIBE } from "sapa";

import { registElement } from "sapa";

import "./ProjectWindow.scss";

export default class ProjectWindow extends BaseWindow {
  getClassName() {
    return "elf--project-window";
  }

  getTitle() {
    return "Project Manager";
  }

  initState() {
    return {
      selectedIndex: 1,
    };
  }

  getBody() {
    return /*html*/ `
        <div class="project-container">
            <div class="project-menu left">
                Project Menu
            </div>
            <div class="project-list right">
                Project List
            </div>
        </div>
        `;
  }

  [SUBSCRIBE("open.projects")]() {
    this.show();
    this.refresh();
  }

  refresh() {
    // var project = this.$selection.currentProject || { layers: [] };
  }
}

registElement({ ProjectWindow });
