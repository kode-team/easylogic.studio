import { Length } from "../unit/Length";
import { Property } from "../items/Property";


export class Transition extends Property {
  static parse(obj) {
    return new Transition(obj);
  }

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "transition",
      checked: true, 
      property: 'all',
      duration: Length.second(0),
      timingFunction: 'ease',
      delay: Length.second(0)
    });
  }

  toCSS() {
    return {
      "transition": this.toString()
    };
  }

  toString() {
    var json = this.json;

    return [
      json.property,
      json.duration,
      json.timingFunction,
      json.delay
    ].join(' ')
  }
}
