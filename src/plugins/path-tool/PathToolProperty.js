import BottomAlign from "el/editor/ui/menu-items/BottomAlign";
import CenterAlign from "el/editor/ui/menu-items/CenterAlign";
import LeftAlign from "el/editor/ui/menu-items/LeftAlign";
import MiddleAlign from "el/editor/ui/menu-items/MiddleAlign";
import RightAlign from "el/editor/ui/menu-items/RightAlign";
import SameHeight from "el/editor/ui/menu-items/SameHeight";
import SameWidth from "el/editor/ui/menu-items/SameWidth";
import TopAlign from "el/editor/ui/menu-items/TopAlign";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { CLICK, SUBSCRIBE } from "el/sapa/Event";

import './PathToolProperty.scss';
import PathParser from '../../el/editor/parser/PathParser';
import { Length } from 'el/editor/unit/Length';
import { iconUse } from 'el/editor/icon/icon';

export default class PathToolProperty extends BaseProperty {

  components() {
    return {
      LeftAlign,
      CenterAlign,
      RightAlign,
      TopAlign,
      MiddleAlign,
      BottomAlign,
      SameWidth,
      SameHeight
    }
  }

  getTitle() {
    return this.$i18n('alignment.property.title');
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return /*html*/`
      <div class="elf--boolean-item" ref="$buttons">
        <div>
          <button type="button" data-value="union">${iconUse("boolean_union", "", {width: 30, height: 30})} Union</button>        
          <button type="button" data-value="intersection">${iconUse("boolean_intersection", "", {width: 30, height: 30})} Intersection</button>        
        </div>
        <div>
          <button type="button" data-value="difference">${iconUse("boolean_difference", "", {width: 30, height: 30})} Difference</button>        
          <button type="button" data-value="xor">${iconUse("boolean_xor", "", {width: 30, height: 30})} Exclude</button>        
        </div>
        <div>
          <button type="button" data-value="simplify">${iconUse('grid3x3', "", {width: 24, height: 24})} Self Intersection</button>        
          <button type="button" data-value="flatten">${iconUse('flatten', "", {width: 24, height: 24})} Flatten</button>                  
        </div>
        <div>
          <button type="button" data-value="smooth">${iconUse('smooth', "", {width: 24, height: 24})} Smooth Path</button>                
          <button type="button" data-value="stroke">${iconUse('stroke_to_path', "", {width: 24, height: 24})} Stroke to path</button> 
        </div>        
        <div>
          <button type="button" data-value="polygonal">${iconUse('highlight_at', "", {width: 24, height: 24})} Polygonal</button>                
          <button type="button" data-value="normalize">${iconUse('stroke_to_path', "", {width: 24, height: 24})} Curve</button> 
        </div>                
      </div>
    `;
  }

  [CLICK('$buttons button')] (e) {
    const current = this.$selection.current;
    const command = e.$dt.data('value');

    if (command === 'stroke') {
      this.emit('convert.stroke.to.path');
    } else if (command === 'simplify') {
      this.emit('convert.simplify.path');
    } else if (command === 'normalize') {
      this.emit('convert.normalize.path');
    } else if (command === 'smooth') {
      this.emit('convert.smooth.path');
    } else if (command === 'polygonal') {
      this.emit('convert.polygonal.path');
    } else if (command === 'flatten') {
      this.emit('convert.flatten.path');
    } else {
      this.emit('convert.path.operation', command);  
    }

  }

  [SUBSCRIBE('refreshSelection')] () {
    this.refreshShow(() => {

      if (this.$selection.length === 1 && this.$selection.current['boolean-path']) return true;

      return this.$selection.is('svg-path', 'polygon', 'star');
    })
  }
}