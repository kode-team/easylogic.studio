import {
  CLICK,
  DEBOUNCE,
  DOMDIFF,
  IF,
  LOAD,
  SELF,
  SUBSCRIBE,
} from "el/sapa/Event";
import "./ClippathEditorView.scss";
import { ClipPathType } from "el/editor/types/model";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import ClippathEllipseEditorView from "./ClippathEllipseEditorView";
import Dom from "el/sapa/functions/Dom";

export default class ClippathEditorView extends ClippathEllipseEditorView {

  template() {
    return <div class="elf--clippath-editor-view "></div>;
  }

  [LOAD("$el") + DOMDIFF]() {

    const current = this.$selection.current;

    if (!current) {
      return "";
    }

    const clippath = ClipPath.parseStyle(current['clip-path']);

    switch (clippath.type) {
    case ClipPathType.CIRCLE: 
      clippath.value = ClipPath.parseStyleForCircle(clippath.value);

      return this.templateCircle(clippath);
    case ClipPathType.ELLIPSE:
      clippath.value = ClipPath.parseStyleForEllipse(clippath.value);
      return this.templateEllipse(clippath);
    case ClipPathType.POLYGON:
      return this.templatePolygon(clippath);
    case ClipPathType.INSET: 
      return this.templateInset(clippath);
    }

    return <div></div>
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("updateViewport")]() {
    this.refresh();
  }

  checkClipPath() {

    if (this.$el.isShow() === false) return false; 

    const current = this.$selection.current;

    if (!current) return false;
    return this.$selection.current.hasChangedField('clip-path', 'angle','x','y','width','height');
  }
  [SUBSCRIBE('refreshSelectionStyleView') + IF('checkClipPath')]() {
    this.refresh();
  }

  [CLICK('$el')] (e) {
    if (Dom.create(e.target).isTag('svg') || Dom.create(e.target).hasClass('elf--clippath-editor-view')) {
      this.trigger('hideClippathEditorView');
    }
  }  

  [SUBSCRIBE('hideClippathEditorView')]() {
    this.$el.hide();
  }

  [SUBSCRIBE('showClippathEditorView')]() {
    this.$el.show();

    this.refresh();
  }
}
