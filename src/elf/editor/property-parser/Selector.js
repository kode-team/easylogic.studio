import { PropertyItem } from "elf/editor/items/PropertyItem";

export class Selector extends PropertyItem {
  static parse(obj) {
    return new Selector(obj);
  }

  getDefaultObject(obj) {
    return super.getDefaultObject({
      itemType: "selector",
      selector: "",
      properties: [],
      ...obj,
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs("selector", "properties"),
    };
  }

  isMultiStyle(key) {
    switch (key) {
      case "background-image":
      case "var":
        return true;
    }

    return false;
  }

  getMultiStyleString(p) {
    switch (p.key) {
      case "background-image":
        return p.value.toString() + ";";
    }

    return p.value.toString() + " !important;";
  }

  toPropertyString() {
    return this.json.properties
      .map((p) => {
        if (this.isMultiStyle(p.key)) {
          return this.getMultiStyleString(p);
        } else {
          var value = p.value.toString();

          if (value) {
            var key = p.key;

            if (key === "x") key = "left";
            else if (key === "y") key = "top";

            return `${key}: ${value} !important;`;
          } else {
            return "";
          }
        }
      })
      .join("\n");
  }

  toCSSText(prefix = "") {
    return `${prefix}${this.json.selector} {
    ${this.toPropertyString()}
}`;
  }

  toCSS() {
    return {};
  }

  toString(prefix = "") {
    return this.toCSSText(prefix);
  }
}
