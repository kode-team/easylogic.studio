import { Property } from "../items/Property";
import { Length } from "../unit/Length";


export class Display extends Property {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "display",

      type: "block",

      // refer to https://developer.mozilla.org/docs/Web/CSS/flex-direction
      direction: "row",

      // refer to https://developer.mozilla.org/docs/Web/CSS/align-items
      alignItems: "normal",

      // refer to https://developer.mozilla.org/docs/Web/CSS/align-content
      alignCentent: "normal",

      // refer to https://developer.mozilla.org/docs/Web/CSS/flex-wrap
      flexWrap: "nowrap",

      justifyContent: "flex-start",

      gap: Length.px(0),

      rowGap: Length.percent(1),

      columnGap: Length.percent(1),

      columns: [Length.fr(1)],

      rows: [Length.fr(1)],

      areas: []
    });
  }

  toCSS() {
    var json = this.json;
    var css = {
      display: json.type
    };

    if (css.display == "flex") {
      if (json.direction != "row") {
        css["flex-direction"] = json.direction;
      }

      if (json.alignItems != "normal") {
        css["align-items"] = json.alignItems;
      }

      if (json.alignContent != "normal") {
        css["align-content"] = json.alignContent;
      }

      if (json.flexWrap != "nowrap") {
        css["flex-wrap"] = json.flexWrap;
      }

      if (json.justifyContent != "flex-start") {
        css["justify-content"] = json.justifyContent;
      }
    } else if (css.display == "grid") {
      if (json.gap.value > 0) {
        css["grid-gap"] = json.gap;
      }

      if (json.rowGap.value > 0) {
        css["grid-row-gap"] = json.rowGap;
      }

      if (json.columnGap.value > 0) {
        css["grid-column-gap"] = json.columnGap;
      }

      if (json.columns.length) {
        css["grid-template-columns"] = json.columns.join(' ');
      }

      if (json.rows.length) {
        css["grid-template-rows"] = json.rows.join(' ');
      }

      if (json.areas.length) {
        css["grid-template-areas"] = json.areas
          .map(it => `"${it.join(' ')}"`)
          .join(' ');
      }
      if (json.alignItems != "normal") {
        css["align-items"] = json.alignItems;
      }

      if (json.alignContent != "normal") {
        css["align-content"] = json.alignContent;
      }
      if (json.justifyContent != "flex-start") {
        css["justify-content"] = json.justifyContent;
      }
    }

    return css;
  }

  isLayout() {
    return this.isGrid() || this.isFlex();
  }

  isFlex() {
    return this.json.type == "flex";
  }

  isGrid() {
    return this.json.type == "grid";
  }

  isInline() {
    return this.json.type == "inline";
  }

  isInlineBlock() {
    return this.json.type == "inline-block";
  }

  isBlock() {
    return this.json.type == "block";
  }

  changeColumn(sourceIndex, targetIndex) {
    var source = this.json.columns[sourceIndex];
    var target = this.json.columns[targetIndex];

    this.json.columns[targetIndex] = source;
    this.json.columns[sourceIndex] = target;
  }

  removeColumn(index) {
    this.json.columns.splice(index, 1);
  }

  updateColumn(index, len) {
    this.json.columns[index] = len;
  }

  changeRow(sourceIndex, targetIndex) {
    var source = this.json.rows[sourceIndex];
    var target = this.json.rows[targetIndex];

    this.json.rows[targetIndex] = source;
    this.json.rows[sourceIndex] = target;
  }

  removeRow(index) {
    this.json.rows.splice(index, 1);
  }

  updateRow(index, len) {
    this.json.rows[index] = len;
  }
}

Display.parse = obj => {
  return new Display(obj);
};

Display.isLayout = type => {
  return type == "flex" || type == "grid";
};
