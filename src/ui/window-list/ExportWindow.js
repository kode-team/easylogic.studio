import BaseWindow from "./BaseWindow";
import { EVENT } from "@core/UIElement";
import { CLICK } from "@core/Event";
import { CSS_TO_STRING } from "@core/functions/func";

import Dom from "@core/Dom";
import ExportManager from "@manager/ExportManager";
import HTMLRenderer from "@renderer/HTMLRenderer";
import SVGRenderer from "@renderer/SVGRenderer";

export default class ExportWindow extends BaseWindow {

    getClassName() {
        return 'export-window'
    }

    getTitle() {
        return 'Export'
    }

    initState() {
        return {
            selectedIndex: 1
        }
    }

    getBody() {
        return /*html*/`
        <div class="tab number-tab" ref="$tab">
            <div class="tab-header full" ref="$header">
                <div class="tab-item selected" data-value="1">
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
                <div class="tab-item" data-value="5">
                    <label>Animation Player</label>
                </div>                                                                                  
                <div class="tab-item" data-value="6">
                    <label>SVG Image</label>
                </div>     
                <div class="tab-item" data-value="7">
                    <label>SVG Image Preview</label>
                </div>                        
            </div>
            <div class="tab-body" ref="$body">
                <div class="tab-content selected" data-value="1">
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
                <div class="tab-content" data-value="5">
                    <pre ref='$js'></pre>
                </div>     
                <div class="tab-content" data-value="6">
                    <pre ref='$svgimage'></pre>
                </div>                                                                       
                <div class="tab-content" data-value="7">
                    <div ref='$svgimagePreview'></div>
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
//         var project = this.$selection.currentProject || { layers : [] }

//         var css = `
// ${this.makeStyle(project)}
// ${project.artboards.map(item => this.makeStyle(item).replace(/\n/g, '\n\t')).join('\n')}
// `
//         this.refs.$css.text(css);

//         var html = `
// ${project.artboards.map(item => item.html).join('\n')}
//         `

//         this.refs.$html.text(html);

//         var obj = ExportManager.generate(this.$editor);

//         this.refs.$js.text(obj.js);


        // export svg image 
        if (this.$selection.currentArtboard) {
            var svgString = SVGRenderer.render(this.$selection.currentArtboard);
            this.refs.$svgimage.text(svgString);
            this.refs.$svgimagePreview.html(Dom.createByHTML(svgString));
        } else  {
            this.refs.$svgimage.empty();
            this.refs.$svgimagePreview.empty();
        }
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
        return HTMLRenderer.toStyle(item);
    }


    [CLICK("$header .tab-item")](e) {

        var selectedIndex = +e.$dt.attr('data-value')
        if (this.state.selectedIndex === selectedIndex) {
          return; 
        }
    
        this.$el.$$(`[data-value="${this.state.selectedIndex}"]`).forEach(it => it.removeClass('selected'))
        this.$el.$$(`[data-value="${selectedIndex}"]`).forEach(it => it.addClass('selected'))
        this.setState({ selectedIndex }, false);
    }

    [EVENT('showExportWindow')] () {
        this.show();
        this.refresh();
    }    
}