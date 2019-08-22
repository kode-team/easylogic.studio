import { Layer } from "../Layer";

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


  updateFunction (currentElement) {
    var {src} = this.json;     
    currentElement.attr('src', src);
  }    

  get html () {
    var {id, src, itemType} = this.json;

    return `
      <img class='element-item ${itemType}' data-id="${id}" src='${src}' />
    `
  }

}
 