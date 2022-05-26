import { Dom, isNotUndefined } from "sapa";

import ItemRender from "./ItemRender";

import { CSS_TO_STRING, STRING_TO_CSS } from "elf/core/func";
import { Grid } from "elf/editor/property-parser/Grid";
import { SVGFilter } from "elf/editor/property-parser/SVGFilter";
import {
  AlignItems,
  Constraints,
  ConstraintsDirection,
  FlexDirection,
  Layout,
  ResizingMode,
} from "elf/editor/types/model";
import { Length } from "elf/editor/unit/Length";

const WEBKIT_ATTRIBUTE_FOR_CSS = [
  "text-fill-color",
  "text-stroke-color",
  "text-stroke-width",
  "background-clip",
];

function valueFilter(obj) {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (isNotUndefined(obj[key])) {
      result[key] = obj[key];
    }
  });

  return result;
}

export default class DomRender extends ItemRender {
  /**
   *
   * @param {Item} item
   * @param {string} field
   */
  toStringPropertyCSS(item, field) {
    return STRING_TO_CSS(item.get(field));
  }

  /**
   *
   * @param {Item} item
   */
  toBackgroundImageCSS(item) {
    if (!item.cacheBackgroundImage) {
      item.setBackgroundImageCache();
    }

    // visibility 속성은 출력하지 않는다.
    return item.cacheBackgroundImage;
  }

  /**
   *
   * @param {Item} item
   */
  toLayoutCSS(item) {
    if (item.hasLayout()) {
      if (item.isLayout(Layout.FLEX)) {
        return this.toFlexLayoutCSS(item);
      } else if (item.isLayout(Layout.GRID)) {
        return this.toGridLayoutCSS(item);
      }
    }

    return {};
  }

  /**
   *
   * @param {Item} item
   */
  toLayoutItemCSS(item) {
    var parentLayout = item.parent?.["layout"];
    var obj = {};
    if (parentLayout === Layout.FLEX) {
      // 부모가  layout 이  지정 됐을 때 자식item 들은 position: relative 기준으로 동작한다. , left, top 은  속성에서 삭제
      obj = {
        position: "relative",
        left: "auto !important",
        top: "auto !important",
      };
    } else if (parentLayout === Layout.GRID) {
      // 부모가  layout 이  지정 됐을 때 자식item 들은 position: relative 기준으로 동작한다. , left, top 은  속성에서 삭제
      obj = {
        position: "relative",
        left: "auto",
        top: "auto",
      };
    } else if (parentLayout === Layout.DEFAULT) {
      obj = this.toDefaultLayoutItemCSS(item);
    }

    if (parentLayout === Layout.FLEX) {
      obj = {
        ...obj,
        "flex-basis": item.flexBasis,
        "flex-shrink": item.flexShrink,
      };

      // 자식의 경우 fill container 를 가질 수 있고
      // fill container 의 경우 flex-grow : 1 로 고정한다.
      // 부모의 flex-direction 에 따라 다르다.
      // 방향에 따라 flex-grow 가 정해지기 때문에 , 그에 따른 width, height 값이 auto  로 변경되어야 함
      const parentLayoutDirection = item?.parent?.flexDirection;
      if (
        parentLayoutDirection === FlexDirection.ROW &&
        item.resizingHorizontal === ResizingMode.FILL_CONTAINER
      ) {
        obj.width = "auto";
        obj["flex-grow"] = item.flexGrow || 1;
      } else if (
        parentLayoutDirection === FlexDirection.COLUMN &&
        item.resizingVertical === ResizingMode.FILL_CONTAINER
      ) {
        obj.height = "auto";
        obj["flex-grow"] = item.flexGrow || 1;
      }
    } else if (parentLayout === Layout.GRID) {
      obj = {
        ...obj,
        "grid-column-start": item.gridColumnStart,
        "grid-column-end": item.gridColumnEnd,
        "grid-row-start": item.gridRowStart,
        "grid-row-end": item.gridRowEnd,
      };

      // 렌더링 하는 쪽에서만 처리를 해주는게 맞을까?
      const columns = Grid.parseStyle(item.parent.gridTemplateColumns);
      const rows = Grid.parseStyle(item.parent.gridTemplateRows);

      // 부모의 grid-template-columns 의 개수가 조정이 되면
      // 자식의 grid-column-start, grid-column-end 값이 자동으로 변경된다.
      obj["grid-column-start"] = Math.max(
        1,
        Math.min(columns.length, obj["grid-column-start"] || 1)
      );
      obj["grid-column-end"] = Math.min(
        columns.length + 1,
        obj["grid-column-end"] || 2
      );

      // 부모의 grid-template-rows 의 개수가 조정이 되면
      // 자식의 grid-row-start, grid-row-end 값이 자동으로 변경된다.
      obj["grid-row-start"] = Math.max(
        1,
        Math.min(rows.length, obj["grid-row-start"] || 1)
      );
      obj["grid-row-end"] = Math.min(rows.length + 1, obj["grid-row-end"] || 2);
    }

    return obj;
  }

