export class InjectManager {
  constructor(editor) {
    this.editor = editor;
    this.menuItems = {}
  }

  /**
   * 
   * 특정 영역에 들어갈 메뉴를 추가한다.
   * 
   * @param {string} target 
   * @param {object} obj 
   */
  registerMenuItem(target, obj) {

    if (!this.menuItems[target]) {
      this.menuItems[target] = []
    }

    Object.keys(obj).forEach(refClass => {
      this.menuItems[target].push({
        refClass,
        class: obj[refClass]
      })
    })
  }

  getTargetMenuItems(target) {
    return this.menuItems[target] || [];
  }

  /**
   * target 별 Object 를 나열해준다. 
   * 
   * @param {string} target 
   * @returns 
   */
  generate(target, hasRef = false) {
    return this.getTargetMenuItems(target).map(it => {

      const refString = hasRef ? `ref="$${it.refClass}"` : "";

      return /*html*/`<object refClass="${it.refClass}" ${refString} />`
    }).join('\n')
  }
};
