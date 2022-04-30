import { CLICK, SUBSCRIBE, registElement } from "sapa";

import BaseWindow from "./BaseWindow";
import "./ExportWindow.scss";

export default class ExportWindow extends BaseWindow {
  getClassName() {
    return "elf--export-window";
  }

  getTitle() {
    return "Export";
  }

  initState() {
    return {
      selectedIndex: 1,
    };
  }

  getBody() {
    return /*html*/ `
        <div class="tab" ref="$tab">
            <div class="tab-header full" ref="$header">
                <div class="tab-item selected" data-value="1">
                    <label>HTML</label>
                </div>
                <div class="tab-item" data-value="2">
                    <label>CSS</label>
                </div>                
                <div class="tab-item" data-value="6">
                    <label>SVG Image</label>
                </div>     
            </div>
            <div class="tab-body" ref="$body">
                <div class="tab-content selected" data-value="1" ref="$html">
                </div>
                <div class='tab-content' data-value='2' ref="$css">
                </div>                        
                <div class="tab-content" data-value="6" ref="$svgimage">
                </div>                                                                       
            </div>
      </div>
        `;
  }

  [SUBSCRIBE("showExportWindow")]() {
    this.show();
    this.refresh();
  }

  refresh() {
    var project = this.$context.selection.currentProject || { layers: [] };

    // css code
    var css = `
${this.makeStyle(project)}
${project.layers.map((item) => this.makeStyle(item)).join("\n")}
`;

    // html code
    var html = `
${this.$editor.html.renderSVG(project)}
${this.$editor.html.render(project)}
        `;

    // export svg image
    var svgData = project.layers.map((item) => {
      return this.$editor.svg.render(item);
    });

    // eslint-disable-next-line no-undef
    if (shiki) {
      // eslint-disable-next-line no-undef
      shiki
        .getHighlighter({
          theme: "light-plus",
        })
        .then((highlighter) => {
          // eslint-disable-next-line no-undef
          if (html_beautify) {
            // eslint-disable-next-line no-undef
            html = html_beautify(html, { indent: 2 });

            const changedHtml = highlighter.codeToHtml(html, "html");
            this.refs.$html.html(changedHtml);

            // eslint-disable-next-line no-undef
            css = html_beautify(css, { indent: 2 });

            const changedCss = highlighter.codeToHtml(css, "html");
            this.refs.$css.html(changedCss);

            // eslint-disable-next-line no-undef
            svgData = html_beautify(svgData.join(""), { indent: 2 });

            const changedSvgData = highlighter.codeToHtml(svgData, "html");
            this.refs.$svgimage.html(changedSvgData);
          }
        });
    }
  }

  makeStyle(item) {
    return this.$editor.html.toExportStyle(item, null);
  }

  makeHTML(item) {
    return this.$editor.html.render(item);
  }

  [CLICK("$header .tab-item")](e) {
    var selectedIndex = +e.$dt.attr("data-value");
    if (this.state.selectedIndex === selectedIndex) {
      return;
    }

    this.$el
      .$$(`[data-value="${this.state.selectedIndex}"]`)
      .forEach((it) => it.removeClass("selected"));
    this.$el
      .$$(`[data-value="${selectedIndex}"]`)
      .forEach((it) => it.addClass("selected"));
    this.setState({ selectedIndex }, false);
  }
}

registElement({ ExportWindow });