  toDefaultLayoutItemCSS(item) {
    const obj = {};

    if (item.parent?.is("project")) {
      return obj;
    }

    const parentWidth = item.parent.screenWidth;
    switch (item[ConstraintsDirection.HORIZONTAL]) {
      case Constraints.MIN:
        obj.left = Length.px(item.x);
        obj.right = "auto !important";
        break;
      case Constraints.MAX:
        obj.right = Length.px(parentWidth - item.offsetX - item.screenWidth);
        obj.left = "auto !important";
        break;
      case Constraints.STRETCH:
        obj.left = Length.px(item.x);
        obj.right = Length.px(parentWidth - item.offsetX - item.screenWidth);
        obj.width = "auto !important";
        break;
      case Constraints.CENTER:
        obj.left = Length.px(item.x);
        break;
      case Constraints.SCALE:
        obj.left = Length.px(item.x).toPercent(parentWidth);
        obj.right = Length.px(
          parentWidth - item.offsetX - item.screenWidth
        ).toPercent(parentWidth);
        obj.width = "auto !important";
        break;
    }

    const parentHeight = item.parent.screenHeight;
    switch (item[ConstraintsDirection.VERTICAL]) {
      case Constraints.MIN:
        obj.top = Length.px(item.y);
        obj.bottom = "auto !important";
        break;
      case Constraints.MAX:
        obj.top = "auto !important";
        obj.bottom = Length.px(parentHeight - item.offsetY - item.screenHeight);
        break;
      case Constraints.STRETCH:
        obj.top = Length.px(item.y);
        obj.bottom = Length.px(parentHeight - item.offsetY - item.screenHeight);
        obj.height = "auto !important";
        break;
      case Constraints.CENTER:
        obj.top = Length.px(item.y);
        break;
      case Constraints.SCALE:
        obj.top = Length.px(item.y).toPercent(parentHeight);
        obj.bottom = Length.px(
          parentHeight - item.offsetY - item.screenHeight
        ).toPercent(parentHeight);
        obj.height = "auto !important";
        break;
    }

    return obj;
  }

  /**
   *
   * @param {Item} item
   */
  toFlexLayoutCSS(item) {
    const obj = {};

    if (item.parent.isNot("project")) {
      obj.position = "relative";
    }

    return {
      display: "flex",
      gap: Length.px(item.gap),
      "flex-direction": item.flexDirection,
      "flex-wrap": item.flexWrap,
      "justify-content": item.justifyContent,
      "align-items": item.alignItems,
      "align-content": item.alignContent,
    };
  }

