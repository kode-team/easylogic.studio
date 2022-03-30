import Dom from "el/sapa/functions/Dom";
import { isNotUndefined } from "el/sapa/functions/func";
import { Item } from "el/editor/items/Item";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import ItemRender from "./ItemRender";
import { SVGFilter } from 'el/editor/property-parser/SVGFilter';
import { AlignItems, Constraints, ConstraintsDirection, FlexDirection, Layout, ResizingMode } from "el/editor/types/model";
import { Length } from "el/editor/unit/Length";

const ZERO_CONFIG = {}

const WEBKIT_ATTRIBUTE_FOR_CSS = [
  'text-fill-color',
  'text-stroke-color',
  'text-stroke-width',
  'background-clip'
]

export default class DomRender extends ItemRender {


  /**
   * 
   * @param {Item} item 
   * @param {string} field 
   */
  toStringPropertyCSS(item, field) {
    return STRING_TO_CSS(item[field]);
  }

  /**
   * 
   * @param {Item} item 
   */
  toBackgroundImageCSS(item) {

    if (!item.cacheBackgroundImage) {
      item.setBackgroundImageCache();
    }

    // visibility 속성은 출력하지 않는다.
    return {
      "background-image": item.cacheBackgroundImage['background-image'],
      "background-position": item.cacheBackgroundImage['background-position'],
      "background-repeat": item.cacheBackgroundImage['background-repeat'],
      "background-size": item.cacheBackgroundImage['background-size'],
      "background-blend-mode": item.cacheBackgroundImage['background-blend-mode'],      
    };
  }

  /**
   * 
   * @param {Item} item 
   */
  toLayoutCSS(item) {

    const layout = item.layout;
    if (item.hasLayout()) {

      if (item.isLayout(Layout.FLEX)) {
        return this.toFlexLayoutCSS(item)
      } else if (item.isLayout(Layout.GRID)) {
        return this.toGridLayoutCSS(item)
      }
    }

    return {}
  }

  /**
   * 
   * @param {Item} item 
   */
  toLayoutItemCSS(item) {
    var parentLayout = item.parent?.['layout'];
    var obj = {}
    if (parentLayout === Layout.FLEX) {
      // 부모가  layout 이  지정 됐을 때 자식item 들은 position: relative 기준으로 동작한다. , left, top 은  속성에서 삭제 
      obj = {
        position: 'relative',
        left: 'auto !important',
        top: 'auto !important',
      }

    } else if (parentLayout === Layout.GRID) {
      // 부모가  layout 이  지정 됐을 때 자식item 들은 position: relative 기준으로 동작한다. , left, top 은  속성에서 삭제 
      obj = {
        position: 'relative',
        left: 'auto !important',
        top: 'auto !important',
        width: 'auto !important',
        height: 'auto !important',
      }

    } else if (parentLayout === Layout.DEFAULT) {
      obj = this.toDefaultLayoutItemCSS(item);
    }

    if (parentLayout === Layout.FLEX) {
      obj = {
        ...obj,
        ...item.attrs(
          'flex-basis',
          // 'flex-grow',
          'flex-shrink',
        )
      }

      // 자식의 경우 fill container 를 가질 수 있고 
      // fill container 의 경우 flex-grow : 1 로 고정한다. 
      // 부모의 flex-direction 에 따라 다르다.       
      // 방향에 따라 flex-grow 가 정해지기 때문에 , 그에 따른 width, height 값이 auto  로 변경되어야 함 
      const parentLayoutDirection  = item?.parent?.['flex-direction'];
      if (parentLayoutDirection === FlexDirection.ROW && item.resizingHorizontal === ResizingMode.FILL_CONTAINER) {
        obj.width = 'auto';
        obj['flex-grow'] = item['flex-grow'] || 1;
      } else if (parentLayoutDirection === FlexDirection.COLUMN && item.resizingVertical === ResizingMode.FILL_CONTAINER) {
        obj.height = 'auto';
        obj['flex-grow'] = item['flex-grow'] || 1;
      }

    } else if (parentLayout === Layout.GRID) {
      obj = {
        ...obj,
        ...item.attrs(
          'grid-column-start',
          'grid-column-end',
          'grid-row-start',
          'grid-row-end'
        )
      }
    }

    return obj;
  }

