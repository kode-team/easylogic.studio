import { Property } from "../items/Property";
import { html, keyEach, keyMap } from "../../util/functions/func";
import { Offset } from "./Offset";
import { NEW_LINE, EMPTY_STRING, NEW_LINE_2 } from "../../util/css/types";
import { BackgroundImage } from "./BackgroundImage";

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
    case 'var':
      return true;
    }

    return false;
  }

  getMultiStyleString (p) {
    switch(p.key) {
      case 'background-image': 

        return p.value.toString() + ';';

        // var obj = {}

        // p.value.toString().split(';').filter(it => it.trim()).forEach(it => {
        //   var [property, value] = it.split(':')
        //   obj[property] = value 
        // })

        // var backgroundImages = BackgroundImage.parseStyle(obj)

        // var results = {

        // }

        // backgroundImages.forEach(it => {
        //   var temp = it.toBackgroundCSS()

        //   keyEach(temp, (k, v) => {
        //     if (!results[k]) {
        //       results[k] = []
        //     }

        //     results[k].push(v);
        //   })
        // })

        // return  keyMap(results, (k, v) => {
        //   return `${k}: ${v.join(',')};`
        // }).join(EMPTY_STRING)
    }


    return p.value.toString() + ';'; 
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
        return this.getMultiStyleString(p)
      } else {
        var value = p.value.toString();

        if (value) {
          return `${p.key}: ${value};`
        } else {
          return EMPTY_STRING;
        }
      }
    }).join(EMPTY_STRING)}
  }${NEW_LINE_2}`
  })}

}${NEW_LINE_2}
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
