import { isFunction } from "sapa";

import { CSS_TO_STRING, TAG_TO_STRING } from "elf/core/func";
import { uuid } from "elf/core/math";

const char_list = [/\(/gi, /\)/gi];

const function_list =
  "grayscale,matrix,rotateZ,blur,sepia,linear-gradient,radial-gradient,conic-gradient,circle,inset,polygon,rgb"
    .split(",")
    .map((it) => {
      return new RegExp(it, "gi");
    });
const keyword_list =
  "butt,miter,start,at,black,repeat,lighten,multiply,solid,border-box,visible,absolute,relative,auto"
    .split(",")
    .map((it) => {
      return new RegExp(it, "gi");
    });

function replaceKeyword(str) {
  keyword_list.forEach((ke) => {
    str = str.replace(ke, (str) => {
      return `<span class="keyword">${str}</span>`;
    });
  });

  function_list.forEach((ke) => {
    str = str.replace(ke, (str) => {
      return `<span class="function">${str}</span>`;
    });
  });

  char_list.forEach((ke) => {
    str = str.replace(ke, (str) => {
      return `<span class="char">${str}</span>`;
    });
  });

  return str;
}

function filterKeyName(str) {
  return str
    .split(";")
    .filter((it) => it.trim())
    .map((it) => {
      it = it.trim();
      var [key, value] = it.split(":").map((it) => it.trim());

      if (value === "") {
        return "";
      }

      return /*html*/ `<div class="block"><strong>${key}</strong><span>:&nbsp;</span><span class="value">${replaceKeyword(
        value
      )}</span><span>;</span></div>`;
    })
    .join("")
    .trim();
}

export default class HTMLRenderer {
  #id;
  #renderers = {};
  /**
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    this.editor = editor;
    this.#id = uuid();
  }

  setRendererType(itemType, renderInstance) {
    renderInstance.setRenderer(this);
    this.#renderers[itemType] = renderInstance;
  }

  get id() {
    return this.#id;
  }

  getDefaultRendererInstance() {
    return this.#renderers["rect"];
  }

  getRendererInstance(item) {
    const currentRenderer =
      this.#renderers[item.itemType] ||
      this.editor.getRendererInstance("html", item.itemType) ||
      this.getDefaultRendererInstance() ||
      item;

    currentRenderer.setRenderer(this);

    return currentRenderer;
  }

  /**
   *
   * @param {BaseModel} item
   */
  render(item) {
    if (!item) return;
    const currentRenderer = this.getRendererInstance(item);

    if (currentRenderer) {
      return currentRenderer.render(item);
    }
  }

  renderSVG(item) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.renderSVG)) {
      return currentRenderer.renderSVG(item);
    }

    return this.getDefaultRendererInstance().renderSVG(item);
  }

  to(type, item) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer[type])) {
      return currentRenderer[type].call(currentRenderer, item);
    }

    const defaultInstance = this.getDefaultRendererInstance();

    if (isFunction(defaultInstance[type])) {
      return defaultInstance[type].call(defaultInstance, item);
    }
  }

  /**
   * css 속성을 리턴해준다.
   *
   * @param {BaseModel} item
   * @param {object} [omit={}] 제거할 필드 적용
   */
  toCSS(item, omit = {}) {
    const css = this.to("toCSS", item);

    Object.keys(omit).forEach((key) => {
      delete css[key];
    });

    return css;
  }

  toKeyframeCSS(item) {
    return this.to("toKeyframeCSS", item);
  }

  /**
   *
   * @param {BaseModel} item
   */
  toNestedCSS(item) {
    return this.to("toNestedCSS", item);
  }

  /**
   *
   * @param {BaseModel} item
   */
  toTransformCSS(item) {
    return this.to("toTransformCSS", item);
  }

  toGridLayoutCSS(item) {
    return this.to("toGridLayoutCSS", item);
  }

  toLayoutItemCSS(item) {
    return this.to("toLayoutItemCSS", item);
  }

  toLayoutBaseModelCSS(item) {
    return this.to("toLayoutBaseModelCSS", item);
  }
  /**
   *
   * 렌더링 될 style 태그를 리턴한다.
   *
   * @param {BaseModel} item
   */
  toStyle(item) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.toStyle)) {
      return currentRenderer.toStyle(item);
    }

    return this.getDefaultRendererInstance().toStyle(item);
  }

  toStyleData(item) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.toStyleData)) {
      return currentRenderer.toStyleData(item);
    }

    return this.getDefaultRendererInstance().toStyleData(item);
  }

  /**
   *
   * 렌더링 될 style 태그를 리턴한다.
   *
   * @param {BaseModel} item
   */
  toExportStyle(item) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.toExportStyle)) {
      return currentRenderer.toExportStyle(item);
    }

    return this.getDefaultRendererInstance().toExportStyle(item);
  }

  /**
   *
   * @param {BaseModel} item
   * @param {Dom} currentElement
   */
  update(item, currentElement, editor) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.update)) {
      return currentRenderer.update(item, currentElement, editor);
    }

    return this.getDefaultRendererInstance().update(
      item,
      currentElement,
      editor
    );
  }

  /**
   * 코드 뷰용 HTML 코드를 렌더링 한다.
   * @param {BaseModel} item
   */
  codeview(item) {
    if (!item) {
      return "";
    }

    const currentProject = item.project;
    let rootVariable = currentProject
      ? CSS_TO_STRING(currentProject.toRootVariableCSS())
      : "";
    // let svgCode = this.renderSVG(currentProject);
    // svgCode = svgCode.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')

    const current = item;
    const cssCode = filterKeyName(
      current ? TAG_TO_STRING(CSS_TO_STRING(this.toCSS(current))) : ""
    );
    const keyframeCode = this.toKeyframeCSS(current);
    const nestedCssCode = current
      ? this.toNestedCSS(current).map((it) => {
          var cssText = it.cssText ? it.cssText : CSS_TO_STRING(it.css);
          return `${it.selector} { 
    ${filterKeyName(TAG_TO_STRING(cssText), "&nbsp;&nbsp;")}
    }`;
        })
      : [];
    // const selectorCode = current ? current.selectors : [];

    return /*html*/ `
<div >

${cssCode && /*html*/ `<div><pre title='CSS'>${cssCode}</pre></div>`}

${nestedCssCode
  .map((it) => {
    return /*html*/ `<div><pre title='CSS'>${it}</pre></div>`;
  })
  .join("")}

${
  keyframeCode &&
  /*html*/ `<div><pre title='Keyframe'>${keyframeCode}</pre></div>`
}

${
  rootVariable
    ? /*html*/ `<div>
    <label>:root</label>
    <pre>${rootVariable}</pre>
    </div>`
    : ""
}

</div>
        `;
  }
}
