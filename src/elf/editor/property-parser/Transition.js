import { Length } from "elf/editor/unit/Length";
import { PropertyItem } from "elf/editor/items/PropertyItem";
import {
  customParseConvertMatches,
  customParseReverseMatches,
} from "elf/utils/customParser";

const TRANSITION_TIMING_REG = /((cubic-bezier|steps)\(([^)]*)\))/gi;

export class Transition extends PropertyItem {
  static parse(obj) {
    return new Transition(obj);
  }

  getDefaultObject() {
    return {
      name: "all",
      duration: Length.second(0),
      timingFunction: "linear",
      delay: Length.second(0),
    };
  }

  toCloneObject() {
    return {
      name: this.json.name,
      duration: this.json.duration + "",
      timingFunction: this.json.timingFunction,
      delay: this.json.delay + "",
    };
  }

  toCSS() {
    return {
      transition: this.toString(),
    };
  }

  toString() {
    var json = this.json;

    return [json.name, json.duration, json.timingFunction, json.delay].join(
      " "
    );
  }

  static join(list) {
    return list.map((it) => new Transition(it).toString()).join(",");
  }

  static add(transition, item = {}) {
    const list = Transition.parseStyle(transition);
    list.push(Transition.parse(item));

    return Transition.join(list);
  }

  static remove(transition, removeIndex) {
    return Transition.filter(transition, (it, index) => {
      return removeIndex != index;
    });
  }

  static filter(transition, filterFunction) {
    return Transition.join(
      Transition.parseStyle(transition).filter((it) => filterFunction(it))
    );
  }

  static replace(transition, replaceIndex, valueObject) {
    var list = Transition.parseStyle(transition);

    if (list[replaceIndex]) {
      list[replaceIndex] = valueObject;
    } else {
      list.push(valueObject);
    }

    return Transition.join(list);
  }

  static get(transition, index) {
    var arr = Transition.parseStyle(transition);

    return arr[index];
  }

  static parseStyle(transition) {
    var list = [];

    if (!transition) return list;

    const result = customParseConvertMatches(transition, TRANSITION_TIMING_REG);
    list = result.str.split(",").map((it) => {
      const fields = it.split(" ").filter(Boolean);

      if (fields.length >= 4) {
        /* @keyframes duration | timing-function | delay | 
          iteration-count | direction | fill-mode | play-state | name */
        //animation: 3s ease-in 1s 2 reverse both paused slidein;
        return {
          name: fields[0],
          duration: Length.parse(fields[1]),
          timingFunction: customParseReverseMatches(fields[2], result.matches),
          delay: Length.parse(fields[3]),
        };
      } else if (fields.length >= 3) {
        /* @keyframes duration | timing-function | delay | name */
        //animation: 3s linear 1s slidein;
        return {
          name: fields[0],
          duration: Length.parse(fields[1]),
          delay: Length.parse(fields[2]),
        };
      } else if (fields.length >= 1) {
        /* @keyframes duration | name */
        //animation: 3s slidein;
        return {
          name: fields[0],
          duration: Length.parse(fields[1]),
        };
      } else {
        return {};
      }
    });

    return list.map((it) => Transition.parse(it));
  }
}
