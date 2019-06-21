import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { Project } from "../../../editor/items/Project";
import { ArtBoard } from "../../../editor/items/ArtBoard";
import { CLICK, DEBOUNCE, BIND, PREVENT, STOP } from "../../../util/Event";
import { CHANGE_SELECTION } from "../../types/event";
import { StyleParser } from "../../../editor/parse/StyleParser";
import icon from "../icon/icon";
import ElementView from "./ElementView";
import { Layer } from "../../../editor/items/Layer";

export default class CanvasView extends UIElement {

  components() {
    return {
      ElementView
    }
  }

  initState () {
    return {
      zoom : 1 
    }
  }

  initialize() {
    super.initialize();

    this.styleParser = new StyleParser();
  }

  afterRender() {
    var project = editor.add(new Project());

    editor.selection.selectProject(project);

    var artboard = project.add(new ArtBoard());
    editor.selection.selectArtboard(artboard);

    var layer = artboard.add(new Layer());
    editor.selection.select(layer);

    this.parser = this;

    if (this.props.embed) {
      this.$el.hide();

    }

    this.refresh()

    this.emit(CHANGE_SELECTION)
  }
  template() {
    return `
      <div class='page-container'>
        <div class='page-view'>
          <div class='page-lock' ref='$lock'>
            <ElementView ref='$elementView' />
          </div>
        </div>
        <div class='page-tools'>
          <button type='button' ref='$plus'>${icon.add}</button>
          <button type='button' ref='$minus'>${icon.remove2}</button>
        </div>
      </div>
    `;
  }

  [CLICK('$plus') + PREVENT + STOP] () {
    this.setState({
      zoom :  this.state.zoom * 1.1
    })

    this.bindData('$lock') 
  }
  [CLICK('$minus') + PREVENT + STOP] () {
    this.setState({
      zoom :  this.state.zoom * 0.9
    })

    this.bindData('$lock')
  }



  [BIND('$lock')] () {
    var zoom = this.state.zoom;
    return {
      style: {
        transform: `scale(${zoom})`
      }
    }
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

  [EVENT('refreshComputedStyle') + DEBOUNCE(100)] (last) {
    var computedCSS = this.refs.$canvas.getComputedStyle(...last)
    
    this.emit('refreshComputedStyleCode', computedCSS)
  }

}
