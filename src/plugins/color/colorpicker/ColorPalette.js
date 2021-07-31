
import { POINTERSTART, BIND } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";

export default class ColorPalette extends EditorElement {

  initState() {
    return {
      hueColor:'rgba(0, 0, 0, 1)',
      s:0,
      v:0
    }
  }

  template() {
    return /*html*/`
        <div class="color-panel">
            <div ref="$saturation" class="saturation">
                <div ref="$value" class="value">
                    <div ref="$drag_pointer" class="drag-pointer"></div>
                </div>
            </div>        
        </div>        
        `;
  }

  afterRender() {
    this.rect = this.$el.rect();
  }

  [BIND('$el')] () {
    return {
      style: {
        'background-color': this.state.hueColor
      }
    }
  }

  [BIND('$drag_pointer')] () {

    if (this.rect.width === 0) {
      this.rect = this.$el.rect();
    }

    const x = this.rect.width * this.state.s;
    const y = this.rect.height * (1 - this.state.v);

    return {
      style : {
        left: Length.px(x),
        top: Length.px(y),
      }
    }
  }

  [POINTERSTART('$el') + MOVE('movePointer') + END('moveEndPointer')] (e) {
    this.rect = this.$el.rect();

    this.refreshColorUI();
  }

  movePointer () {
    this.refreshColorUI();
  }

  moveEndPointer () {
    this.parent.changeEndColor()
  }

  refreshColorUI () {

    const e = this.$config.get('bodyEvent') 
    const minX = this.rect.left;
    const maxX = this.rect.right;
    const minY = this.rect.top;
    const maxY = this.rect.bottom;

    const currentX = Math.min(maxX, Math.max(minX, e.clientX))
    const currentY = Math.min(maxY, Math.max(minY, e.clientY))

    const width = maxX- minX;
    const height = maxY - minY; 

    var s = (currentX - minX) / width;
    var v = (height - (currentY - minY)) / height;

    this.parent.changeColor({
      type: "hsv",
      s,
      v
    });

  }

  setValue(s, v, hueColor) {
    this.setState({
      s, v, hueColor
    })
  }
}
