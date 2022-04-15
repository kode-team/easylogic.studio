
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './Canvas3DView.scss';
import ThreeRenderView from "./render-view/three-render-view/ThreeRenderView";


export default class Canvas3DView extends EditorElement {

  

  template() {
    return <div class='elf--page-three-container' tabIndex="-1" ref='$container'>
        <div class='page-view' ref="$pageView">
          <div class='page-lock scrollbar' ref='$lock'>            

            <ThreeRenderView ref='$threeRenderView'/>
            
            {this.$injectManager.generate('canvas.view')}              

          </div>
        </div>
      </div>
  }
}