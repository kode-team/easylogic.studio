import Dom from "el/sapa/functions/Dom";
import { CSS_TO_STRING, isNotUndefined, STRING_TO_CSS } from "el/sapa/functions/func";
import { Item } from "el/editor/items/Item";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import { Pattern } from "el/editor/property-parser/Pattern";
import { Border } from "el/editor/property-parser/Border";
import { mat4 } from "gl-matrix";
import ItemRender from "./ItemRender";

import { Length } from 'el/editor/unit/Length';

const ZERO_CONFIG = {}

const WEBKIT_ATTRIBUTE_FOR_CSS = [
  'text-fill-color', 
  'text-stroke-color', 
  'text-stroke-width', 
  'background-clip'
]

export default class DomRender extends ItemRender {
    

  /**
   * mat4 를 mat3 으로 변경한다. 
   */ 
   setTransform(canvas, item) {
    const transform = mat4.transpose([],  item.transformWithTranslate)
    canvas.concat(transform);
  }

  drawBorder(item, renderer) {
    let { CanvasKit, surface, editor, canvas } = renderer;
    canvas = canvas || surface.getCanvas();

    const border = Border.parseValue(item.border);
    const borderWidth = Length.parse(border.width || 0).value
    const halfBorderWidth = borderWidth / 2;
    // console.log(border);
    // console.log(CanvasKit.PaintStyle.Stroke);    
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.parseColorString(border.color || 'transparent'));
    paint.setStyle(CanvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(borderWidth);
    paint.setAntiAlias(true);

    const strokeRect = CanvasKit.XYWHRect(halfBorderWidth,halfBorderWidth,item.screenWidth-borderWidth,item.screenHeight-borderWidth)

    // console.log(stroke);
    canvas.drawRect(strokeRect, paint);    
  }

  toFillPaint(item, renderer) {
    let { CanvasKit, surface, editor, canvas } = renderer;

    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.parseColorString(item['background-color'] || 'white'));
    paint.setStyle(CanvasKit.PaintStyle.Fill);
    paint.setAntiAlias(true);

    return paint;

  }

  /**
   * Artboard 템플릿 설정 
   * 
   * @param {Item} item 
   * @param {Renderer} renderer
   * @override
   */
   renderItem(item, renderer) {
    let { CanvasKit, surface, editor, canvas } = renderer;

    canvas = canvas || surface.getCanvas();


    canvas.save();

    this.setTransform(canvas, item);


    const backgroundRect = CanvasKit.XYWHRect(0,0,item.screenWidth,item.screenHeight)

    canvas.drawRect(backgroundRect, this.toFillPaint(item, renderer));    

    this.drawBorder(item, renderer);    


    item.layers.forEach(layer => {
      renderer.renderItem(layer, renderer);
    })

    canvas.restore();

  }  

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

    args.filter(it => isNotUndefined(item.json[it])).forEach( it => {
        obj[it] = item.json[it]
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

    const result = {}

    result = Object.assign(result, obj);
    result = Object.assign(result, this.toKeyListCSS(item, [
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
    
    var obj = ClipPath.parseStyle(str)

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
<style type='text/css' data-renderer-type="html" data-id='${item.id}' data-timestamp='${item.timestamp}'>
${cssString}
</style>
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
<${tagName} class="element-item ${itemType}" data-id="${id}" data-title="${name}">
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