import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { Project } from "../../../editor/items/Project";
import { ArtBoard } from "../../../editor/items/ArtBoard";
import { CLICK } from "../../../util/Event";
import { CHANGE_SELECTION } from "../../types/event";
import { StyleParser } from "../../../editor/parse/StyleParser";
import { CSS_TO_STRING } from "../../../util/css/make";

export default class CanvasView extends UIElement {
  initialize() {
    super.initialize();

    this.styleParser = new StyleParser();
  }

  afterRender() {
    var project = editor.addProject(new Project());
    var artboard = project.add(new ArtBoard());

    editor.selection.select(artboard);

    this.parser = this;

    if (this.props.embed) {
      this.$el.hide();
    } else {
      this.trigger("refreshCanvas");
    }
  }
  template() {
    return `
      <div class='page-view'>
        <div class="page-canvas" ref="$canvas"></div>     
        <style type='text/css' ref='$style'></style>     
      </div>
    `;
  }

  [EVENT("setParser")](callback) {
    this.parser = callback(this);
  }

  parseEnd(data) {
    const newStyles = this.styleParser.parse(data);

    this.modifyArtBoard(newStyles);

    this.emit(CHANGE_SELECTION);
  }

  modifyArtBoard(data) {
    var current = editor.selection.current;
    if (current) {
      current.reset(data);
    }
  }

  generate(css, keyframeString, rootVariable) {

    this.refs.$style.html(`
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }

      /* element */
      .csseditor .page-canvas { 
        ${CSS_TO_STRING(css)}; 
      }  

      /* keyframe */
      ${keyframeString}
    `)

    if (this.refs.$canvas.text() != css.content) {
      this.refs.$canvas.text(css.content);
    }
  }

  [EVENT("refreshCanvas")]() {
    var current = editor.selection.current;
    if (current) {
      if (this.props.embed) {
        this.parser.generate(current.toEmbedCSS(), current.toKeyframeString(), current.toRootVariableCSS());
      } else {
        this.generate(current.toCSS(), current.toKeyframeString(), current.toRootVariableCSS());
      }
    }
  }

  [CLICK()]() {
    this.emit(CHANGE_SELECTION);
  }
}