  toDefaultLayoutItemCSS(item) {
    const obj = {};

    if (item.parent?.is('project')) {
      return obj;
    }

    const parentWidth = item.parent.screenWidth;
    switch (item[ConstraintsDirection.HORIZONTAL]) {
      case Constraints.MIN:
        obj.left = Length.px(item.x);
        obj.right = 'auto !important';
        break;
      case Constraints.MAX:
        obj.right = Length.px(parentWidth - item.offsetX - item.screenWidth);
        obj.left = 'auto !important';
        break;
      case Constraints.STRETCH:
        obj.left = Length.px(item.x);
        obj.right = Length.px(parentWidth - item.offsetX - item.screenWidth);
        break;
      case Constraints.CENTER:
        obj.left = Length.px(item.x);
        break;
      case Constraints.SCALE:
        obj.left = Length.px(item.x).toPercent(parentWidth);
        obj.right = Length.px(parentWidth - item.offsetX - item.screenWidth).toPercent(parentWidth);
        break;
    }

    const parentHeight = item.parent.screenHeight;
    switch (item[ConstraintsDirection.VERTICAL]) {
      case Constraints.MIN:
        obj.top = Length.px(item.y);
        obj.bottom = 'auto !important';
        break;
      case Constraints.MAX:
        obj.top = 'auto !important';
        obj.bottom = Length.px(parentHeight - item.offsetY - item.screenHeight);
        break;
      case Constraints.STRETCH:
        obj.top = Length.px(item.y);
        obj.bottom = Length.px(parentHeight - item.offsetY - item.screenHeight);
        break;
      case Constraints.CENTER:
        obj.top = Length.px(item.y);
        break;
      case Constraints.SCALE:
        obj.top = Length.px(item.y).toPercent(parentHeight);
        obj.bottom = Length.px(parentHeight - item.offsetY - item.screenHeight).toPercent(parentHeight);
        break;
    }
    return obj;
  }


  /**
   * 
   * @param {Item} item 
   */
  toFlexLayoutCSS(item) {

    const obj = {}

    if (item.parent.isNot('project')) {
      obj.position = 'relative';
    }

    return {
      display: 'flex',
      ...item.attrs(
        'flex-direction',
        'flex-wrap',
        'justify-content',
        'align-items',
        'align-content',
      ),
      gap: Length.px(item.gap),
    }
  }

  /**
   * 
   * @param {Item} item 
   */
  toGridLayoutCSS(item) {
    return {
      display: 'grid',
      ...item.attrs(
        'grid-template-columns',
        'grid-template-rows',
        'grid-template-areas',
        'grid-auto-columns',
        'grid-auto-rows',
        'grid-auto-flow',
      ),
      gap: Length.px(item.gap),
    }
  }

  /**
   * 
   * @param {Item} item 
   */
  toBorderCSS(item) {
    const obj = {
      // 'border-top': Length.px(item['border-top'] || 0),
      // 'border-left': Length.px(item['border-left'] || 0),
      // 'border-right': Length.px(item['border-right'] || 0),
      // 'border-botom': Length.px(item['border-bottom'] || 0),
      // border: item['border']      
      ...STRING_TO_CSS(item['border'])
    };

    

    return obj;
  }

  toKeyCSS(key) {
    if (!item[key]) return {}
    return {
      [key]: item[key]
    };
  }


  toBoxModelCSS(item) {
    let obj = {};

    if (item['margin-top']) obj["margin-top"] = Length.px(item['margin-top']);
    if (item['margin-bottom']) obj["margin-bottom"] = Length.px(item['margin-bottom']);
    if (item['margin-left']) obj["margin-left"] = Length.px(item['margin-left']);
    if (item['margin-right']) obj["margin-right"] = Length.px(item['margin-right']);

    if (item['padding-top']) obj["padding-top"] = Length.px(item['padding-top']);
    if (item['padding-bottom']) obj["padding-bottom"] = Length.px(item['padding-bottom']);
    if (item['padding-left']) obj["padding-left"] = Length.px(item['padding-left']);
    if (item['padding-right']) obj["padding-right"] = Length.px(item['padding-right']);


    return obj;
  }


  /**
   * 
   * @param {Item} item 
   * @param {string[]} parameters 표현될 속성 리스트   
   */
  toKeyListCSS(item, args = []) {
    let obj = {};

    for(var i = 0; i < args.length; i++) {
      const key = args[i];
      if (isNotUndefined(item[key])) {
        obj[key] = item[key];
      }
    }

    return obj;
  }

