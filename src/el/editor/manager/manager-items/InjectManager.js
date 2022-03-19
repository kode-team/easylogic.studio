import { createComponent } from "el/sapa/functions/jsx";

export class InjectManager {
  constructor(editor) {
    this.editor = editor;
    this.ui = {}
  }

  /**
   * 
   * 특정 영역에 들어갈 메뉴를 추가한다.
   * 
   * @param {string} target 
   * @param {object} obj 
   */
  registerUI(target, obj = {}) {

    if (!this.ui[target]) {
      this.ui[target] = []
    }

    Object.keys(obj).forEach(refClass => {
      this.ui[target].push({
        refClass,
        class: obj[refClass]
      })
    })
  }

  getTargetUI(target) {
    return this.ui[target] || [];
  }

  /**
   * target 별 Object 를 나열해준다. 
   * 
   * @param {string} target 
   * @returns {string}
   */
  generate(target, hasRef = false) {
    return this.getTargetUI(target).map(it => {
      const props = {}

      if (hasRef) {
        props.ref = `$${it.refClass}`
      }

      return createComponent(it.refClass, props);
    }).join('\n')
  }
};
