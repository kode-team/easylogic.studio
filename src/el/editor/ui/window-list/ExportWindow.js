import BaseWindow from "./BaseWindow";

import { CLICK, SUBSCRIBE } from "el/base/Event";

import Dom from "el/base/Dom";
import HTMLRenderer from "el/editor/renderer/HTMLRenderer";
import SVGRenderer from "el/editor/renderer/SVGRenderer";
import { registElement } from "el/base/registerElement";

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

        var css = `
${this.makeStyle(project)}
${project.artboards.map(item => this.makeStyle(item).replace(/\n/g, '\n\t')).join('\n')}
`
        this.refs.$css.text(css);

        var html = `
${HTMLRenderer.renderSVG(project)}
${HTMLRenderer.render(project)}
        `

        this.refs.$html.text(html);

        // export svg image 

        var svgString = SVGRenderer.render(this.$selection.current);
        this.refs.$svgimage.text(svgString);
        this.refs.$svgimagePreview.html(Dom.createByHTML(svgString));

    }

    makeStyle (item) {
        return HTMLRenderer.toStyle(item);
    }

    makeHTML (item) {
        return HTMLRenderer.render(item);
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