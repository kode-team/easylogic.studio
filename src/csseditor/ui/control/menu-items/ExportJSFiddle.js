import { SUBMIT } from "../../../../util/Event";
import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { CSS_TO_STRING } from "../../../../util/css/make";
import { keyMap } from "../../../../util/functions/func";

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
      this.refs.$html.val(`
        <div id="sample"></div>
        <svg width="0" height="0">
          ${current.toSVGString()}
        </svg>
      `);
      this.refs.$css.val(this.generate(current));
    }

    return false;
  }


  generate(current) {
    var css = current.toCSS(), keyframeString = current.toKeyframeString(), rootVariable = current.toRootVariableCSS()
    var selectorString = current.toSelectorString('#sample')
    var results = `:root {
  ${CSS_TO_STRING(rootVariable)}
}

/* element */
#sample { 
${keyMap(css, (key, value) => {
  return `  ${key}: ${value};\n`
}).join('')}
}  

${selectorString}

/* keyframe */
${keyframeString}
    `
    return results
  }
}