  toSizeCSS(item) {
    const obj = {}

    if (item.isLayout(Layout.FLEX)) {
      switch (item.resizingHorizontal) {
        case ResizingMode.FIXED: 
          obj.width = Length.px(item.screenWidth);
          break; 
        case ResizingMode.HUG_CONTENT:
          // noop
          obj['min-width'] = Length.px(item.screenWidth);
          // obj.width = 'fit-content';
          // obj.height = 'fit-content';
          break;
      }

      switch (item.resizingVertical) {
        case ResizingMode.FIXED: 
          obj.height = Length.px(item.screenHeight);
          break; 
        case ResizingMode.HUG_CONTENT:
          // noop
          obj['min-height'] = Length.px(item.screenHeight);
          // obj.width = 'fit-content';
          // obj.height = 'fit-content';
          break;
      }      
    } 

    // console.log(obj);
    
    if (item.isInDefault()) {
      obj.width = Length.px(item.screenWidth);
      obj.height = Length.px(item.screenHeight);
    } 

    // console.log(obj);    
    
    if (item.isInFlex()) {
      // flex layout 일 때는 height 를 지정하지 않는다. 
      // FIXME: 방향에 따라 지정해야할 수도 있다. 
      const direction = item.parent['flex-direction']
      if (direction === FlexDirection.ROW || direction === FlexDirection.ROW_REVERSE) {
        // obj.width = Length.px(item.screenWidth);
        obj.width = Length.px(item.screenWidth);
        obj.height = Length.px(item.screenHeight);

        if (item.parent['align-items'] === AlignItems.STRETCH) {
          obj.height = 'auto';
        }

        if (item.resizingVertical === ResizingMode.FILL_CONTAINER) {
          obj.height = 'auto'
          obj['align-self'] = AlignItems.STRETCH;
        }

        // console.log(obj.height, obj['align-self'], item.resizingVertical)

      } else {
        obj.width = Length.px(item.screenWidth);
        obj.height = Length.px(item.screenHeight);

        if (item.parent['align-items'] === AlignItems.STRETCH) {
          obj.width = 'auto';
        }

        if (item.resizingHorizontal === ResizingMode.FILL_CONTAINER) {
          obj.width = 'auto'
          obj['align-self'] = AlignItems.STRETCH;
        }        
      }

    } 
    // console.log(obj);
    if (item.isInGrid()) {
      // NOOP , no width, heigh
    } 
    
    // if (item.isInFlex() && item === false) {
    //   if (item.right?.isNotAuto) {
    //     if (!item.x) {
    //       obj.width = Length.px(item.width);
    //     }

    //   } else {
    //     obj.width = Length.px(item.width);
    //   }

    //   if (item.bottom?.isNotAuto) {
    //     // NOOP
    //     if (!item.y) {
    //       obj.height = Length.px(item.height);
    //     }

    //   } else {
    //     obj.height = Length.px(item.height);
    //   }

    // }

    // console.log(obj);

    return obj;
  }

  /**
   * 
   * @param {Item} item 
   */
  toDefaultCSS(item) {

    let obj = {}

    if (item.isAbsolute) {
      obj.left = Length.px(item.x);
      obj.top = Length.px(item.y);
    }

    let result = {}

    result = Object.assign(result, obj);
    result = Object.assign(result, this.toKeyListCSS(item, [
      'position',
      'overflow',
      'z-index',
      'box-sizing',
      'background-color',
      'color',
      'opacity',
      'mix-blend-mode',
      'transform-origin',
      // 'transform-style',
      'perspective',
      'perspective-origin',
      'font-size',
      'line-height',
      'font-weight',
      'font-family',
      'font-style',
      'text-align',
      'text-transform',
      'text-decoration',
      'letter-spacing',
      'word-spacing',
      'text-indent',
      'border-radius',
      'filter',
      'backdrop-filter',
      'box-shadow',
      'text-shadow',
      'offset-path',
      'animation',
      'transition',
    ]));
    return result;
  }

  /**
   * 
   * @param {Item} item 
   */
  toVariableCSS(item) {

    const v = item.computed('variable', (v) => {
      let obj = {}
      v.split(';').filter(it => it.trim()).forEach(it => {
        const [key, value] = it.split(':')

        obj[`--${key}`] = value;
      })

      return obj;
    })

    return v;
  }

  /**
   * 
   * @param {Item} item 
   */
  toRootVariableCSS(item) {
    let obj = {}
    item.rootVariable.split(';').filter(it => it.trim()).forEach(it => {
      const [key, value] = it.split(':')

      obj[`--${key}`] = value;
    })

    return obj;
  }


  /**
   * 
   * @param {Item} item 
   */
  toRootVariableString(item) {
    return CSS_TO_STRING(this.toRootVariableCSS(item))
  }

