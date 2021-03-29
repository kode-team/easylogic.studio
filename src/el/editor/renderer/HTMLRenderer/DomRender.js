import Dom from "el/base/Dom";
import { CSS_TO_STRING, isNotUndefined, keyEach, OBJECT_TO_CLASS, OBJECT_TO_PROPERTY, STRING_TO_CSS } from "el/base/functions/func";
import { Item } from "el/editor/items/Item";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import { Pattern } from "el/editor/property-parser/Pattern";
import { Transform } from "el/editor/property-parser/Transform";
import ItemRender from "./ItemRender";

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

    if (item['background-image'] === '' && item.pattern === '') {
      return ZERO_CONFIG
    }

    let list = [];

    if (item.pattern) {
      const patternList = Pattern.parseStyle(item.pattern);
      for(var i = 0, len = patternList.length; i < len; i++)   {
        list.push.apply(list, BackgroundImage.parseStyle(STRING_TO_CSS(patternList[i].toCSS())))
      }
    }

    if (item['background-image']) {
      list.push.apply(list, BackgroundImage.parseStyle(STRING_TO_CSS(item['background-image'])))
    }

    if (list.length) {
      return BackgroundImage.joinCSS(list);
    }

    return {}; 
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
    var parentLayout =  item.parent['layout'];
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
      obj = {
        ...obj, 
        ...STRING_TO_CSS(item['flex-layout-item'])
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
    return this.toStringPropertyCSS(item, 'border')
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

    args.filter(it => isNotUndefined(item[it])).forEach( it => {
        obj[it] = item[it]
    })

    return obj;
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
    }

    obj.visibility = (item.visible) ? 'visible' : 'hidden';

    return {
      ...obj,
      ...this.toKeyListCSS(item, [
        'position', 
        // 'right',
        // 'bottom', 
        'width',
        'height', 
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
      ])
    }

  }

  /**
   * 
   * @param {Item} item 
   */
  toVariableCSS (item) {
    let obj = {}
    item.variable.split(';').filter(it => it.trim()).forEach(it => {
      const [key, value] = it.split(':')

      obj[`--${key}`] = value; 
    })
    return obj;
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
    if (item.rotate === '0deg' && item.transform === '') {
      return ZERO_CONFIG;
    } else if (item.rotate.value === 0 && item.transform === '') {
      return ZERO_CONFIG;
    }

    const key = [item['transform'], item['rotate']].join(":::");

    if (key != this._transformCacheKey) {
      this._transformCache = Transform.rotate(item['transform'], item['rotate'])
      this._transformCacheKey = key; 
    }

    const results = {
      transform: this._transformCache
    } 

    if (results.transform === 'rotate(0deg)') {
      delete results.transform;
    }

    return results;
  }     

 

  /**
   * 
   * @param {Item} item 
   */
  toDefInnerString (item) {
    return /*html*/`
      ${this.toClipPath(item)}
    `.trim();
  }

  /**
   * 
   * @param {Item} item 
   */
  toClipPath(item) {

    if (item['clip-path'] === '') return '';

    var obj = ClipPath.parseStyle(item['clip-path']);
    var value = obj.value; 

    switch (obj.type) {
    case 'path':
      return /*html*/`<clipPath id="${this.clipPathId(item)}"><path d="${value}" /></clipPath>`
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
    
    var obj = ClipPath.parseStyle(str)

    switch (obj.type) {
    case 'path': 
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
    <svg class='inner-svg-element' data-id="${this.innerSVGId(item)}" width="0" height="0">
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
    const cssString = this.generateView(item, `.element-item[data-id='${item.id}']`)
    return /*html*/`
        <style type='text/css' data-id='${item.id}' data-timestamp='${item.timestamp}'>${cssString}</style>
    ` + item.layers.map(it => {
      return renderer.toStyle(it, renderer);
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
  
    return /*html*/`    
      <${tagName} class="${OBJECT_TO_CLASS({
          'element-item': true,
          [itemType]: true 
        })}" ${OBJECT_TO_PROPERTY({
          'data-id': id,
          'data-title': name 
        })}>
        ${this.toDefString(item)}
        ${item.layers.map(it => {
          return renderer.render(it, renderer)
        }).join('\n\t')}
      </${tagName}>
    `
  }

  renderSVG (item, renderer) {
    
  }

  /**
   * 
   * @param {Item} item 
   */
  toNestedCSS(item) {
    return []
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

    // clip-path 가 있을 때만 변경 
    if (item.lastChangedField && !item.lastChangedField['clip-path']) {
      return;
    }


    let $svg = currentElement.el.$svg;

    if (!$svg) { 
      currentElement.el.$svg = currentElement.$(`[data-id="${this.innerSVGId(item)}"]`);  
      $svg = currentElement.el.$svg
    }

    if ($svg) {

      const defInnerString = this.toDefInnerString(item)

      if (defInnerString) {
        var $defs = $svg.$('defs');
        $defs.html(defInnerString)
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