import { Property } from "../items/Property";
import { clone } from "../../util/functions/func";

export class Selector extends Property {
  static parse(obj) {
    return new Selector(obj);
  }


  getDefaultObject(obj) {
    return super.getDefaultObject({
      itemType: "selector",
      selector: '',
      properties: [],
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      selector: this.json.selector,
      properties: this.json.properties.map(p => {
        return clone(p)
      })
    }
  }

  isMultiStyle (key) {
    switch (key) {
    case 'background-image': 
    case 'var':
      return true;
    }

    return false;
  }

  getMultiStyleString (p) {
    switch(p.key) {
      case 'background-image': 
        return p.value.toString() + ';';
    }

    return p.value.toString() + ';'; 
  }

  toPropertyString () {
    return this.json.properties.map(p => {
      if (this.isMultiStyle(p.key)) {
        return this.getMultiStyleString(p)
      } else {
        var value = p.value.toString();

        if (value) {
          return `${p.key}: ${value};`
        } else {
          return '';
        }
      }
    }).join('\n')
  }

  toCSSText (prefix = '') {
  
    return `${prefix}${this.json.selector} {
    ${this.toPropertyString()}
}`
  }

  toCSS() {
    return {};
  }

  toString(prefix = '') {
    return this.toCSSText(prefix)
  }
}
