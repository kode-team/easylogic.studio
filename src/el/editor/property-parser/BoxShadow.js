
import { Length } from "el/editor/unit/Length";
import { PropertyItem } from "el/editor/items/PropertyItem";
import { convertMatches, reverseMatches } from "el/utils/parser";
import { BoxShadowStyle } from 'el/editor/types/model';
import { isNumber } from "el/sapa/functions/func";

export class BoxShadow extends PropertyItem {
  static parse(obj) {
    return new BoxShadow(obj);
  }

  static parseStyle (str) {

      var boxShadows = [];
      str = str.trim()

      if (!str) return boxShadows;

      var results = convertMatches(str);

      boxShadows = results.str.split(",").filter(it => it.trim()).map(shadow => {
        var values = shadow.trim().split(" ");

        var insets = values.filter(it => it === BoxShadowStyle.INSET);
        var colors = values
          .filter(it => it.includes("@"))
          .map(it => {
            return reverseMatches(it, results.matches);
          });

        var numbers = values.filter(it => {
          return it !== BoxShadowStyle.INSET && !it.includes("@");
        });

        return BoxShadow.parse({
          inset: !!insets.length ? BoxShadowStyle.INSET : BoxShadowStyle.OUTSET,
          color: colors[0] || "rgba(0, 0, 0, 1)",
          offsetX: Length.parse(numbers[0] || "0px"),
          offsetY: Length.parse(numbers[1] || "0px"),
          blurRadius: Length.parse(numbers[2] || "0px"),
          spreadRadius: Length.parse(numbers[3] || "0px")
        });
      });
  
      return boxShadows;
  }

  static join (list) {
    return list.map(it => BoxShadow.parse(it)).join(', ');
  }

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "box-shadow",
      inset: false,
      offsetX: 0,
      offsetY: 0,
      blurRadius: 0,
      spreadRadius: 0,
      color: "rgba(0, 0, 0, 1)"
    });
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'inset',
        'offsetX',
        'offsetY',
        'blurRadius',
        'spreadRadius',
        'color'
      )

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

    if (isNumber(json.spreadRadius)) json.spreadRadius = Length.px(json.spreadRadius);
    else if (json.spreadRadius) json.spreadRadius = Length.parse(json.spreadRadius);

    return json 
  }

  toCSS() {
    return {
      "box-shadow": this.toString()
    };
  }

  toString() {
    var json = this.json;

    return `${json.inset === BoxShadowStyle.INSET ? "inset " : ''}${json.offsetX} ${
      json.offsetY
    } ${json.blurRadius} ${json.spreadRadius} ${json.color}`;
  }
}
