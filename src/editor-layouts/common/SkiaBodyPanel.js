import { BIND, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import { css } from "@emotion/css";
import HorizontalRuler from "./body-panel/HorizontalRuler";
import VerticalRuler from "./body-panel/VerticalRuler";
import SkiaCanvasView from "./body-panel/SkiaCanvasView";


const elClass = css`
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;

  &:not(.ruler) {
    > .elf--page-container {
      left: 0px !important;
      top: 0px !important;
    }
  }
`




export default class BodyPanel extends EditorElement {

  components() {
    return {
      SkiaCanvasView,
      VerticalRuler,
      HorizontalRuler
    }
  }

  template() {
    return /*html*/`
      <div class="body-panel">
        <object refClass='HorizontalRuler' />
        <object refClass='VerticalRuler' />
        <object refClass='SkiaCanvasView' />        
      </div>
    `;
  }

  [BIND('$el')] () { 
    return {
        class: `${elClass} ${this.$config.get('show.ruler') ? 'ruler' : ''}`
    }
  }  

  [SUBSCRIBE('config:show.ruler')] () {
    this.refresh();
  }

  [SUBSCRIBE('bodypanel.toggle.fullscreen')] () {
    this.refs.$el.toggleFullscreen();
  }
}