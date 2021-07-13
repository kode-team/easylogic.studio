import BaseWindow from "./BaseWindow";

import { CLICK, SUBSCRIBE } from "el/base/Event";
import Dom from "el/base/Dom";
import { registElement } from "el/base/registElement";

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
                <div class="tab-item" data-value="4">
                    <label>Assets</label>
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
                <div class="tab-content" data-value="4">
                    <pre ref='$assets'></pre>
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

    [SUBSCRIBE('showExportWindow')] () {
        this.show();
        this.refresh();
    }

    refresh() {
        var project = this.$selection.currentProject || { layers : [] }

        // css code
        var css = `
${this.makeStyle(project)}
${project.layers.map(item => this.makeStyle(item)).join('\n')}
`
        this.refs.$css.text(css);

        // html code 
        var html = `
${this.$editor.html.renderSVG(project)}
${this.$editor.html.render(project)}
        `

        this.refs.$html.text(html);

        // export svg image 
        const svgData = project.layers.map( item => {
            return this.$editor.svg.render(item);
        })

        // svg code 
        this.refs.$svgimage.text(svgData.join("\n\n"));

        // svg preview image 
        this.refs.$svgimagePreview.html(Dom.createByHTML(`<div>${svgData.map(it => `<div>${it}</div>`).join("")}</div>`));

    }

    makeStyle (item) {
        return this.$editor.html.toStyle(item);
    }

    makeHTML (item) {
        return this.$editor.html.render(item);
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
}

registElement({ ExportWindow })