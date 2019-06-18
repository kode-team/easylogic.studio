import { EMPTY_STRING } from "../../util/css/types";
import { Length } from "../unit/Length";
import { Property } from "../items/Property";
import { convertMatches } from "../../util/functions/parser";

export class BoxShadow extends Property {
  static parse(obj) {
    return new BoxShadow(obj);
  }

  static parseStyle (str) {

      var boxShadows = [];

      if (!str) return boxShadows;

      var results = convertMatches(str);

      boxShadows = results.str.split(",").filter(it => it.trim()).map(shadow => {
        var values = shadow.split(" ");

        var insets = values.filter(it => it === "inset");
        var colors = values
          .filter(it => it.includes("@"))
          .map(it => {
            return results.matches[+it.replace("@", "")].color;
          });

        var numbers = values.filter(it => {
          return it !== "inset" && !it.includes("@");
        });

        return BoxShadow.parse({
          inset: !!insets.length,
          color: colors[0] || "rgba(0, 0, 0, 1)",
          offsetX: Length.parse(numbers[0] || "0px"),
          offsetY: Length.parse(numbers[1] || "0px"),
          blurRadius: Length.parse(numbers[2] || "0px"),
          spreadRadius: Length.parse(numbers[3] || "0px")
        });
      });
  
      return boxShadows;
  }

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "box-shadow",
      inset: false,
      offsetX: Length.px(0),
      offsetY: Length.px(0),
      blurRadius: Length.px(0),
      spreadRadius: Length.px(0),
      color: "rgba(0, 0, 0, 1)"
    });
  }

  toCSS() {
    return {
      "box-shadow": this.toString()
    };
  }

  toString() {
    var json = this.json;

    return `${json.inset ? "inset " : EMPTY_STRING}${json.offsetX} ${
      json.offsetY
    } ${json.blurRadius} ${json.spreadRadius} ${json.color}`;
  }
}
