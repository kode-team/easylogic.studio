import { Length } from "./unit/Length";
import { CHANGE_SELECTION } from "../csseditor/types/event";
import { RectItem } from "./items/RectItem";

export class Selection {
  constructor(editor) {
    this.editor = editor;

    this.items = [];
    this.currentRect = null;
  }

  initialize() {
    this.items = [];
  }

  /**
   * get first item instance
   */
  get current() {
    return this.items[0]
  }


  select(...args) {
    this.items = args || []; 

    this.initRect();
  }


  initRect() {
    this.currentRect = this.rect();
  }

  rect() {
    var minX = Number.MAX_SAFE_INTEGER;
    var minY = Number.MAX_SAFE_INTEGER;
    var maxX = Number.MIN_SAFE_INTEGER;
    var maxY = Number.MIN_SAFE_INTEGER;

    this.items.forEach(item => {
      if (!item.screenX) return;

      var x = item.screenX.value;
      var y = item.screenY.value;
      var x2 = item.screenX2.value;
      var y2 = item.screenY2.value;

      if (minX > x) minX = x;
      if (minY > y) minY = y;
      if (maxX < x2) maxX = x2;
      if (maxY < y2) maxY = y2;
    });

    if (!this.items.length) {
      minX = 0;
      minY = 0;
      maxX = 0;
      maxY = 0;
    }

    var x = minX;
    var y = minY;
    var x2 = maxX;
    var y2 = maxY;

    var width = x2 - x;
    var height = y2 - y;

    x = Length.px(x);
    y = Length.px(y);
    width = Length.px(width);
    height = Length.px(height);

    return new RectItem({ x, y, width, height });
  }
}
