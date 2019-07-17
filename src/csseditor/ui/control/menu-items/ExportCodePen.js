import { SUBMIT } from "../../../../util/Event";
import { editor } from "../../../../editor/editor";
import UIElement from "../../../../util/UIElement";

import { keyMap, CSS_TO_STRING } from "../../../../util/functions/func";

export default class ExportCodePen extends UIElement {
  template() {
    return `
            <form class='codepen' action="https://codepen.io/pen/define" method="POST" target="_code_pen">
                <input type="hidden" name="data" ref="$codepen" value=''>
                <button type="submit">
                    <div class='icon codepen'></div>
                    <div class='title'>CodePen</div>
                </button>
            </form>     
        `;
  }

  [SUBMIT()]() {
    var current = editor.selection.current;
    if (current) {
      this.refs.$codepen.val(
        JSON.stringify({
          html: `
            <div id="sample"></div>
            ${current.toSVGString() ? `
            <svg width="0" height="0">
              ${current.toSVGString()}
            </svg>            
            `: ''}
          `,
          css: this.generate(current)
        })
      );
    }

    return false;
  }



  generate(current) {
    var css = current.toCSS(), keyframeString = current.toKeyframeString(), rootVariable = current.toRootVariableCSS();
    var selectorString = current.toSelectorString('#sample')
    var results = `
:root {
  ${CSS_TO_STRING(rootVariable)}
}

/* element */
#sample { 
${keyMap(css, (key, value) => {
  if (!key) return '';
  return `  ${key}: ${value};\n`
}).join('')}
}  

${selectorString}

${keyframeString ? 
`/* keyframe */
${keyframeString}` : ''}`
    return results
  }
}
