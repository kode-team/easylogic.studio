import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { Project } from "../../../editor/items/Project";
import { ArtBoard } from "../../../editor/items/ArtBoard";
import { CLICK, DEBOUNCE, LOAD, BIND } from "../../../util/Event";
import { CHANGE_SELECTION } from "../../types/event";
import { StyleParser } from "../../../editor/parse/StyleParser";
import { CSS_TO_STRING } from "../../../util/css/make";
import { NEW_LINE, EMPTY_STRING } from "../../../util/css/types";
import icon from "../icon/icon";

export default class CanvasView extends UIElement {

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
    var artboard = project.add(new ArtBoard());

    editor.selection.select(artboard);

    this.parser = this;

    if (this.props.embed) {
      this.$el.hide();
    } else {
      this.refresh()
      this.generateStyle()
    }

    this.emit(CHANGE_SELECTION)
  }
  template() {
    return `
      <div class='page-view'>
        <div class='page-lock' ref='$lock'>
          <div class="page-canvas" ref="$canvas"></div>             
        </div>
        <div ref='$styleArea'>
          <style type='text/css' ref='$style'></style>  
        </div>
        <div ref='$svgArea'>
          <svg width="0" height="0" ref='$svg'></svg>   
        </div>
        <div class='tools'>
          <button type='button' ref='$plus'>${icon.add}</button>
          <button type='button' ref='$minus'>${icon.remove2}</button>
        </div>
      </div>
    `;
  }

  [CLICK('$plus')] () {
    this.setState({
      zoom :  this.state.zoom * 1.1
    })

    this.bindData('$lock')    //  .... 는 아무런 의미가 없다.  
  }
  [CLICK('$minus')] () {
    this.setState({
      zoom :  this.state.zoom * 0.9
    })

    this.bindData('$lock')
  }


  makeElement (item) {
    return `<div id='${item.id}'>${item.content ? item.content : EMPTY_STRING}
      ${item.layers.map(it => {
        return this.makeElement(it)
      }).join(NEW_LINE)}
    </div>`
  }

  [BIND('$lock')] () {
    var zoom = this.state.zoom;
    return {
      style: {
        transform: `scale(${zoom})`
      }
    }
  }

  [LOAD('$lock')] () {

    var project = editor.projects[0] || { layers : [] }

    return project.layers.map(item => {
      return this.makeElement(item)
    })
  }

  makeStyle (item) {
    const {
      rootVariable, 
      css, 
      selectorString, 
      keyframeString 
    } = item.generateView('#' + item.id)
    return `<style type='text/css'>
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }

      /* element */
      #${item.id} { 
        ${CSS_TO_STRING(css)}; 
      }  

      ${selectorString}

      /* keyframe */
      ${keyframeString}
    </style>
    ` + item.layers.map(it => {
      return this.makeStyle(it);
    })
  }
 
  [LOAD('$styleArea')] () {

    var project = editor.projects[0] || { layers : [] }

    return project.layers.map(item => {
      return this.makeStyle(item)
    })
  } 


  makeSvg (item) {
    const {
      SVGString
    } = item.generateView('.csseditor .page-canvas')
    return `
      <svg width="0" height="0">${SVGString}</svg>
    ` + item.layers.map(it => {
      return this.makeSvg(it);
    })
  }

  [LOAD('$svgArea')] () {

    var project = editor.projects[0] || { layers : [] }

    return project.layers.map(item => {
      return this.makeSvg(item)
    })
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

  generateStyle (data = {}) {
    var current = editor.selection.current;
    if (current) {
      if (this.props.embed) {
        this.parser.generate(current.generateEmbed());
      } else {
        if (data.update === 'tag') {
          this.refresh();
        } else {
          this.load('$styleArea','$svgArea')
        }

      }
    }
  }

  [EVENT("refreshCanvas") + DEBOUNCE(10)](data) { 
    this.generateStyle(data)
  }

  [CLICK()]() {
    this.emit(CHANGE_SELECTION);
  }
}
