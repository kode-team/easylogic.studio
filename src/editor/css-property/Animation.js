import { Length } from "../unit/Length";
import { Property } from "../items/Property";


export class Animation extends Property {
  static parse(obj) {
    return new Animation(obj);
  }

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "animation",
      checked: true, 
      name: 'none',
      direction: 'normal',
      duration: Length.second(0),
      timingFunction: 'ease',
      delay: Length.second(0),
      iterationCount: Length.string('infinite'),
      playState: 'running',
      fillMode: 'none'
    });
  }

  convert(json) {
    json = super.convert(json)

    json.duration = Length.parse(json.duration);
    json.iterationCount = Length.parse(json.iterationCount);
    return json 
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      checked: json.checked, 
      name: json.name,
      direction: json.direction,
      duration: json.duration+'',
      timingFunction: json.timingFunction,
      delay: json.delay,
      iterationCount: json.iterationCount + "",
      playState: json.playState,
      fillMode: json.fillMode
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
      json.name,
      json.duration,
      json.timingFunction,
      json.delay,
      json.iterationCount,
      json.direction,
      json.fillMode,
      json.playState
    ].join(' ')
  }
}
