import BaseWindow from "./BaseWindow";
import { EVENT } from "../../../util/UIElement";
import { CLICK } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { CSS_TO_STRING } from "../../../util/functions/func";

export default class ExportWindow extends BaseWindow {

    getClassName() {
        return 'export-window'
    }

    getTitle() {
        return 'Export'
    }

    getBody() {
        return /*html*/`
        <div class="tab number-tab" data-selected-value="1" ref="$tab">
            <div class="tab-header" ref="$header">
                <div class="tab-item" data-value="1">
                    <label>HTML</label>
                </div>
                <div class="tab-item" data-value="2">
                    <label>CSS</label>
                </div>
                
                <div class="tab-item" data-value="3">
                    <label>SVG</label>
                </div>                                     
                <div class="tab-item" data-value="4">
                    <label>Assets</label>
                </div>                                     
        
            </div>
            <div class="tab-body" ref="$body">
                <div class="tab-content" data-value="1">
                    <pre ref='$html'></pre>
                </div>
                <div class='tab-content' data-value='2'>
                    <pre ref='$css'></pre>
                </div>                        
                <div class='tab-content' data-value='3'>
                    <pre ref='$svg'></pre>
                </div>
                <div class="tab-content" data-value="4">
                    <pre ref='$assets'></pre>                
                </div>                       
            </div>
      </div>
        `
    }

    [EVENT('showExportWindow')] () {
        this.show();
        this.refresh();
    }

    refresh() {
        var project = editor.selection.currentProject || { layers : [] }

        var css = `
${this.makeStyle(project)}
${project.artboards.map(item => this.makeStyle(item).replace(/\n/g, '\n\t')).join('\n')}
`
        this.refs.$css.text(css);

        var html = `
${project.artboards.map(item => item.html).join('\n')}
        `

        this.refs.$html.text(html);
    }

    makeProjectStyle (item) {

        const keyframeString = item.toKeyframeString();
        const rootVariable = item.toRootVariableCSS()
        
        return `
        :root {
            ${CSS_TO_STRING(rootVariable)}
        }

        /* keyframe */
        ${keyframeString}
        `
    }  

    makeStyle (item) {

        if (item.is('project')) {
            return this.makeProjectStyle(item);
        }

        const cssString = item.generateView(`[data-id='${item.id}']`)
        return `
        ${cssString}
        ` + item.layers.map(it => {
        return this.makeStyle(it);
        }).join('')
    }


    [CLICK("$header .tab-item")](e) {
        this.refs.$tab.attr(
        "data-selected-value",
        e.$delegateTarget.attr("data-value")
        );
    }
}