  /**
   *
   * @param {Item} item
   */
  toGridLayoutCSS(item) {
    return {
      display: "grid",
      "grid-template-columns": item.gridTemplateColumns,
      "grid-template-rows": item.gridTemplateRows,
      "grid-template-areas": item.gridTemplateAreas,
      "grid-auto-columns": item.gridAutoColumns,
      "grid-auto-rows": item.gridAutoRows,
      "grid-auto-flow": item.gridAutoFlow,
      "grid-column-gap": item.gridColumnGap,
      "grid-row-gap": item.gridRowGap,
    };
  }

  toBoxShadowCSS(item) {
    const boxShadow = item.computed("boxShadow", (boxShadow = []) => {
      return (
        boxShadow
          .map((shadow) => {
            const { inset, color, offsetX, offsetY, blurRadius, spreadRadius } =
              shadow;

            return ` ${inset === "inset" ? "inset" : ""} ${Length.px(
              offsetX
            )} ${Length.px(offsetY)} ${Length.px(blurRadius)} ${Length.px(
              spreadRadius
            )} ${color}`;
          })
          .join(", ") || undefined
      );
    });

    return {
      "box-shadow": boxShadow,
    };
  }

  toTextShadowCSS(item) {
    const textShadow = item.computed("textShadow", (textShadow = []) => {
      return (
        textShadow
          .map((shadow) => {
            const { color, offsetX, offsetY, blurRadius } = shadow;

            return ` ${Length.px(offsetX)} ${Length.px(offsetY)} ${Length.px(
              blurRadius
            )}  ${color}`;
          })
          .join(", ") || undefined
      );
    });

    return {
      "text-shadow": textShadow,
    };
  }

  toFilterCSS(item) {
    const filter = item.computed("filter", (filter = []) => {
      return (
        filter
          .map((f) => {
            switch (f.type) {
              case "blur":
              case "grayscale":
              case "sepia":
              case "invert":
              case "opacity":
              case "saturate":
              case "hue-rotate":
              case "brightness":
              case "contrast":
                return `${f.type}(${f.value})`;
              case "drop-shadow":
                return `drop-shadow(${f.offsetX} ${f.offsetY} ${f.blurRadius} ${f.color})`;
            }
          })
          .join(" ") || undefined
      );
    });

    return {
      filter,
    };
  }

  toBackdropFilterCSS(item) {
    const backdropFilter = item.computed("backdropFilter", (filter = []) => {
      filter = filter || [];
      return (
        filter
          .map((f) => {
            switch (f.type) {
              case "blur":
              case "grayscale":
              case "sepia":
              case "invert":
              case "opacity":
              case "saturate":
              case "hue-rotate":
              case "brightness":
              case "contrast":
                return `${f.type}(${f.value})`;
              case "drop-shadow":
                return `drop-shadow(${f.offsetX} ${f.offsetY} ${f.blurRadius} ${f.color})`;
            }
          })
          .join(" ") || undefined
      );
    });

    return {
      "backdrop-filter": backdropFilter,
    };
  }

  /**
   * border 정보 캐슁하기
   *
   * @param {Item} item
   */
  toBorderCSS(item) {
    const borderCSS = item.computed("border", (border) => {
      const obj = {
        // 'border-top': Length.px(item['border-top'] || 0),
        // 'border-left': Length.px(item['border-left'] || 0),
        // 'border-right': Length.px(item['border-right'] || 0),
        // 'border-botom': Length.px(item['border-bottom'] || 0),
        // border: item['border']
        ...STRING_TO_CSS(border),
      };
      return obj;
    });

    return borderCSS;
  }

  toBoxModelCSS(item) {
    let obj = {};

    if (item.marginTop) obj["margin-top"] = Length.px(item.marginTop);
    if (item.marginBottom) obj["margin-bottom"] = Length.px(item.marginBottom);
    if (item.marginLeft) obj["margin-left"] = Length.px(item.marginLeft);
    if (item.marginRight) obj["margin-right"] = Length.px(item.marginRight);

    if (item.paddingTop) obj["padding-top"] = Length.px(item.paddingTop);
    if (item.paddingBottom)
      obj["padding-bottom"] = Length.px(item.paddingBottom);
    if (item.paddingLeft) obj["padding-left"] = Length.px(item.paddingLeft);
    if (item.paddingRight) obj["padding-right"] = Length.px(item.paddingRight);

    return obj;
  }

