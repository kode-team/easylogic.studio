import { CLICK, SUBSCRIBE } from "sapa";

import "./PathToolProperty.scss";

import { iconUse } from "elf/editor/icon/icon";
import BottomAlign from "elf/editor/ui/menu-items/BottomAlign";
import CenterAlign from "elf/editor/ui/menu-items/CenterAlign";
import LeftAlign from "elf/editor/ui/menu-items/LeftAlign";
import MiddleAlign from "elf/editor/ui/menu-items/MiddleAlign";
import RightAlign from "elf/editor/ui/menu-items/RightAlign";
import SameHeight from "elf/editor/ui/menu-items/SameHeight";
import SameWidth from "elf/editor/ui/menu-items/SameWidth";
import TopAlign from "elf/editor/ui/menu-items/TopAlign";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

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
      SameHeight,
    };
  }

  getTitle() {
    return this.$i18n("alignment.property.title");
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return /*html*/ `
      <div class="elf--boolean-item" ref="$buttons">
        <div>
          <button type="button" data-command="convert.path.operation" data-args="union">${iconUse(
            "boolean_union",
            "",
            { width: 30, height: 30 }
          )} Union</button>        
          <button type="button" data-command="convert.path.operation" data-args="intersection">${iconUse(
            "boolean_intersection",
            "",
            { width: 30, height: 30 }
          )} Intersection</button>        
        </div>
        <div>
          <button type="button" data-command="convert.path.operation" data-args="difference">${iconUse(
            "boolean_difference",
            "",
            { width: 30, height: 30 }
          )} Subtract</button>        
          <button type="button" data-command="convert.path.operation" data-args="xor">${iconUse(
            "boolean_xor",
            "",
            { width: 30, height: 30 }
          )} Exclude</button>        
        </div>
        <div class="divider"></div>
        <!--div>
          <button type="button" data-command="convert.no.transform.path">${iconUse(
            "grid3x3",
            "",
            { width: 24, height: 24 }
          )} No Transform</button>        
        </div-->
        <div>
          <button type="button" data-command="convert.simplify.path">${iconUse(
            "grid3x3",
            "",
            { width: 24, height: 24 }
          )} Self Intersection</button>        
          <button type="button" data-command="convert.flatten.path">${iconUse(
            "flatten",
            "",
            { width: 24, height: 24 }
          )} Flatten</button>                  
        </div>        
        <div>
          <!--<button type="button" data-command="convert.smooth.path">${iconUse(
            "smooth",
            "",
            { width: 24, height: 24 }
          )} Smooth Path</button>-->                
          <button type="button" data-command="switch.path">${iconUse(
            "sync",
            "",
            { width: 30, height: 30 }
          )} Switch path</button>                  
          <button type="button" data-command="convert.stroke.to.path">${iconUse(
            "outline_shape",
            "",
            { width: 24, height: 24 }
          )} Outline Path</button> 
        </div>        
        <!--div>
          <button type="button" data-command="convert.polygonal.path">${iconUse(
            "highlight_at",
            "",
            { width: 24, height: 24 }
          )} Polygonal</button>                
          <button type="button" data-command="convert.normalize.path">${iconUse(
            "stroke_to_path",
            "",
            { width: 24, height: 24 }
          )} Normalize</button> 
        </div-->                
      </div>
    `;
  }

  [CLICK("$buttons button")](e) {
    const command = e.$dt.data("command");
    const args = e.$dt.data("args");

    if (command === "convert.smooth.path") {
      this.emit(command);
    } else {
      this.emit(command, args);
    }

    // if (command === 'stroke') {
    //   this.emit('convert.stroke.to.path');
    // } else if (command === 'switch-path') {
    //     this.emit('switch.path');
    // } else if (command === 'simplify') {
    //   this.emit('convert.simplify.path');
    // } else if (command === 'normalize') {
    //   this.emit('convert.normalize.path');
    // } else if (command === 'smooth') {
    //   this.emit('convert.smooth.path');
    // } else if (command === 'polygonal') {
    //   this.emit('convert.polygonal.path');
    // } else if (command === 'flatten') {
    //   this.emit('convert.flatten.path');
    // } else {
    //   this.emit('convert.path.operation', command);
    // }
  }

  [SUBSCRIBE("refreshSelection")]() {
    this.refreshShow(() => {
      if (
        this.$context.selection.length === 1 &&
        this.$context.selection.is("boolean-path")
      )
        return true;

      return this.$context.selection.is("svg-path", "polygon", "star");
    });
  }
}
