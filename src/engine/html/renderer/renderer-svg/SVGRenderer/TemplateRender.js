import { TemplateEngine } from "../../renderer-html/HTMLRenderer/template-engine/TemplateEngine";
import SVGLayerRender from "./SVGLayerRender";

export default class TemplateRender extends SVGLayerRender {
  /**
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    const compiledTemplate = this.compile(item);
    let $innerHTML = currentElement.$(".inner-html");

    // TODO: template, engine, params 가 변경 된 시점에  변경 상태를 기록한다.
    // TODO: 그렇게 해서 변경이 없는 부분은 최대한 다시 그리지 않도록 한다.
    if ($innerHTML) {
      $innerHTML.updateDiff(compiledTemplate);
    }

    super.update(item, currentElement);
  }

  compile(item) {
    return TemplateEngine.compile("dom", item.template, item.params);
  }

  /**
   *
   * @param {*} item
   */
  render(item) {
    const { id, width, height } = item;
    const compiledTemplate = this.compile(item);

    return this.wrappedRender(item, () => {
      return /*html*/ `
            <foreignObject
                width="${width}"
                height="${height}"
            >
                <div  xmlns="http://www.w3.org/1999/xhtml" style="width: 100%;height:100%;">
                    <style id="style-${id}">
                    [data-id="${id}"] .inner-html {
                        width: 100%; 
                        height: 100%;
                        position:relative;
                        display:block;
                        pointer-events: none; 
                    }

                    [data-id="${id}"] .inner-html > * {
                        width: 100%; 
                        height: 100%;
                    }          
                    </style>
                    <div class="inner-html">
                    ${compiledTemplate}
                    </div>
                </div>
            </foreignObject>              
          `;
    });
  }
}
