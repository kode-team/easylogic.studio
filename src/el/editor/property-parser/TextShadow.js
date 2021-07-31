import { Length } from "el/editor/unit/Length";
import { Property } from "el/editor/items/Property";
import { convertMatches, reverseMatches } from "el/utils/parser";

export class TextShadow extends Property {
  static parse(obj) {
    return new TextShadow(obj);
  }

  static parseStyle (str = '') {
    var results = convertMatches(str);

    var textShadows = results.str.split(",").filter(it => it.trim()).map(shadow => {
      var values = shadow.split(" ");

      var colors = values
        .filter(it => it.includes("@"))
        .map(it => {
          return reverseMatches(it, results.matches) || 'black';
        });

      var numbers = values.filter(it => {
        return !it.includes("@");
      });

      return TextShadow.parse({
        color: colors[0] || "rgba(0, 0, 0, 1)",
        offsetX: Length.parse(numbers[0] || "0px"),
        offsetY: Length.parse(numbers[1] || "0px"),
        blurRadius: Length.parse(numbers[2] || "0px")
      });
    });

    return textShadows;
  }


  static join (list) {
    return list.map(it => TextShadow.parse(it)).join(', ');
  }  

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "text-shadow",
      offsetX: Length.z(),
      offsetY: Length.z(),
      blurRadius: Length.z(),
      color: "rgba(0, 0, 0, 1)"
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('offsetX', 'offsetY', 'blurRadius', 'color')
    }
  }


  convert(json) {

    json = super.convert(json);

    json.offsetX = Length.parse(json.offsetX);
    json.offsetY = Length.parse(json.offsetY);
    json.blurRadius = Length.parse(json.blurRadius);

    return json 
  }


  toCSS() {
    return {
      "text-shadow": this.toString()
    };
  }

  toString() {
    var json = this.json;

    return `${json.offsetX} ${json.offsetY} ${json.blurRadius} ${json.color}`;
  }
}
