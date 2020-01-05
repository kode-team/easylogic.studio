import { Layer } from "../Layer";
import Dom from "../../../util/Dom";
import { OBJECT_TO_PROPERTY, CSS_TO_STRING } from "../../../util/functions/func";
import { editor } from "../../editor";
import icon from "../../../csseditor/ui/icon/icon";

export class ImageLayer extends Layer {

  static getIcon () {
    return icon.image;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'image',
      name: "New Image",
      elementType: 'image',
      src: '',
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }
 

  getDefaultTitle() {
    return "Image";
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      src: this.json.src + ''
    }
  }

  resize() {
    this.reset({
      width: this.json.naturalWidth.clone(),
      height: this.json.naturalHeight.clone()
    })

  }


  updateFunction (currentElement, isChangeFragment = true) {
    var {src} = this.json;     

    if (isChangeFragment) {
      currentElement.attr('src', src);

      var $svg = currentElement.parent().$(`[data-id="${this.innerSVGId}"]`);  

      if ($svg) {
        var $defs = $svg.$('defs');
        $defs.html(this.toDefInnerString)          
      } else {
        var defString = this.toDefString
        if (defString) {
          var $el = Dom.createByHTML(defString);
          currentElement.parent().prepend($el);
        }

      }

    }

  }      

  get html () {
    var {id, src, itemType} = this.json;

    return /*html*/`<img class='element-item ${itemType}' data-id="${id}" src='${src}' />`
  }

  get svg () {
    var x = this.json.x.value;
    var y = this.json.y.value;
    return this.toSVG(x, y);
  }

  toSVG (x, y) {
    var {width, height, src} = this.json;
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
        height: height.value,
        overflow: 'visible'
      })}>
        <div xmlns="http://www.w3.org/1999/xhtml">
          <img style="${CSS_TO_STRING(css)}" src="${src} "/>
        </div>
      </foreignObject>    
    </g>
`
  }     

}
 
editor.registerComponent('image', ImageLayer);