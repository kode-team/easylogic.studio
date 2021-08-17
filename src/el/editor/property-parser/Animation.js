import { Length } from "el/editor/unit/Length";
import { PropertyItem } from "el/editor/items/PropertyItem";
import { customParseConvertMatches, customParseReverseMatches } from "el/utils/customParser";

const ANIMATION_TIMING_REG = /((cubic-bezier|steps)\(([^\)]*)\))/gi;

export class Animation extends PropertyItem {
  static parse(obj) {
    return new Animation(obj);
  }

  getDefaultObject() {
    return {
      itemType: "animation",
      checked: true, 
      name: 'none',
      direction: 'normal',
      duration: Length.second(0),
      timingFunction: 'linear',
      delay: Length.second(0),
      iterationCount: Length.string('infinite'),
      playState: 'running',
      fillMode: 'none'
    };
  }

  convert(json) {
    json = super.convert(json)

    json.duration = Length.parse(json.duration);
    json.iterationCount = Length.parse(json.iterationCount);
    return json 
  }

  toCloneObject() {
    return {
      ...this.attrs(
        'name',
        'direction',
        'duration',
        'timingFunction',
        'delay',
        'iterationCount',
        'playState',
        'fillMode'
      )

    }
  }

  togglePlayState (forcedValue) {

    if (forcedValue) {
      this.reset({ playState: forcedValue === 'running' ? 'running' : 'paused' })
    } else {
      if (this.json.playState === 'paused') {
        this.reset({ playState: 'running' })
      } else {
        this.reset({ playState: 'paused' })
      }
    }

  }

  toCSS() {
    if (!this.json.name) return {}
    return {
      "animation": this.toString()
    };
  }

  toString() {
    var json = this.json;

    return [
      json.duration,
      json.timingFunction,
      json.delay,
      json.iterationCount,
      json.direction,
      json.fillMode,
      json.playState,
      json.name
    ].join(' ')
  }

  static join (list) {
    return list.map(it => new Animation(it).toString()).join(',')
  }

  static add (animation, item = {}) {
    const list = Animation.parseStyle(animation);
    list.push(Animation.parse(item))

    return Animation.join(list); 
  }

  static remove (animation, removeIndex) {
    return Animation.filter(animation, (it, index) => {
        return removeIndex != index; 
    })
  }

  static filter (animation, filterFunction) {
    return Animation.join(Animation.parseStyle(animation).filter(it => filterFunction(it)))
  }

  static replace (animation, replaceIndex, valueObject) {

    var list = Animation.parseStyle(animation)

    if (list[replaceIndex]) {
      list[replaceIndex] = valueObject;
    } else {
      list.push(valueObject);
    }

    return Animation.join(list);
  }

  static get (animation, index) {
    var arr = Animation.parseStyle(animation)

    return arr[index];
  }   


  static parseStyle (animation) {

    var list = [];

    if (!animation) return list;


    const result = customParseConvertMatches(animation, ANIMATION_TIMING_REG)
    list = result.str.split(',').map(it => {

      const fields = it.split(' ').filter(Boolean);

      if (fields.length >= 7 ) {
          /* @keyframes duration | timing-function | delay | 
          iteration-count | direction | fill-mode | play-state | name */
          //animation: 3s ease-in 1s 2 reverse both paused slidein;        
        return {
          duration: Length.parse(fields[0]),          
          timingFunction: customParseReverseMatches(fields[1], result.matches),          
          delay: Length.parse(fields[2]),          
          iterationCount: fields[3] === 'infinite' ? Length.string('infinite') : Length.parse(fields[3]),          
          direction: fields[4],
          fillMode: fields[5],
          playState: fields[6],
          name: fields[7]
        }
      } else if (fields.length >= 3) {
        /* @keyframes duration | timing-function | delay | name */
        //animation: 3s linear 1s slidein;        
        return {
          duration: Length.parse(fields[0]),          
          timingFunction: customParseReverseMatches(fields[1], result.matches),
          delay: Length.parse(fields[2]),          
          name: fields[3]
        }
      } else if (fields.length >= 1) {
        /* @keyframes duration | name */
        //animation: 3s slidein;        
        return {
          duration: Length.parse(fields[0]),          
          name: fields[1]
        }
      } else {
        return {}
      }
    })

    return list.map(it => Animation.parse(it));
  }  

}