  toSizeCSS(item) {
    const obj = {};

    if (item.isLayout(Layout.FLEX)) {
      switch (item.resizingHorizontal) {
        case ResizingMode.FIXED:
          obj.width = Length.px(item.screenWidth);
          break;
        case ResizingMode.HUG_CONTENT:
          // noop
          obj["min-width"] = Length.px(item.screenWidth);
          // obj.width = 'fit-content';
          // obj.height = 'fit-content';
          break;
      }

      switch (item.resizingVertical) {
        case ResizingMode.FIXED:
          obj.height = Length.px(item.screenHeight);
          break;
        case ResizingMode.HUG_CONTENT:
          // noop
          obj["min-height"] = Length.px(item.screenHeight);
          // obj.width = 'fit-content';
          // obj.height = 'fit-content';
          break;
      }
    }

    if (item.isInDefault()) {
      obj.width = Length.px(item.screenWidth);
      obj.height = Length.px(item.screenHeight);
    }

    if (item.isInFlex()) {
      // flex layout 일 때는 height 를 지정하지 않는다.
      // FIXME: 방향에 따라 지정해야할 수도 있다.
      const direction = item.parent.flexDirection;
      if (
        direction === FlexDirection.ROW ||
        direction === FlexDirection.ROW_REVERSE
      ) {
        // obj.width = Length.px(item.screenWidth);
        obj.width = Length.px(item.screenWidth);
        obj.height = Length.px(item.screenHeight);

        if (item.parent["align-items"] === AlignItems.STRETCH) {
          obj.height = "auto";
        }

        if (item.resizingVertical === ResizingMode.FILL_CONTAINER) {
          obj.height = "auto";
          obj["align-self"] = AlignItems.STRETCH;
        }
      } else {
        obj.width = Length.px(item.screenWidth);
        obj.height = Length.px(item.screenHeight);

        if (item.parent["align-items"] === AlignItems.STRETCH) {
          obj.width = "auto";
        }

        if (item.resizingHorizontal === ResizingMode.FILL_CONTAINER) {
          obj.width = "auto";
          obj["align-self"] = AlignItems.STRETCH;
        }
      }
    }

    if (item.isInGrid()) {
      // NOOP , no width, heigh
      obj.width = "auto";
      obj.height = "auto";
    }

    return obj;
  }

  /**
   *
   * @param {Item} item
   */
  toDefaultCSS(item) {
    if (!item.hasCache("toDefaultCSS")) {
      item.addCache("toDefaultCSS", {
        "box-sizing": "border-box",
      });
    }

    let result = item.getCache("toDefaultCSS");

    if (item.isAbsolute) {
      result.left = Length.px(item.x);
      result.top = Length.px(item.y);
    }

    result["background-color"] = item.backgroundColor;
    result["color"] = item.color;
    result["font-size"] = item.fontSize;
    result["font-weight"] = item.fontWeight;
    result["font-style"] = item.fontStyle;
    result["font-family"] = item.fontFamily;
    result["text-align"] = item.textAlign;
    result["text-decoration"] = item.textDecoration;
    result["text-transform"] = item.textTransform;
    result["letter-spacing"] = item.letterSpacing;
    result["word-spacing"] = item.wordSpacing;
    result["line-height"] = item.lineHeight;
    result["text-indent"] = item.textIndent;
    // result["text-shadow"] = item.textShadow;
    result["text-overflow"] = item.textOverflow;
    result["text-wrap"] = item.textWrap;
    result["position"] = item.position;
    result["overflow"] = item.overflow;
    result["z-index"] = item.zIndex;
    result["opacity"] = item.opacity;
    result["mix-blend-mode"] = item.mixBlendMode;
    result["transform-origin"] = item.transformOrigin;
    result["border-radius"] = item.borderRadius;
    result["filter"] = item.filter;
    // result["backdrop-filter"] = item.backdropFilter;
    // result["box-shadow"] = item.boxShadow;
    result["animation"] = item.animation;
    result["transition"] = item.transition;

    return result;
  }