  /**
   * convert to only webket css property 
   * @param {*} item 
   */
  toWebkitCSS(item) {
    var results = {}
    WEBKIT_ATTRIBUTE_FOR_CSS.forEach(key => {
      results[`-webkit-${key}`] = item[key];
    })

    return results;
  }


  /**
   * 
   * @param {Item} item 
   */
  toTextClipCSS(item) {

    let results = {}

    if (item['text-clip'] === 'text') {
      results['-webkit-background-clip'] = 'text'
      results['-webkit-text-fill-color'] = 'transparent';
      results['color'] = 'transparent';
    }

    return results;
  }

  /**
   * 
   * @param {Item} item 
   */
  toTransformCSS(item) {

    const results = {
      transform: item['transform']
    }

    if (results.transform === 'rotateZ(0deg)') {
      delete results.transform;
    }

    return {
      transform: results.transform
    };
  }



  /**
   * 
   * @param {Item} item 
   */
  toDefInnerString(item) {

    // TODO: item 의 값이 변화가 없으면 미리 생성된 값을 반환해야한다. 캐슁 전략이 필요함 

    return /*html*/`
      ${this.toClipPath(item)}
      ${this.toSVGFilter(item)}
    `.trim();
  }

  /**
   * 
   * @param {Item} item 
   */
  toClipPath(item) {

    if (item['clip-path'] === '') return '';

    if (!item.cacheClipPathObject) {
      item.setClipPathCache();
    }

    var obj = item.cacheClipPathObject;
    var value = obj.value;

    switch (obj.type) {
      case 'path':
        return /*html*/`<clipPath id="${this.clipPathId(item)}"><path d="${item.clipPathString}" /></clipPath>`
      case 'svg':
        return /*html*/`<clipPath id="${this.clipPathId(item)}">${value}</clipPath>`
    }

    return ``
  }


  toClipPathCSS(item) {
    let str = item['clip-path']

    if (Boolean(str) === false) {
      return null;
    }

    if (!item.cacheClipPathObject) {
      item.setClipPathCache();
    }


    var obj = item.cacheClipPathObject;

    switch (obj.type) {
      case 'path':
        if (obj.value) {
          str = `url(#${this.clipPathId(item)})`
        }
        break;
      case 'svg':
        str = `url(#${this.clipPathId(item)})`
        break;
    }

    return {
      'clip-path': str
    }
  }

  /**
   * 
   * @param {Item} item 
   */
  innerSVGId(item) {
    return item.id + 'inner-svg'
  }

  booleanId(item) {
    return item.id + 'boolean'
  }


  /**
   * 
   * @param {Item} item 
   */
  clipPathId(item) {
    return item.id + 'clip-path'
  }

  /**
   * 
   * @param {Item} item 
   */
  toDefString(item) {
    var str = this.toDefInnerString(item).trim()

    return str ? /*html*/`
    <svg class='inner-svg-element' style="display:block" data-id="${this.innerSVGId(item)}" width="0" height="0">
      <defs>
        ${str}
      </defs>
    </svg>
    ` : ''
  }

  /**
   * 
   * @param {DomItem} item 
   * @param {string} prefix 
   */
  toSelectorString(item, prefix = '') {
    return item.selectors
      .map(selector => selector.toString(prefix))
      .join('\n\n')
  }

  /**
   * 
   * @param {Item} item 
   * @param {string} prefix 
   * @param {string} appendCSS 
   */
  generateView(item, prefix = '', appendCSS = '') {

    //1. 원본 객체의 css 를 생성 
    //2. 원본이 하나의 객체가 아니라 복합 객체일때 중첩 CSS 를 자체 정의해서 생성 
    //3. 이외에 selector 로 생성할 수 있는 css 를 생성 (:hover, :active 등등 )
    var cssString = `
  ${prefix} {  /* ${item.itemType} */
      ${CSS_TO_STRING(this.toCSS(item), '\n    ')}; 
      ${appendCSS}
  }
  ${this.toNestedCSS(item).map(it => {
      return `${prefix} ${it.selector} { 
        ${it.cssText ? it.cssText : CSS_TO_STRING(it.css || {}, '\n\t\t')}; 
    }`
    }).join('\n')}
  ${this.toSelectorString(item, prefix)}
    `
    return cssString;
  }


