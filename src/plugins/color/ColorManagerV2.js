import Color from "../../elf/utils/Color";
import HueColor from "../../elf/utils/HueColor";

export default class ColorManagerV2 {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.state = {
      rgb: {},
      hsl: {},
      hsv: {},
      alpha: 1,
      format: "hex",
      // colorSetsList: [
      //     {   name : "Material",
      //         edit: true,
      //         colors: [
      //             '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      //             '#2196F3', '#03A9F4', '#00BCD4',  '#009688', '#4CAF50',
      //             '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
      //             '#FF5722',  '#795548', '#9E9E9E', '#607D8B'
      //         ]
      //     },
      //     { name : "Custom", "edit" : true, "colors" : [ ] },
      //     { name: "Color Scale", "scale" : ['red', 'yellow', 'black' ], count : 5 }
      // ],
      // userList: [],
      // currentColorSets: {}
    };
  }

  get hsv() {
    return this.state.hsv;
  }

  get rgb() {
    return this.state.rgb;
  }

  get hsl() {
    return this.state.hsl;
  }

  get hex() {
    return this.state.hex;
  }

  get alpha() {
    if (typeof this.state.alpha === "undefined") return 1;
    return this.state.alpha;
  }

  get format() {
    return this.state.format;
  }

  changeFormat(format) {
    this.state.format = format;
  }

  initColor(colorObj) {
    this.changeColor(colorObj);
  }

  changeColor(colorObj) {
    colorObj = colorObj || "#FF0000";

    if (typeof colorObj === "string") {
      colorObj = Color.parse(colorObj);
    }

    this.state.alpha =
      typeof colorObj.a !== "undefined" ? colorObj.a : this.state.alpha;
    this.state.format =
      colorObj.type != "hsv"
        ? colorObj.type || this.state.format
        : this.state.format;

    // if (this.state.format == 'hex' && this.state.alpha < 1) {
    //     this.state.format = 'rgb';
    // }

    if (colorObj.type == "hsl") {
      this.state.hsl = { ...this.state.hsl, ...colorObj };
      this.state.rgb = Color.HSLtoRGB(this.state.hsl);
      this.state.hsv = Color.HSLtoHSV(colorObj);
    } else if (colorObj.type == "hex") {
      this.state.rgb = { ...this.state.rgb, ...colorObj };
      this.state.hsl = Color.RGBtoHSL(this.state.rgb);
      this.state.hsv = Color.RGBtoHSV(colorObj);
    } else if (colorObj.type == "rgb") {
      this.state.rgb = { ...this.state.rgb, ...colorObj };
      this.state.hsl = Color.RGBtoHSL(this.state.rgb);
      this.state.hsv = Color.RGBtoHSV(colorObj);
    } else if (colorObj.type == "hsv") {
      this.state.hsv = { ...this.state.hsv, ...colorObj };
      this.state.rgb = Color.HSVtoRGB(this.state.hsv);
      this.state.hsl = Color.HSVtoHSL(this.state.hsv);
    }
  }

  getHueColor() {
    return HueColor.checkHueColor(this.state.hsv.h / 360);
  }

  toString(type) {
    type = type || this.state.format;
    var colorObj = this.state[type] || this.state.rgb;
    return Color.format({ ...colorObj, a: this.state.alpha }, type);
  }

  toColor(type) {
    type = (type || this.state.format).toLowerCase();
    return this.toString(type);
  }

  // /** manager for colorsets */

  // setUserPalette(list) {
  //     this.state.userList = list || [];

  //     this.resetUserPalette();
  //     this.setCurrentColorSets();
  // }

  // resetUserPalette () {

  //     this.state.userList = this.state.userList.map( (element, index) => {

  //         if (isFunction( element.colors )) {
  //             const makeCallback = element.colors;

  //             element.colors = makeCallback(this.state);
  //             element._colors = makeCallback;
  //         }

  //         return {
  //             name: `color-${index}`,
  //             colors : [],
  //             ...element
  //         }
  //     })

  // }

  // setCurrentColorSets(nameOrIndex) {

  //     const _list = this.getUserList();

  //     if (isUndefined(nameOrIndex)) {
  //         this.state.currentColorSets = _list[0];
  //     } else if (isNumber(nameOrIndex)) {
  //         this.state.currentColorSets = _list[nameOrIndex];
  //     } else {
  //         this.state.currentColorSets = _list.filter(function (obj) {
  //             return obj.name == nameOrIndex;
  //         })[0];
  //     }
  // }

  // getCurrentColorSets () {
  //     return this.state.currentColorSets;
  // }

  // addCurrentColor (color) {
  //     if (Array.isArray(this.state.currentColorSets.colors)) {
  //         this.state.currentColorSets.colors.push(color);
  //     }
  // }

  // setCurrentColorAll (colors = []) {
  //     this.state.currentColorSets.colors = colors;
  // }

  // removeCurrentColor (index) {
  //     if (this.state.currentColorSets.colors[index]) {
  //         this.state.currentColorSets.colors.splice(index, 1);
  //     }
  // }

  // removeCurrentColorToTheRight (index) {
  //     if (this.state.currentColorSets.colors[index]) {
  //         this.state.currentColorSets.colors.splice(index, Number.MAX_VALUE);
  //     }
  // }

  // clearPalette () {
  //     if (this.state.currentColorSets.colors) {
  //         this.state.currentColorSets.colors = [];
  //     }
  // }

  // getUserList() {
  //     return Array.isArray(this.state.userList) && this.state.userList.length ? this.state.userList : this.state.colorSetsList;
  // }

  // getCurrentColors () {
  //     return this.getColors(this.state.currentColorSets)
  // }

  // getColors (element) {
  //     if (element.scale) {
  //         return Color.scale(element.scale, element.count);
  //     }

  //     return element.colors || [];
  // }

  // getColorSetsList () {
  //     return this.getUserList().map(element => {
  //        return {
  //            name : element.name,
  //            edit : element.edit,
  //            colors : this.getColors(element)
  //        }
  //     });
  // }
}
