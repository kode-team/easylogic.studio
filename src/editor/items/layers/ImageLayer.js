import { Layer } from "../Layer";
import Dom from "../../../util/Dom";
import { CSS_TO_STRING } from "../../../util/functions/func";
import icon from "../../../csseditor/ui/icon/icon";
import { ComponentManager } from "../../manager/ComponentManager";

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

  getIcon() {
    return icon.image;
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
      currentElement.$('img').attr('src', src);

      var $svg = currentElement;  

      if ($svg) {
        var $defs = $svg.$('defs');
        if ($defs) {
          $defs.html(this.toDefInnerString)
        }
      } else {
        var defString = this.toDefString
        if (defString) {
          var $el = Dom.createByHTML(defString);
          currentElement.prepend($el);
        }

      }

    }

  }      


  toNestedCSS() {
    var json = this.json; 

    var css = {
      ...this.toKeyListCSS(
        'filter', 'mix-blend-mode', 'border-radius', 'background-color', 'opacity'
      ),      
      ...this.toClipPathCSS(),
      ...this.toBackgroundImageCSS(),
      ...this.toBorderCSS()
    }

    return [
      { selector: 'img', cssText: `
          width: 100%;
          height: 100%;
          pointer-events: none;
        `.trim()
      },
    ]
  }

  get html () {
    var {id, itemType, src} = this.json;

    return /*html*/`
      <div class='element-item ${itemType}' data-id="${id}">
        ${this.toDefString}
        <img src='${src}' />
      </div>`
  } 

  get svg () {
    var x = this.json.x.value;
    var y = this.json.y.value;
    return this.toSVG(x, y);
  }

  toSVG (x, y, isRoot = false) {
    var {width, height, src} = this.json;
    var css = this.toCSS();

    if (isRoot) {

      delete css.left;
      delete css.top;      
      if (css.position === 'absolute') {
        delete css.position; 
      }

      return this.wrapperRootSVG(x, y, width, height, /*html*/`
        <img style="${CSS_TO_STRING(css)}" src="${src} "/>
      `)

    } else {
      return /*html*/ `
        ${this.toDefString}      
        <img style="${CSS_TO_STRING(css)}" src="${src} "/>
      `
    }

  }     

}
 
ComponentManager.registerComponent('image', ImageLayer);