  /**
   *
   * @param {Item} item
   */
  toVariableCSS(item) {
    const v = item.computed("variable", (v) => {
      let obj = {};
      v.split(";")
        .filter((it) => it.trim())
        .forEach((it) => {
          const [key, value] = it.split(":");

          obj[`--${key}`] = value;
        });

      return obj;
    });

    return v;
  }

  /**
   *
   * @param {Item} item
   */
  toRootVariableCSS(item) {
    let obj = {};
    item.rootVariable
      .split(";")
      .filter((it) => it.trim())
      .forEach((it) => {
        const [key, value] = it.split(":");

        obj[`--${key}`] = value;
      });

    return obj;
  }

  /**
   *
   * @param {Item} item
   */
  toRootVariableString(item) {
    return CSS_TO_STRING(this.toRootVariableCSS(item));
  }

  /**
   * convert to only webket css property
   * @param {*} item
   */
  toWebkitCSS(item) {
    var results = {};
    WEBKIT_ATTRIBUTE_FOR_CSS.forEach((key) => {
      results[`-webkit-${key}`] = item.get(key);
    });

    return results;
  }

  /**
   *
   * @param {Item} item
   */
  toTextClipCSS(item) {
    let results = {};

    if (item.textClip === "text") {
      results["-webkit-background-clip"] = "text";
      results["-webkit-text-fill-color"] = "transparent";
      results["color"] = "transparent";
    }

    return results;
  }

  /**
   *
   * @param {Item} item
   */
  toTransformCSS(item) {
    const transform = item.computed("angle", (angle) => {
      return {
        transform: angle === 0 ? "" : `rotateZ(${angle}deg)`,
      };
    });

    return transform;
  }

  /**
   *
   * @param {Item} item
   */
  toDefInnerString(item) {
    // TODO: item 의 값이 변화가 없으면 미리 생성된 값을 반환해야한다. 캐슁 전략이 필요함

    return /*html*/ `
      ${this.toClipPath(item)}
      ${this.toSVGFilter(item)}
    `.trim();
  }

  /**
   *
   * @param {Item} item
   */
  toClipPath(item) {
    if (item.clipPath === "") return "";

    if (!item.cacheClipPathObject) {
      item.setClipPathCache();
    }

    var obj = item.cacheClipPathObject;
    var value = obj.value;

    switch (obj.type) {
      case "path":
        return /*html*/ `<clipPath id="${this.clipPathId(item)}"><path d="${
          item.clipPathString
        }" /></clipPath>`;
      case "svg":
        return /*html*/ `<clipPath id="${this.clipPathId(
          item
        )}">${value}</clipPath>`;
    }

    return ``;
  }

  toClipPathCSS(item) {
    let str = item.clipPath;

    if (Boolean(str) === false) {
      return null;
    }

    if (!item.cacheClipPathObject) {
      item.setClipPathCache();
    }

    var obj = item.cacheClipPathObject;

    switch (obj.type) {
      case "path":
        if (obj.value) {
          str = `url(#${this.clipPathId(item)})`;
        }
        break;
      case "svg":
        str = `url(#${this.clipPathId(item)})`;
        break;
    }

    return {
      "clip-path": str,
    };
  }

  /**
   *
   * @param {Item} item
   */
  innerSVGId(item) {
    return item.id + "inner-svg";
  }

  booleanId(item) {
    return item.id + "boolean";
  }

