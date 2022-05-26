import { isArray } from "sapa";

export class MenuManager {
  constructor(editor) {
    this.editor = editor;
    this.menus = {};
  }

  /**
   *
   * 특정 영역에 들어갈 메뉴를 추가한다.
   *
   * @param {string} target
   * @param {object | object[]} obj
   * @param {number} order
   */
  // eslint-disable-next-line no-unused-vars
  registerMenu(target, obj = [], order = 1) {
    if (!this.menus[target]) {
      this.menus[target] = [];
    }

    if (!isArray(obj)) {
      obj = [obj];
    }

    obj.forEach((it) => {
      this.menus[target].push(it);
    });

    this.editor.emit("updateMenu", target);
  }

  getTargetMenu(target, sort = "asc") {
    if (sort === "desc") {
      return this.menus[target].reverse();
    }

    return this.menus[target] || [];
  }
}
