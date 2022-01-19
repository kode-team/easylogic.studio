import { Length } from "el/editor/unit/Length";
import { PropertyItem } from "el/editor/items/PropertyItem";
import { convertMatches, reverseMatches } from "el/utils/parser";
import { isNumber } from "el/sapa/functions/func";

export class TextShadow extends PropertyItem {
  static parse(obj) {
    return new TextShadow(obj);
  }

  static parseStyle (str = '') {
    var results = convertMatches(str);

    str = str.trim();

    var textShadows = results.str.split(",").filter(it => it.trim()).map(shadow => {
      var values = shadow.trim().split(" ");

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
      offsetX: '0px',
      offsetY: '0px',
      blurRadius: '0px',
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

    if (isNumber(json.offsetX)) json.offsetX = Length.px(json.offsetX);
    else if (json.offsetX) json.offsetX = Length.parse(json.offsetX);

    if (isNumber(json.offsetY)) json.offsetY = Length.px(json.offsetY);
    else if (json.offsetY) json.offsetY = Length.parse(json.offsetY);

    if (isNumber(json.blurRadius)) json.blurRadius = Length.px(json.blurRadius);
    else if (json.blurRadius) json.blurRadius = Length.parse(json.blurRadius);

    return json 
  }


  toCSS() {
    return {
      "text-shadow": this.toString()
    };
  }

  toString() {
    var {offsetX, offsetY, blurRadius, color} = this.json;

    if (isNumber(offsetX)) offsetX = Length.px(offsetX);
    if (isNumber(offsetY)) offsetY = Length.px(offsetY);
    if (isNumber(blurRadius)) blurRadius = Length.px(blurRadius);

    return `${offsetX} ${offsetY} ${blurRadius} ${color}`;
  }
}
