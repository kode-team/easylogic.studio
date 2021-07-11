import { BIND, SUBSCRIBE } from "el/base/Event";

import { registElement } from "el/base/registElement";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import { css } from "@emotion/css";


const elClass = css`
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;

  &:not(.ruler) {
    > .page-container {
      left: 0px !important;
      top: 0px !important;
    }
  }
`

export default class BodyPanel extends EditorElement {

  template() {
    return /*html*/`
      <div class="body-panel">
        <object refClass='HorizontalRuler' />
        <object refClass='VerticalRuler' />
        <object refClass='CanvasView' />        
      </div>
    `;
  }

  [BIND('$el')] () { 
    return {
        class: `${elClass} ${this.$config.get('ruler.show') ? 'ruler' : ''}`
    }
  }  

  [SUBSCRIBE('config:ruler.show')] () {
    this.refresh();
  }

  [SUBSCRIBE('bodypanel.toggle.fullscreen')] () {
    this.refs.$el.toggleFullscreen();
  }
}

registElement({ BodyPanel })