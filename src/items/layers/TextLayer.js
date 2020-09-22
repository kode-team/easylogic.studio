import { Layer } from "../Layer";
import { OBJECT_TO_PROPERTY, CSS_TO_STRING } from "@core/functions/func";
import icon from "@icon/icon";
import { ComponentManager } from "@manager/ComponentManager";

export class TextLayer extends Layer {

  getIcon () {
    return icon.title;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'text',
      name: "New Text",
      elementType: 'p',
      content: '',
      ...obj
    });
  }
  enableHasChildren() {
    return false; 
  }

  getDefaultTitle() {
    return "Text";
  } 

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      content: this.json.content
    }
  }


  toCSS() {

    var css = super.toCSS()

    css.margin = css.margin || '0px'

    return css
  }

  toNestedCSS() {
    
    return [
      { selector: '> *', cssText: `
          pointer-events: none;
        `
      }
    ]
  }  


  get svg () {
    var x = this.json.x.value;
    var y = this.json.y.value;
    return this.toSVG(x, y);
  }  

  toSVG(x, y) {
    var {width, height, content} = this.json;
    var css = this.toCSS();

    delete css.left;
    delete css.top;
    if (css.position === 'absolute') {
      delete css.position; 
    }

    return /*html*/`
    <g transform="translate(${x}, ${y})">
    ${this.toDefString}
      <foreignObject ${OBJECT_TO_PROPERTY({ 
        width: width.value,
        height: height.value
      })}>
        <div xmlns="http://www.w3.org/1999/xhtml">
          <p style="${CSS_TO_STRING(css)}" >${content}</p>
        </div>
      </foreignObject>    
    </g>
`
  }  


}
 
ComponentManager.registerComponent('text', TextLayer); 