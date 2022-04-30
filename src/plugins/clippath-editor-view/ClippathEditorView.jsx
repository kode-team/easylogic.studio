import { CLICK, DEBOUNCE, DOMDIFF, IF, LOAD, SUBSCRIBE, Dom } from "sapa";

import "./ClippathEditorView.scss";
import ClippathEllipseEditorView from "./ClippathEllipseEditorView";

import { ClipPath } from "elf/editor/property-parser/ClipPath";
import { ClipPathType } from "elf/editor/types/model";

export default class ClippathEditorView extends ClippathEllipseEditorView {
  template() {
    return <div class="elf--clippath-editor-view "></div>;
  }

  [LOAD("$el") + DOMDIFF]() {
    const current = this.$context.selection.current;

    if (!current) {
      return "";
    }

    const clippath = ClipPath.parseStyle(current["clip-path"]);

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

    return <div></div>;
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("updateViewport")]() {
    this.refresh();
  }

  checkClipPath() {
    if (this.$el.isShow() === false) return false;

    const current = this.$context.selection.current;

    if (!current) return false;
    return this.$context.selection.current.hasChangedField(
      "clip-path",
      "angle",
      "x",
      "y",
      "width",
      "height"
    );
  }
  [SUBSCRIBE("refreshSelectionStyleView") + IF("checkClipPath")]() {
    this.refresh();
  }

  [CLICK("$el")](e) {
    if (
      Dom.create(e.target).isTag("svg") ||
      Dom.create(e.target).hasClass("elf--clippath-editor-view")
    ) {
      this.trigger("hideClippathEditorView");
    }
  }

  [SUBSCRIBE("hideClippathEditorView")]() {
    this.$el.hide();
  }

  [SUBSCRIBE("showClippathEditorView")]() {
    this.$el.show();

    this.refresh();
  }
}
