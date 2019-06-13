import { SUBMIT } from "../../../../util/Event";
import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { CSS_TO_STRING } from "../../../../util/css/make";
import { keyEach, keyMap } from "../../../../util/functions/func";
import { NEW_LINE, EMPTY_STRING } from "../../../../util/css/types";

export default class ExportJSFiddle extends MenuItem {
  template() {
    return `
            <form class='jsfiddle' action="http://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank">
                <input type="hidden" name="title" ref="$title" value=''>
                <input type="hidden" name="description" ref="$description" value=''>
                <input type="hidden" name="html" ref="$html" value=''>
                <input type="hidden" name="css" ref="$css" value=''>
                <input type="hidden" name="dtd" value='html 5'>
                <button type="submit">
                    <div class='icon jsfiddle'></div>
                    <div class='titie'>JSFiddle</div>
                </button>                
            </form>     
        `;
  }

  [SUBMIT()]() {
    var current = editor.selection.current;
    if (current) {
      this.refs.$title.val("Gradient - easylogic.studio");
      this.refs.$description.val("https://gradient.easylogic.studio");
      this.refs.$html.val('<div id="sample"></div>');
      this.refs.$css.val(this.generate(current));
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
${keyframeString}
    `
    return results
  }
}