  /**
   *
   * @param {Item} item
   */
  clipPathId(item) {
    return item.id + "clip-path";
  }

  /**
   *
   * @param {Item} item
   */
  toDefString(item) {
    var str = this.toDefInnerString(item).trim();

    return str
      ? /*html*/ `
    <svg class='inner-svg-element' style="display:block" data-id="${this.innerSVGId(
      item
    )}" width="0" height="0">
      <defs>
        ${str}
      </defs>
    </svg>
    `
      : "";
  }

  /**
   *
   * @param {DomItem} item
   * @param {string} prefix
   */
  toSelectorString(item, prefix = "") {
    return item.selectors
      ?.map((selector) => selector.toString(prefix))
      .join("\n\n");
  }

  /**
   *
   * @param {Item} item
   * @param {string} prefix
   * @param {string} appendCSS
   */
  generateView(item, prefix = "", appendCSS = "") {
    //1. 원본 객체의 css 를 생성
    //2. 원본이 하나의 객체가 아니라 복합 객체일때 중첩 CSS 를 자체 정의해서 생성
    //3. 이외에 selector 로 생성할 수 있는 css 를 생성 (:hover, :active 등등 )
    var cssString = `
  ${prefix} {  /* ${item.itemType} */
      ${CSS_TO_STRING(this.toCSS(item), "\n    ")}; 
      ${appendCSS}
  }
  ${this.toNestedCSS(item)
    .map((it) => {
      return `${prefix} ${it.selector} { 
        ${it.cssText ? it.cssText : CSS_TO_STRING(it.css || {}, "\n\t\t")}; 
    }`;
    })
    .join("\n")}
  ${this.toSelectorString(item, prefix)}
    `;
    return cssString;
  }

  /**
   * CSS 리턴
   * @param {Item} item
   * @override
   */
  toCSS(item) {
    return valueFilter(
      Object.assign(
        {},
        this.toVariableCSS(item),
        this.toDefaultCSS(item),
        this.toClipPathCSS(item),
        this.toWebkitCSS(item),
        this.toTextClipCSS(item),
        this.toBoxModelCSS(item),
        this.toBorderCSS(item),
        this.toBackgroundImageCSS(item),
        this.toBoxShadowCSS(item),
        this.toTextShadowCSS(item),
        this.toFilterCSS(item),
        this.toBackdropFilterCSS(item),
        this.toLayoutCSS(item),
        this.toSizeCSS(item),
        this.toTransformCSS(item),
        this.toLayoutItemCSS(item)
      )
    );
  }

  toStyleCode(item) {
    const cssString = this.generateView(
      item,
      `[data-renderer-id='${this.renderer.id}'] .element-item[data-id='${item.id}']`
    );

    return cssString;
  }

  /**
   *
   * @param {Item} item
   * @param {HtmlRenderer} renderer
   */
  toStyle(item) {
    const cssString = this.generateView(
      item,
      `[data-renderer-id='${this.renderer.id}'] .element-item[data-id='${item.id}']`
    );
    return (
      /*html*/ `
<style type='text/css' data-renderer-type="html" data-id='${item.id}'>
${cssString}
</style>
    ` +
      item.layers
        .map((it) => {
          return this.renderer.toStyle(it);
        })
        .join("")
    );
  }

  toStyleData(item) {
    const cssString = this.generateView(
      item,
      `[data-renderer-id='${this.renderer.id}'] .element-item[data-id='${item.id}']`
    );

    return {
      styleTag: `<style type='text/css' data-renderer-type="html" data-id='${item.id}'>${cssString}</style>`,
      cssString,
    };
  }

  /**
   *
   * @param {Item} item
   */
  toExportStyle(item) {
    const cssString = this.generateView(
      item,
      `.element-item[data-id='${item.id}']`
    );
    return (
      /*html*/ `
<style type='text/css' data-renderer-type="html" data-id='${item.id}' data-timestamp='${item.timestamp}'>
${cssString}
</style>
    ` +
      item.layers
        .map((it) => {
          return this.renderer.toExportStyle(it);
        })
        .join("")
    );
  }