  /**
   * CSS 리턴 
   * @param {Item} item 
   * @override
   */
  toCSS(item) {

    return Object.assign(
      {},
      this.toVariableCSS(item),
      this.toDefaultCSS(item),
      this.toClipPathCSS(item),
      this.toWebkitCSS(item),
      this.toTextClipCSS(item),
      this.toBoxModelCSS(item),
      this.toBorderCSS(item),
      this.toBackgroundImageCSS(item),
      this.toLayoutCSS(item),
      this.toSizeCSS(item),      
      this.toTransformCSS(item),
      this.toLayoutItemCSS(item)
    );
  }

  /**
   * 
   * @param {Item} item 
   * @param {HtmlRenderer} renderer 
   */
  toStyle(item, renderer) {
    const cssString = this.generateView(item, `[data-renderer-id='${renderer.id}'] .element-item[data-id='${item.id}']`)
    return /*html*/`
<style type='text/css' data-renderer-type="html" data-id='${item.id}'>
${cssString}
</style>
    ` + item.layers.map(it => {
      return renderer.toStyle(it, renderer);
    }).join('')
  }

  toStyleData(item, renderer) {
    const cssString = this.generateView(item, `[data-renderer-id='${renderer.id}'] .element-item[data-id='${item.id}']`)

    return {
      styleTag: `<style type='text/css' data-renderer-type="html" data-id='${item.id}'>${cssString}</style>`,
      cssString
    }
  }

  /**
   * 
   * @param {Item} item 
   * @param {HtmlRenderer} renderer 
   */
  toExportStyle(item, renderer) {
    const cssString = this.generateView(item, `.element-item[data-id='${item.id}']`)
    return /*html*/`
<style type='text/css' data-renderer-type="html" data-id='${item.id}' data-timestamp='${item.timestamp}'>
${cssString}
</style>
    ` + item.layers.map(it => {
      return renderer.toExportStyle(it, renderer);
    }).join('')
  }

  /**
   * 처음 렌더링 할 때 
   * 
   * @param {Item} item 
   * @param {Renderer} renderer
   * @override
   */
  render(item, renderer) {
    var { elementType, id, name, itemType, isBooleanItem } = item;

    const tagName = elementType || 'div'

    return /*html*/`<${tagName} class="element-item ${itemType}" data-is-boolean-item="${isBooleanItem}" data-id="${id}" data-title="${name}">${this.toDefString(item)}${item.layers.map(it => {
      return renderer.render(it, renderer)
    }).join('')}</${tagName}>`
  }

  toSVGFilter(item) {

    if (item.svgfilters.length === 0) return "";

    var filterString = item.computedValue('svgfilters');

    // 변경점이 svgfilters 일 때만 computed 로 다시 캐슁하기 
    // 이전 캐쉬가 없다면 다시 캐쉬 하기 
    if (item.hasChangedField('svgfilters') || !filterString) {

      filterString = item.computed(
        'svgfilters',
        (svgfilters) => {
          var filterString = svgfilters.map(svgfilter => {
            return /*html*/`
              <filter id='${svgfilter.id}'>
                ${svgfilter.filters.map(filter => SVGFilter.parse(filter)).join('\n')}
              </filter>`
          }).join('')

          return filterString;
        },
        true  // 캐쉬 강제로 생성하기 
      )
    }

    return filterString
  }


  renderSVG(item, renderer) {

  }

  /**
   * 
   * @param {Item} item 
   */
  toNestedCSS(item) {
    const result = [];

    return result;
  }

  /**
   * 초기 렌더링 이후 업데이트만 할 때 
   * 
   * @param {Item} item 
   * @param {Dom} currentElement 
   * @override
   */
  update(item, currentElement) {
    if (!currentElement) return;

    let $svg = currentElement.el.$svg;
    let $booleanSvg = currentElement.el.$booleanSvg;

    if (!$svg) {
      currentElement.el.$svg = currentElement.$(`[data-id="${this.innerSVGId(item)}"]`);
      $svg = currentElement.el.$svg

      currentElement.el.$booleanSvg = currentElement.$(`[data-id="${this.booleanId(item)}"]`);
      $booleanSvg = currentElement.el.$booleanSvg
    }

    if (currentElement.data('is-boolean-item') !== `${item.isBooleanItem}`) {
      currentElement.attr('data-is-boolean-item', item.isBooleanItem)
    }

    if ($svg) {

      const defString = this.toDefInnerString(item)

      if (defString) {
        var $defs = $svg.$('defs');
        $defs.updateSVGDiff(`<defs>${defString}</defs>`)
      }

    } else {
      const defString = this.toDefString(item)

      if (defString) {
        var a = Dom.createByHTML(defString);
        if (a) {
          currentElement.prepend(a);
        }
      }
    }

  }
}