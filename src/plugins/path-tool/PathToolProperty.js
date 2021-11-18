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
          <button type="button" data-value="polygonal">${iconUse('smooth', "", {width: 24, height: 24})} Polygonal</button>                
          <button type="button" data-value="normalize">${iconUse('stroke_to_path', "", {width: 24, height: 24})} Curve</button> 
        </div>                
      </div>
    `;
  }

  [CLICK('$buttons button')] (e) {
    const current = this.$selection.current;
    const command = e.$dt.data('value');

    if (command === 'stroke') {

      const attrs = current.attrs('d', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linejoin', 'stroke-linecap');
      const pathAttrs = current.convertStrokeToPath()

      const newD = this.$pathkit.stroke(current.d || attrs.d, {
        'stroke-width': Length.parse(attrs['stroke-width']).value,
        'stroke-linejoin': attrs['stroke-linejoin'],
        'stroke-linecap': attrs['stroke-linecap'],
        'stroke-dasharray': attrs['stroke-dasharray'],
        'stroke-dashoffset': attrs['stroke-dashoffset'],        
        'fill-rule': 'nonezero',
      });

      pathAttrs['fill-rule'] = 'nonzero';


      this.command('addLayer', `add layer - path`, this.$editor.createModel({
        ...pathAttrs,
        ...current.updatePath(newD),        
      }), true, current.parent)      

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
    } else if (command === 'normalize') {
      this.command("setAttributeForMulti", "smooth path string", this.$selection.packByValue(
        current.updatePath(
          PathParser
            .fromSVGString(current.d)
            .normalize()
            .d
          )
      ))  
    } else if (command === 'smooth') {
      this.command("setAttributeForMulti", "smooth path string", this.$selection.packByValue(
        current.updatePath(
          PathParser
            .fromSVGString(current.d)
            .divideSegmentByCount(5)
            .simplify(0.1)
            .cardinalSplines()
            .d
          )
      ))  
    } else if (command === 'polygonal') {
      this.command("setAttributeForMulti", "polygonal path string", this.$selection.packByValue(
        current.updatePath(
          PathParser
            .fromSVGString(current.d)
            .polygonal()
            .d
          )
      ))        
    } else if (command === 'flatten') {

      let newPath = PathParser.fromSVGString();
      this.$selection.each((item) => {
        newPath.addPath(item.accumulatedPath());
      });

      newPath = current.invertPath(newPath.d);

      const newLayerAttrs = current.toCloneObject();
      delete newLayerAttrs.id;

      this.command('addLayer', `add layer - path`, this.$editor.createModel({
        ...newLayerAttrs,
        ...current.updatePath(newPath.d),
      }), true, current.parent)
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

  [SUBSCRIBE('refreshSelection')] () {
    this.refreshShow(() => {
      return this.$selection.is('svg-path', 'polygon', 'star');
    })
  }
}