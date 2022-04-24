import { CSS_TO_STRING, TAG_TO_STRING } from "elf/utils/func";
import { isFunction } from "sapa";

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

function modifyNewLine(str) {
  return str.replace(/;/gi, ";\n").trim();
}

export default class HTMLRenderer {
  /**
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    this.editor = editor;
  }

  get id() {
    return this.editor.EDITOR_ID;
  }

  getDefaultRendererInstance() {
    return this.editor.getRendererInstance("html", "rect");
  }

  getRendererInstance(item) {
    return (
      this.editor.getRendererInstance("html", item.itemType) ||
      this.getDefaultRendererInstance() ||
      item
    );
  }

  /**
   *
   * @param {BaseModel} item
   */
  render(item, renderer) {
    if (!item) return;
    const currentRenderer = this.getRendererInstance(item);

    if (currentRenderer) {
      return currentRenderer.render(item, renderer || this);
    }
  }

  renderSVG(item, renderer) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.renderSVG)) {
      return currentRenderer.renderSVG(item, renderer || this);
    }

    return this.getDefaultRendererInstance().renderSVG(item, renderer || this);
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
  toStyle(item, renderer) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.toStyle)) {
      return currentRenderer.toStyle(item, renderer || this);
    }

    return this.getDefaultRendererInstance().toStyle(item, renderer || this);
  }

  toStyleData(item, renderer) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.toStyleData)) {
      return currentRenderer.toStyleData(item, renderer || this);
    }

    return this.getDefaultRendererInstance().toStyleData(
      item,
      renderer || this
    );
  }

  /**
   *
   * 렌더링 될 style 태그를 리턴한다.
   *
   * @param {BaseModel} item
   */
  toExportStyle(item, renderer) {
    const currentRenderer = this.getRendererInstance(item);

    if (isFunction(currentRenderer.toExportStyle)) {
      return currentRenderer.toExportStyle(item, renderer || this);
    }

    return this.getDefaultRendererInstance().toExportStyle(
      item,
      renderer || this
    );
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

    const currentProject = item.top;
    let keyframeCode = modifyNewLine(
      filterKeyName(currentProject ? currentProject.toKeyframeString() : "")
    );
    let rootVariable = currentProject
      ? CSS_TO_STRING(currentProject.toRootVariableCSS())
      : "";
    // let svgCode = this.renderSVG(currentProject);
    // svgCode = svgCode.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')

    const current = item;
    const cssCode = filterKeyName(
      current ? TAG_TO_STRING(CSS_TO_STRING(this.toCSS(current))) : ""
    );
    const nestedCssCode = current
      ? this.toNestedCSS(current).map((it) => {
          var cssText = it.cssText ? it.cssText : CSS_TO_STRING(it.css);
          return `${it.selector} { 
    ${filterKeyName(TAG_TO_STRING(cssText), "&nbsp;&nbsp;")}
    }`;
        })
      : [];
    const selectorCode = current ? current.selectors : [];

    return /*html*/ `
<div >

${cssCode && /*html*/ `<div><pre title='CSS'>${cssCode}</pre></div>`}

${nestedCssCode
  .map((it) => {
    return /*html*/ `<div><pre title='CSS'>${it}</pre></div>`;
  })
  .join("")}

${
  (selectorCode || []).length
    ? /*html*/ `<div>
    ${selectorCode
      .map((selector) => {
        return `<pre title='${
          selector.selector
        }'>${selector.toPropertyString()}</pre>`;
      })
      .join("")}
    
    </div>`
    : ""
}

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
