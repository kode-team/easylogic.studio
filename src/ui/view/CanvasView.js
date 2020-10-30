import UIElement from "@core/UIElement";

import HTMLRenderView from "./render-view/HTMLRenderView";
import PageTools from "../view-items/PageTools";
import PageSubEditor from "../view-items/PageSubEditor";
import { mat4, vec2, vec3 } from "gl-matrix";
import { calculateAngle, degreeToRadian, radianToDegree } from "@core/functions/math";

export default class CanvasView extends UIElement {

  components() {
    return {
      PageTools,
      HTMLRenderView,
      PageSubEditor,
    }
  }

  afterRender() {
    this.emit('load.json');
  }
  template() {
    return/*html*/`
      <div class='page-container' tabIndex="-1">
        <div class='page-view'>
          <div class='page-lock scrollbar' ref='$lock'>
            <HTMLRenderView ref='$elementView' />
          </div>
        </div>
        <!--<PageSubEditor /> -->
        <PageTools />
      </div>
    `;
  }

}
