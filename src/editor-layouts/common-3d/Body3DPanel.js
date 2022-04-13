import { BIND, CONFIG, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import Canvas3DView from "./body-panel/Canvas3DView";

import './Body3DPanel.scss';
import { createComponent } from "el/sapa/functions/jsx";


export default class Body3DPanel extends EditorElement {

  components() {
    return {
      Canvas3DView,
    }
  }

  template() {
    return /*html*/`
      <div class="elf--body-panel">
        <div class='editing-area'>
          <div class="canvas-layout">
            ${createComponent('Canvas3DView')}
          </div>
        </div>
      </div>
    `;
  }

  [SUBSCRIBE('bodypanel.toggle.fullscreen')] () {
    this.refs.$el.toggleFullscreen();
  }
}