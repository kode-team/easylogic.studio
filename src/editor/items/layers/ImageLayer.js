import { Layer } from "../Layer";
import Dom from "../../../util/Dom";

export class ImageLayer extends Layer {
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
        currentElement.parent().prepend(Dom.createByHTML(this.toDefString));
      }

    }

  }      

  get html () {
    var {id, src, itemType} = this.json;

    return /*html*/`<img class='element-item ${itemType}' data-id="${id}" src='${src}' />`
  }

}
 