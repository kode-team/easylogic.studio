import UIElement, { EVENT, COMMAND } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { Project } from "../../../editor/items/Project";
import { ArtBoard } from "../../../editor/items/ArtBoard";
import { CLICK, DEBOUNCE, PREVENT, STOP, WHEEL, ALT, THROTTLE, IF, KEYUP, CONTROL, META, KEYPRESS, SCROLL, KEY } from "../../../util/Event";

import { StyleParser } from "../../../editor/parse/StyleParser";
import icon from "../icon/icon";
import ElementView from "./ElementView";
import { Layer } from "../../../editor/items/Layer";
import NumberRangeEditor from "../control/panel/property-editor/NumberRangeEditor";
import { Length } from "../../../editor/unit/Length";
import { rgb } from "../../../util/functions/formatter";
import { FileImageResource } from "../../../editor/image-resource/URLImageResource";
import { BackgroundImage } from "../../../editor/css-property/BackgroundImage";
import { Sketch, SketchUtil } from "../../../editor/parse/Sketch";
import Color from "../../../util/Color";
import Dom from "../../../util/Dom";
import StarManager from "./StarManager";


export default class CanvasView extends UIElement {

  components() {
    return {
      NumberRangeEditor,
      ElementView,
      StarManager      
    }
  }

  initialize() {
    super.initialize();

    this.styleParser = new StyleParser();
  }

  afterRender() {
    var project = editor.add(new Project({
      name: 'New project'
    }));

    editor.selection.selectProject(project);

    var artboard = project.add(new ArtBoard({
      name: 'New ArtBoard',
      x: Length.px(300),
      y: Length.px(300)
    }));
    editor.selection.selectArtboard(artboard);

    var layer = artboard.add(new Layer({
      name: 'New layer',
      'background-color': Color.random()
    }));
    editor.selection.select(layer);

    this.parser = this;

    this.emit('refreshAll')
    this.emit('refreshSelection')
  }
  template() {
    return `
      <div class='page-container' tabIndex="-1">
        <div class='page-view'>
          <div class='page-lock' ref='$lock'>
            <ElementView ref='$elementView' />
          </div>
        </div>
        <StarManager />
        <div class='page-tools'>
          <button type='button' ref='$plus'>${icon.add}</button>
          <button type='button' ref='$minus'>${icon.remove2}</button>
          <div class='select'>
            <NumberRangeEditor ref='$scale' min='10' max='240' step="1" key="scale" value="${editor.scale*100}" onchange="changeScale" />
          </div>
          <label>%</label>
        </div>
      </div>
    `;
  }

  [KEYUP('$el') + CONTROL + KEY('c')  + PREVENT ] (e) {
    editor.selection.copy();
  }

  [KEYUP('$el') + CONTROL + KEY('v') + PREVENT ] () {
    editor.selection.paste();

    this.emit('refreshAll');
  }  

  getScrollTop() {
    if (this.refs.$lock) {
      return this.refs.$lock.scrollTop()
    }

    return 0;
  }

  getScrollLeft() {
    if (this.refs.$lock) {
      return this.refs.$lock.scrollLeft()
    }
    
    return 0; 
  }  

  get scrollXY () {
    return {
      screenX: Length.px(this.getScrollLeft()),
      screenY: Length.px(this.getScrollTop())
    }
  }

  get screenSize () {
    if (this.refs.$lock) {
      return this.refs.$lock.rect()
    }

    return {
      width: 0,
      height: 0
    }
  } 

  setScrollTop (value) {
    this.refs.$lock.setScrollTop(value);
  }

  addScrollTop (value) {
    this.setScrollTop(this.getScrollTop() + value)
  }

  setScrollLeft (value) {
    this.refs.$lock.setScrollLeft(value);
  }  

  addScrollLeft (value) {
    this.setScrollLeft(this.getScrollLeft() + value)
  }



  // 단축키 적용하기 
  [KEYUP() + IF('Backspace')] (e) {
    var $target = Dom.create(e.target);
    if ($target.attr('contenteditable')) {

    } else {
      editor.selection.remove()
      this.emit('refreshAllSelectArtBoard')
    }
  }

  [EVENT('changeScale')] (key, scale) {
    editor.scale = scale/100; 
    this.emit('changeScale');
  }

  [CLICK('$plus') + PREVENT + STOP] () {

    editor.scale *= 1.1; 
    this.children.$scale.setValue(editor.scale * 100);
    this.emit('changeScale')
  }

  [CLICK('$minus') + PREVENT + STOP] () {
    editor.scale *= 0.9; 
    this.children.$scale.setValue(editor.scale * 100);    
    this.emit('changeScale')
  }

  [WHEEL('$lock') + ALT + PREVENT + THROTTLE(10)] (e) {

    var dt = e.deltaY < 0 ? 1.1 : 0.9;
    editor.scale *= dt; 
    this.children.$scale.setValue(editor.scale * 100)
    this.emit('changeScale')
  }


  [EVENT("setParser")](callback) {
    this.parser = callback(this);
  }

  parseEnd(data) {
    const newStyles = this.styleParser.parse(data);

    this.modifyArtBoard(newStyles);

    this.emit('refreshSelection');
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

  /*
    editor.addCommand(new Command ({ 
      title: '',
      description: '',
      id: 'item.add',
      shortcut: 'C',
      context: 'document',    // context 에 따라서 ke 바인딩 위치가 달리지는 것을 구현해야하나요? 
      action : function ($store) {
        editor.selection.remove();
        this.emit('refreshSelectionStyleView')
      }
    }))

    editor.commands.registerCommand('hello.world', () => {

    })

    class MyCommmand extends UICommand {
      [COMMAND('hello.world')] (a, b, c) {
        editor.selection.remove();
        this.emit('refreshSelectionStyleView')
      }
    }

    editor.commands.registerCommand(new MyCommand());

    editor.commands.runCommand('hello.world', 1, 2, 3);
  */

  // [EVENT('loadSketchData')] (sketchData) {
  //   var projects = SketchUtil.parse (sketchData);

  //   projects.forEach(p => {
  //     editor.add(p);
  //   })

  //   this.refresh();
  //   this.emit('addElement');    
  //   this.emit('refreshCanvas')
  //   this.emit('refreshStyleView')

  // }

}
