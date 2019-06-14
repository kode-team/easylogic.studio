import { SUBMIT } from "../../../../util/Event";
import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import UIElement from "../../../../util/UIElement";
import { CSS_TO_STRING } from "../../../../util/css/make";
import { keyEach, keyMap } from "../../../../util/functions/func";
import { NEW_LINE, EMPTY_STRING } from "../../../../util/css/types";

export default class ExportCodePen extends UIElement {
  template() {
    return `
            <form class='codepen' action="https://codepen.io/pen/define" method="POST" target="_code_pen">
                <input type="hidden" name="data" ref="$codepen" value=''>
                <button type="submit">
                    <div class='icon codepen'></div>
                    <div class='titie'>CodePen</div>
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
            <svg width="0" height="0">
              ${current.toSVGString()}
            </svg>
          `,
          css: this.generate(current)
        })
      );
    }

    return false;
  }



  generate(current) {
    var css = current.toCSS(), keyframeString = current.toKeyframeString(), rootVariable = current.toRootVariableCSS()
    var results = `:root {
  ${CSS_TO_STRING(rootVariable)}
}

/* element */
#sample { 
${keyMap(css, (key, value) => {
  return `  ${key}: ${value}; ${NEW_LINE}`
}).join(EMPTY_STRING)}
}  

/* keyframe */
${keyframeString}`

    return results
  }
}
