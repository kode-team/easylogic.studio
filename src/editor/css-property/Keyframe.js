import { Property } from "../items/Property";
import { html } from "../../util/functions/func";
import { Offset } from "./Offset";
import { NEW_LINE, EMPTY_STRING } from "../../util/css/types";

export class Keyframe extends Property {
  static parse(obj) {
    return new Keyframe(obj);
  }

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "keyframe",
      name: 'sample',
      offsets: []
    });
  }

  isMultiStyle (key) {
    switch (key) {
    case 'background-image': 
      return true;
    }

    return false;
  }

  toCSSText () {

    var offsets = this.json.offsets.map(it => {
      return it
    });
    
    offsets.sort((a, b) => {
      return a.offset.value > b.offset.value ? 1 : -1; 
    })

    return html`
    @keyframes ${this.json.name} {

      ${offsets.map(it => {
        if (it.properties.length === 0) return EMPTY_STRING
        return html`${it.offset.toString()} {
          ${it.properties.map(p => {
            if (this.isMultiStyle(p.key)) {
              return p.value.toString() + ';'
            } else {
              return `${p.key}: ${p.value.toString()};`
            }

          }).join(EMPTY_STRING)}
        }
        
        `
      })}

    }
    `
  }

  
  createOffset(data = {}) {
    return this.addOffset(
      new Offset({
        checked: true,
        ...data
      })
    );

  } 

  addOffset (offset) {
    this.json.offsets.push(offset);
  }
  
  
  removeOffset(removeIndex) {
    this.json.offsets.splice(removeIndex, 1);
  }    


  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }
  
  sortOffset(startIndex, targetIndex) {
    this.sortItem(this.json.offsets, startIndex, targetIndex);
  }     


  updateOffset(index, data = {}) {
    this.json.offsets[+index].reset(data);
  }        


  toCSS() {
    return {};
  }

  toString() {
    return this.toCSSText()
  }
}
