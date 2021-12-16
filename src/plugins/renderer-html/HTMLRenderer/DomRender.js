import Dom from "el/sapa/functions/Dom";
import { isNotUndefined } from "el/sapa/functions/func";
import { Item } from "el/editor/items/Item";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import { Pattern } from "el/editor/property-parser/Pattern";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import ItemRender from "./ItemRender";
import { SVGFilter } from 'el/editor/property-parser/SVGFilter';

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
  toStringPropertyCSS (item, field) {
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

    return item.cacheBackgroundImage; 
  }

  /**
   * 
   * @param {Item} item 
   */
  toLayoutCSS (item) {

    const layout = item.layout ;

    if (item.hasLayout()) {
      if (layout === 'flex') {
        return this.toFlexLayoutCSS(item)
      } else if  (layout === 'grid') {
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
    var parentLayout =  item.parent?.['layout'];
    var obj = {}
    if (parentLayout === 'flex') {
      // 부모가  layout 이  지정 됐을 때 자식item 들은 position: relative 기준으로 동작한다. , left, top 은  속성에서 삭제 
      obj = {
        position: 'relative',
        left: 'auto !important',
        top: 'auto !important',
      }
    } else if (parentLayout === 'grid') {
      // 부모가  layout 이  지정 됐을 때 자식item 들은 position: relative 기준으로 동작한다. , left, top 은  속성에서 삭제 
      obj = {
        position: 'relative',
        left: 'auto !important',
        top: 'auto !important',
        width: 'auto !important',
        height: 'auto !important',        
      }

    }

    if (parentLayout === 'flex') {

      let itemInfo = item['flex-layout-item'];

      if (itemInfo === 'auto') {
        obj['flex'] = 'auto'
      } else {
        obj = Object.assign(obj, STRING_TO_CSS(itemInfo));
      }

    } else if (parentLayout  === 'grid') {
      obj = {
        ...obj, 
        ...STRING_TO_CSS(item['grid-layout-item'])
      }
    }

    return obj;
  }


  /**
   * 
   * @param {Item} item 
   */
  toFlexLayoutCSS(item) {
    return {
      display: 'flex',
      ...this.toStringPropertyCSS(item, 'flex-layout')
    }
  }  

  /**
   * 
   * @param {Item} item 
   */
  toGridLayoutCSS(item) {
    return {
      display: 'grid',
      ...this.toStringPropertyCSS(item, 'grid-layout')
    }
  }  

  /**
   * 
   * @param {Item} item 
   */
  toBorderCSS(item) {
    if (item.hasChildren()) return {}; 

    return item.computed('border', (border) => {
      return STRING_TO_CSS(border);
    })
  }

  toKeyCSS (key) {
    if (!item[key]) return {} 
    return {
      [key] : item[key]
    };
  }


  toBoxModelCSS(item) {
    let obj = {};

    if (item['margin-top']) obj["margin-top"] = item['margin-top'];
    if (item['margin-bottom']) obj["margin-bottom"] = item['margin-bottom'];
    if (item['margin-left']) obj["margin-left"] = item['margin-left'];
    if (item['margin-right']) obj["margin-right"] = item['margin-right'];

    if (item['padding-top']) obj["padding-top"] = item['padding-top'];
    if (item['padding-bottom']) obj["padding-bottom"] = item['padding-bottom'];
    if (item['padding-left']) obj["padding-left"] = item['padding-left'];
    if (item['padding-right']) obj["padding-right"] = item['padding-right'];


    return obj;
  }  


  /**
   * 
   * @param {Item} item 
   * @param {string[]} parameters 표현될 속성 리스트   
   */
  toKeyListCSS (item, args = []) {
    let obj = {};

    args.filter(it => isNotUndefined(item.json[it])).forEach( it => {
        obj[it] = item.json[it]
    })

    return obj;
  }

  toSizeCSS(item) {
    const obj = {}

    if (item.right && item.right.unit !== 'auto') {
      // NOOP
    } else {
      obj.width = item.width;
    }

    if (item.bottom && item.bottom.unit !== 'auto') {
      // NOOP
    } else {
      obj.height = item.height;
    }


    return {
      ...obj,
    }
  }

  /**
   * 
   * @param {Item} item 
   */
  toDefaultCSS(item) {

    let obj = {}

    if (item.isAbsolute) {
      if (item.x)  {
        obj.left = item.x ;
      }
      if (item.y)  {
        obj.top = item.y ;
      }

      if (item.right) {
        obj.right = item.right;
      }

      if (item.bottom) {
        obj.bottom = item.bottom;
      }
    }

    let result = {}

    result = Object.assign(result, obj);
    result = Object.assign(result, this.toKeyListCSS(item, [
      'position', 

      // 'right',
      // 'bottom', 
      // 'width',
      // 'height', 
      'overflow', 
      'z-index', 
      'box-sizing',
      'background-color', 
      'color',  
      'opacity', 
      'mix-blend-mode',
      'transform-origin', 
      'transform-style', 
      'perspective', 
      'perspective-origin',
      'font-size', 
      'font-stretch', 
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
  toVariableCSS (item) {

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
  toRootVariableCSS (item) {
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
  toRootVariableString (item) {
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

    // transform 이 없을 때는 공백 리턴 
    if (item.transform === '') {
      return ZERO_CONFIG;
    }

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
  toDefInnerString (item) {
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


  toClipPathCSS (item) {
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
  clipPathId (item) {
    return item.id + 'clip-path'
  }    

  /**
   * 
   * @param {Item} item 
   */
  toDefString (item) {
    var str = this.toDefInnerString(item)

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
  toSelectorString (item, prefix = '') {
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
  generateView (item, prefix = '', appendCSS = '') {

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
      this.toSizeCSS(item),
      this.toClipPathCSS(item),
      this.toWebkitCSS(item), 
      this.toTextClipCSS(item),      
      this.toBoxModelCSS(item),
      this.toBorderCSS(item),
      this.toBackgroundImageCSS(item),
      this.toLayoutCSS(item),
      this.toTransformCSS(item),                  
      this.toLayoutItemCSS(item)
    );
  }

  /**
   * 
   * @param {Item} item 
   * @param {HtmlRenderer} renderer 
   */
  toStyle (item, renderer) {
    const cssString = this.generateView(item, `[data-renderer-id='${renderer.id}'] .element-item[data-id='${item.id}']`)
    return /*html*/`
<style type='text/css' data-renderer-type="html" data-id='${item.id}' data-timestamp='${item.timestamp}'>
${cssString}
</style>
    ` + item.layers.map(it => {
      return renderer.toStyle(it, renderer);
    }).join('')
  }

  /**
   * 
   * @param {Item} item 
   * @param {HtmlRenderer} renderer 
   */
   toExportStyle (item, renderer) {
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
  render (item, renderer) {
    var {elementType, id, name, itemType} = item;
  
    const tagName = elementType || 'div'
  
    return /*html*/`<${tagName} class="element-item ${itemType}" data-id="${id}" data-title="${name}">
  ${this.toDefString(item)}
  ${item.layers.map(it => {
    return renderer.render(it, renderer)
  }).join('')}
  ${this.renderVirtualArea(item, renderer)}
</${tagName}>`
  }

  renderVirtualArea (item, renderer) {

    if (item.isBooleanPath) {
      const layers = item.layers;
      return /*html*/`
        <svg data-id="${this.booleanId(item)}" width="100%" height="100%" style="position:absolute;left:0px;top:0px;pointer-events:none;overflow: visible;">
          <path d="${item['boolean-path']}" fill="yellow" stroke="${layers[0].stroke}" stroke-width="${layers[0]['stroke-width']}" />
        </svg>
      `
    }

    return "";
  }

  toSVGFilter (item) {
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


  renderSVG (item, renderer) {
    
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
  update (item, currentElement) {
    if (!currentElement) return; 

    let $svg = currentElement.el.$svg;
    let $booleanSvg = currentElement.el.$booleanSvg;

    if (!$svg) { 
      currentElement.el.$svg = currentElement.$(`[data-id="${this.innerSVGId(item)}"]`);  
      $svg = currentElement.el.$svg

      currentElement.el.$booleanSvg = currentElement.$(`[data-id="${this.booleanId(item)}"]`);
      $booleanSvg = currentElement.el.$booleanSvg
    }

    if ($booleanSvg) {
      const svgString = this.renderVirtualArea(item);

      if (svgString) {
        $booleanSvg.updateDiff(Dom.createByHTML(svgString).firstChild)
      }      
    } else {
      const svgString = this.renderVirtualArea(item);

      var a = Dom.createByHTML(svgString);

      if (a) {
        currentElement.append(a);
        currentElement.el.$booleanSvg = currentElement.$(`[data-id="${this.booleanId(item)}"]`);  
      }

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