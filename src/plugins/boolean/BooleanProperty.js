import BottomAlign from "el/editor/ui/menu-items/BottomAlign";
import CenterAlign from "el/editor/ui/menu-items/CenterAlign";
import LeftAlign from "el/editor/ui/menu-items/LeftAlign";
import MiddleAlign from "el/editor/ui/menu-items/MiddleAlign";
import RightAlign from "el/editor/ui/menu-items/RightAlign";
import SameHeight from "el/editor/ui/menu-items/SameHeight";
import SameWidth from "el/editor/ui/menu-items/SameWidth";
import TopAlign from "el/editor/ui/menu-items/TopAlign";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { CLICK } from "el/sapa/Event";

import './BooleanProperty.scss';
import PathParser from '../../el/editor/parser/PathParser';
import { Length } from 'el/editor/unit/Length';

export default class BooleanProperty extends BaseProperty {

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
          <button type="button" data-value="intersection">Intersect</button>
          <button type="button" data-value="union">Union</button>
          <button type="button" data-value="difference">Difference</button>
          <button type="button" data-value="xor">Xor</button>
        </div>
        <div>
          <button type="button" data-value="simplify">Simplify</button> 
          <button type="button" data-value="smooth">Smooth</button> 
          <button type="button" data-value="transform">transform</button> 
        </div>
        <div>
          <button type="button" data-value="stroke">stroke to path</button> 
        </div>        
      </div>
    `;
  }

  [CLICK('$buttons button')] (e) {
    const current = this.$selection.current;
    const command = e.$dt.data('value');

    if (command === 'stroke') {


      const attrs = current.attrs('d', 'stroke-width', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linejoin', 'stroke-linecap');
      const newD = this.$pathkit.stroke(attrs.d, {
        'stroke-width': Length.parse(attrs['stroke-width']).value,
        'stroke-linejoin': attrs['stroke-linejoin'],
        'stroke-linecap': attrs['stroke-linecap']
      });


      this.$selection.copy();
      this.$selection.paste();
      this.emit('refreshAll');

      this.nextTick(() => {
        const newCurrent = this.$selection.current;

        this.command("setAttributeForMulti", "change path string", this.$selection.packByValue({
          ...newCurrent.updatePath(newD),
          'stroke-width': 1,
          fill: attrs['stroke']
        }))      
      })


    } else if (command === 'transform') {
      this.command("setAttributeForMulti", "change path string", this.$selection.packByValue(
        current.updatePath(
          PathParser
            .fromSVGString(current.d)
            .divideSegmentByCount(4)
            .transform(([x, y, z]) => [x + y * Math.sin(y / 16), y + 4 * Math.sin(x / 16), z])
            .d
          )
      ))
    } else if (command === 'simplify') {
      this.command("setAttributeForMulti", "change path string", this.$selection.packByValue(
        current.updatePath(this.$pathkit.simplify(current.d))
      ))
    } else if (command === 'smooth') {
      this.command("setAttributeForMulti", "smooth path string", this.$selection.packByValue(
        current.updatePath(
          PathParser
            .fromSVGString(current.d)
            .divideSegmentByCount(5)
            .simplify(10)
            .cardinalSplines()
            .d
          )
      ))  
    } else {

      this.command("setAttributeForMulti", "change boolean operation", this.$selection.packByValue({
        "boolean-operation": command
      }))
  
    }

    this.nextTick(() => {
      this.$selection.reselect();
      this.emit("refreshSelection");
      this.emit("refreshSelectionTool");
    });    

  }
}