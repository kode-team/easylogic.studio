import BaseWindow from "./BaseWindow";

import { CLICK, SUBSCRIBE } from "el/base/Event";

import Dom from "el/base/Dom";
import HTMLRenderer from "el/editor/renderer/HTMLRenderer";
import SVGRenderer from "el/editor/renderer/SVGRenderer";
import { registElement } from "el/base/registElement";

export default class ProjectWindow extends BaseWindow {

    getClassName() {
        return 'project-window'
    }

    getTitle() {
        return 'Project Manager'
    }

    initState() {
        return {
            selectedIndex: 1
        }
    }

    getBody() {
        return /*html*/`
        <div class="project-container">
            <div class="project-menu left">
                Project Menu
            </div>
            <div class="project-list right">
                Project List
            </div>
        </div>
        `
    }

    [SUBSCRIBE('open.projects')] () {
        this.show();
        this.refresh();
    }

    refresh() {
        var project = this.$selection.currentProject || { layers : [] }

    }
}

registElement({ ProjectWindow })