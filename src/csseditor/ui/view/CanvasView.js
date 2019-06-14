import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { Project } from "../../../editor/items/Project";
import { ArtBoard } from "../../../editor/items/ArtBoard";
import { CLICK, DEBOUNCE } from "../../../util/Event";
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
      this.generateStyle()
    }
  }
  template() {
    return `
      <div class='page-view'>
        <div class='page-lock' ref='$lock'>
          <div class="page-canvas" ref="$canvas"></div>             
        </div>
        <style type='text/css' ref='$style'></style>  
        <svg width="0" height="0" ref='$svg'></svg>   
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

  generate(css, keyframeString, rootVariable, content, svgString) {

    if (this.refs.$canvas.text() != content) {
      this.refs.$canvas.text(content);
    }

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

    this.refs.$svg.html(svgString)


    this.refs.$lock.css({
      width: css.width,
      height: css.height
    })

    var last = Object.keys(css).filter(it => !it.includes('--'))

    this.trigger('refreshComputedStyle', last)

    
  }

  [EVENT('refreshComputedStyle') + DEBOUNCE(100)] (last) {
    var computedCSS = this.refs.$canvas.getComputedStyle(...last)
    
    this.emit('refreshComputedStyleCode', computedCSS)
  }

  generateStyle () {
    var current = editor.selection.current;
    if (current) {
      if (this.props.embed) {
        this.parser.generate(
          current.toEmbedCSS(), 
          current.toKeyframeString(), 
          current.toRootVariableCSS(), 
          current.content,
          current.toSVGString()
        );
      } else {
        this.generate(
          current.toCSS(), 
          current.toKeyframeString(), 
          current.toRootVariableCSS(), 
          current.content,
          current.toSVGString()
        );
      }
    }
  }

  [EVENT("refreshCanvas") + DEBOUNCE(10)]() {
    this.generateStyle()
  }

  [CLICK()]() {
    this.emit(CHANGE_SELECTION);
  }
}
