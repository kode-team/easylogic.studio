import { Length } from "../unit/Length";
import { Property } from "../items/Property";
import { WHITE_STRING } from "../../util/css/types";

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
      timingFunction: 'linear',
      delay: Length.second(0),
      iterationCount: new Length('0', 'infinite'),
      playState: 'paused',
      fillMode: 'none'
    });
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
    ].join(WHITE_STRING)
  }
}
