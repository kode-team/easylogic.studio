import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";


import SelectEditor from "../property-editor/SelectEditor";
import { Length } from "../../../../../editor/unit/Length";

export default class ArtBoardSizeProperty extends BaseProperty {
  components() {
    return {
      SelectEditor
    }
  }

  initState() {
    return {
      sizeList: [
        '',
        '300x300',
        '352x720',
        '800x400',
        '960x600'
      ]
    }
  }

  getTitle() {
    return "ArtBoard Size";
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    var current = editor.selection.current;
    if (current) {
      if (current.is('artboard')) {
        this.show();   
      } else {
        this.hide();
      }
    } else {
      this.hide();
    }

  }

  getBody() {
    return `
      <div class="property-item position-item">
        <SelectEditor ref='$sizeList' key='size' label='Sample' options="${this.state.sizeList.join(',')}" onchange="changeBoardSize" />
      </div>
    `;
  }


  [EVENT('changeBoardSize')] (key, value) {
    var current = editor.selection.currentArtboard;
    if (current && current.is('artboard')) {

      if (!value.trim()) return;

      var [width, height] = value.split('x')

      width = Length.px(width);
      height = Length.px(height);

      current.reset({ width, height });
      this.emit("refreshElement", current);
    }
  }
}
