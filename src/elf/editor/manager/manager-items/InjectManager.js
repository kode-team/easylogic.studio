import { isArray, createComponent, createElementJsx } from "sapa";

export class InjectManager {
  constructor(editor) {
    this.editor = editor;
    this.ui = {};
  }

  /**
   *
   * 특정 영역에 들어갈 메뉴를 추가한다.
   *
   * @param {string} target
   * @param {object} obj
   */
  registerUI(target, obj = {}, order = 1) {
    if (!this.ui[target]) {
      this.ui[target] = [];
    }

    Object.keys(obj).forEach((refClass) => {
      const targetClass = this.ui[target].find(
        (it) => it.refClass === refClass
      );

      if (targetClass) {
        targetClass.class = obj[refClass];
      } else {
        this.ui[target].push({
          refClass,
          order,
          class: obj[refClass],
        });
      }
    });
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
    const list = this.getTargetUI(target);

    list.sort((a, b) => {
      if (a.order === b.order) return 0;
      return a.order > b.order ? 1 : -1;
    });

    return list
      .map((it, index) => {
        if (isArray(it.class)) {
          return createElementJsx(...it.class);
        } else {
          const props = {};

          if (hasRef) {
            props.ref = `$${it.refClass}-${index}`;
          }
          return createComponent(it.refClass, props);
        }
      })
      .join("\n");
  }
}
