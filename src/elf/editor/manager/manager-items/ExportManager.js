import { CSS_TO_STRING } from "elf/core/func";

export default {
  makeProjectStyle(item) {
    const keyframeString = item.toKeyframeString();
    const rootVariable = item.toRootVariableCSS();

    return `
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }
      /* keyframe */
      ${keyframeString}
    `;
  },

  makeStyle(item, appendCSS = "") {
    if (item.is("project")) {
      return this.makeProjectStyle(item);
    }

    const cssString = item.generateView(`[data-id='${item.id}']`, appendCSS);
    return (
      `
    ${cssString}
    ` +
      item.layers
        .map((it) => {
          return this.makeStyle(it);
        })
        .join("")
    );
  },

  makeSvg(project) {
    const SVGString = project.toSVGString ? project.toSVGString() : "";
    return `
      ${SVGString ? `<svg width="0" height="0">${SVGString}</svg>` : ""}
    `;
  },

  generateSVG(editor, rootItem) {
    return editor.replaceLocalUrltoRealUrl(editor.svg.render(rootItem));
  },
};
