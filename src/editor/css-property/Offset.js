import { Property } from "../items/Property";
import { html, CSS_TO_STRING } from "../../util/functions/func";
import { Length } from "../unit/Length";

export class Offset extends Property {
  static parse(obj) {
    return new Offset(obj);
  }

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "offset",
      offset: Length.percent(0),
      color: 'rgba(0, 0, 0, 1)',
      properties: []
    });
  }

  toCSSText() {
    return `${this.json.offset} ${CSS_TO_STRING(this.toCSS())}`
  }

  createProperty(data = {}) {
    return this.addProperty({
      checked: true,
      value: Length.px(0),
      ...data
    });
  } 

  addProperty (property) {
    this.json.properties.push(property);
  }
  
  
  removeProperty(removeIndex) {
    this.json.properties.splice(removeIndex, 1);
  }    


  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }
  
  sortProperty(startIndex, targetIndex) {
    this.sortItem(this.json.properties, startIndex, targetIndex);
  }     


  updateProperty(index, data = {}) {
    Object.assign(this.json.properties[+index], { ... data } );
  }

  updatePropertyByKey(key, data = {}) {
    var arr = this.json.properties;
    var index = -1; 
    for(var i = 0, len = arr.length; i < len; i++) {
      if (this.json.properties[i].key === key) {
        index = i; 
        break; 
      }
    }
    
    Object.assign(this.json.properties[+index], { ... data } );
  }

  toCSS() {
    var obj = {}

    this.json.properties.forEach(it => {
      obj = { ...obj, ...it.toCSS() }
    })

    return obj;
  }

  toString() {
    return this.toCSSText()
  }
}