  /**
   * 처음 렌더링 할 때
   *
   * @param {Item} item
   * @override
   */
  render(item) {
    var { elementType, id, name, itemType, isBooleanItem } = item;

    const tagName = elementType || "div";

    return /*html*/ `<${tagName} id="${this.uniqueId(
      item
    )}" class="element-item ${itemType}" data-is-boolean-item="${isBooleanItem}" data-id="${id}" data-title="${name}">${this.toDefString(
      item
    )}${item.layers
      .map((it) => {
        return this.renderer.render(it);
      })
      .join("")}</${tagName}>`;
  }

  toSVGFilter(item) {
    if (item.svgfilters.length === 0) return "";

    var filterString = item.computedValue("svgfilters");

    // 변경점이 svgfilters 일 때만 computed 로 다시 캐슁하기
    // 이전 캐쉬가 없다면 다시 캐쉬 하기
    if (item.hasChangedField("svgfilters") || !filterString) {
      filterString = item.computed(
        "svgfilters",
        (svgfilters) => {
          var filterString = svgfilters
            .map((svgfilter) => {
              return /*html*/ `
              <filter id='${svgfilter.id}'>
                ${svgfilter.filters
                  .map((filter) => SVGFilter.parse(filter))
                  .join("\n")}
              </filter>`;
            })
            .join("");

          return filterString;
        },
        true // 캐쉬 강제로 생성하기
      );
    }

    return filterString;
  }

  renderSVG() {}

  /**
   *
   * @param {Item} item
   */
  toNestedCSS() {
    const result = [];

    return result;
  }

  /**
   * css string 만 따로 style 태그로 렌더링 하기
   *
   * @param {BaseModel} item
   */
  updateStyle(item) {
    // style 태그를 만들어서 캐쉬에 넣어두자.
    if (item.hasCache("style")) {
      const styleText = this.toStyleData(item).cssString;

      if (item.hasCache("styleText")) {
        // 기존의 styleText 와 같다면 아무것도 하지 않는다.
        if (item.getCache("styleText") === styleText) {
          return;
        }
      }

      item.addCache("styleText", styleText);

      item.getCache("style").text(styleText);
    } else {
      const styleData = this.toStyleData(item);
      const style = Dom.createByHTML(styleData.styleTag);

      item.addCache("style", style);
      item.addCache("styleText", styleData.cssString);

      document.head.appendChild(style.el);
    }
  }

  /**
   * 초기 렌더링 이후 업데이트만 할 때
   *
   * @param {Item} item
   * @param {Dom} currentElement
   * @override
   */
  update(item, currentElement) {
    if (!currentElement) return;

    this.updateStyle(item);

    let $svg = currentElement.el.$svg;
    // let $booleanSvg = currentElement.el.$booleanSvg;

    if (!$svg) {
      currentElement.el.$svg = currentElement.$(
        `[data-id="${this.innerSVGId(item)}"]`
      );
      $svg = currentElement.el.$svg;

      currentElement.el.$booleanSvg = currentElement.$(
        `[data-id="${this.booleanId(item)}"]`
      );
      // $booleanSvg = currentElement.el.$booleanSvg;
    }

    if (currentElement.data("is-boolean-item") !== `${item.isBooleanItem}`) {
      currentElement.attr("data-is-boolean-item", item.isBooleanItem);
    }

    if ($svg) {
      const defString = this.toDefInnerString(item);

      if (defString) {
        var $defs = $svg.$("defs");
        $defs.updateSVGDiff(`<defs>${defString}</defs>`);
      }
    } else {
      const defString = this.toDefString(item);

      if (defString) {
        var a = Dom.createByHTML(defString);
        if (a) {
          currentElement.prepend(a);
        }
      }
    }
  }
}
