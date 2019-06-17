import { Property } from "../items/Property";
import { html } from "../../util/functions/func";
import { Offset } from "./Offset";
import { EMPTY_STRING, NEW_LINE_2, WHITE_STRING, NEW_LINE } from "../../util/css/types";
import { reverseMatches, convertMatches } from "../../util/functions/parser";
import { Length } from "../unit/Length";

export class Keyframe extends Property {
  static parse(obj) {
    return new Keyframe(obj);
  }


  /**
   * 
   * keyframe: {keyframeName} {offset} {property} {value} | ......
   * 
   * @param {} style 
   */
  static parseStyle (style) {
    var keyframes = []
    var keyframeKeys = {} 

    if (style['keyframe']) {
      var results = convertMatches(style["keyframe"]);

      results.str.split('|').map(it => it.trim()).forEach( (frameInfo, index) => {
        var [ name, offset, property, ...values ] = frameInfo.split(WHITE_STRING)
        var propertyValue = values.join(WHITE_STRING);

        if (!keyframeKeys[name]) {
          keyframeKeys[name] = new Keyframe({
            name
          })
          
          keyframes[index] = name; 
        }

        var filteredOffset = keyframeKeys[name].offsets.filter(it => {
          return it.offset.equals(Length.parse(offset))
        })

        var offsetObj = null;
        if (filteredOffset.length) {
          offsetObj = filteredOffset[0]
        } else {
          offsetObj = new Offset({
            offset: Length.parse(offset)
          })

          keyframeKeys[name].offsets.push(offsetObj)
        }

        offsetObj.addProperty({ 
          key: property, 
          value: reverseMatches(propertyValue, results.matches)
        })

      })
    }

    return keyframes.map(name => {

      keyframeKeys[name].offsets.forEach(offset => {
        var vars = [] 
        var properties = [] 
        offset.properties.forEach(p => {
          if (p.key.includes('--')) {
            vars.push(p);
          } else {
            properties.push(p);
          }
        })

        let varValue = vars.map(it => `${it.key}:${it.value}`).join(';')

        if (vars.length) {
          properties.push({ key: 'var', value: varValue })
        }

        offset.properties = properties
      })

      return keyframeKeys[name]
    });
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


  toOffsetString (it) {
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
    }`
  }  


  toOffsetText () {

    var offsets = this.json.offsets.map(it => {
      return it
    });
    
    offsets.sort((a, b) => {
      return a.offset.value > b.offset.value ? 1 : -1; 
    })


    return  offsets.map(it => {
      if (it.properties.length === 0) return EMPTY_STRING
      return this.toOffsetString(it);
    }).join(NEW_LINE)
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

  ${this.toOffsetText()}

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
