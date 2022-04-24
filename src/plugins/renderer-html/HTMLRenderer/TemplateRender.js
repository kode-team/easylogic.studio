import LayerRender from "./LayerRender";
import { TemplateEngine } from "./template-engine/TemplateEngine";

export default class TemplateRender extends LayerRender {
  update(item, currentElement) {
    if (item.hasChangedField("x", "y", "width", "height") === false) {
      const compiledTemplate = this.compile(item);
      let $innerHTML = currentElement.$(".inner-html");

      // TODO: template, engine, params 가 변경 된 시점에  변경 상태를 기록한다.
      // TODO: 그렇게 해서 변경이 없는 부분은 최대한 다시 그리지 않도록 한다.
      if ($innerHTML) {
        $innerHTML.updateDiff(compiledTemplate);
      }
    }

    super.update(item, currentElement);
  }

  compile(item) {
    return TemplateEngine.compile("dom", item.template, item.params);
  }

  /**
   *
   * @param {Item} item
   */
  render(item) {
    var { id } = item;

    // 마지막으로 렌더링된 template 을 저장해둔다.
    // 이후 업데이트 될 때  변경시점을 확인 할 수 있다.
    const compiledTemplate = this.compile(item);

    return /*html*/ `
      <div class='element-item template' data-id="${id}">
        ${this.toDefString(item)}
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
        <div class="inner-html" data-domdiff-pass="true">
          ${compiledTemplate}
        </div>
      </div>`;
  }
}
