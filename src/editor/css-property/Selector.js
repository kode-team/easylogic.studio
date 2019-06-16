import { Property } from "../items/Property";
import { EMPTY_STRING, NEW_LINE } from "../../util/css/types";

export class Selector extends Property {
  static parse(obj) {
    return new Selector(obj);
  }


  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "selector",
      selector: '',
      properties: []
    });
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
          return EMPTY_STRING;
        }
      }
    }).join(NEW_LINE)
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
