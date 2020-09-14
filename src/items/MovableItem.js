import { Item } from "./Item";
import { Length } from "@unit/Length";
import { Transform } from "../property-parser/Transform";
import matrix from "@core/functions/matrix";
import Dom from "@core/Dom";

export class MovableItem extends Item {


    get isAbsolute  (){
        return this.json.position === 'absolute'; 
    }

    get isRelative  (){
        return this.json.position === 'relative'; 
    }

    get isChild() {
        if (this.json.parent) {
            var isParentDrawItem = this.json.parent.is('project') === false; 

            if (isParentDrawItem && this.isAbsolute) {
                return true; 
            }
        }

        return false; 
    }

    toCloneObject(isDeep = true) {
        return {
            ...super.toCloneObject(isDeep),
            x: this.json.x + '',
            y: this.json.y + '',
            width: this.json.width + '',
            height: this.json.height + '',
            screenX: this.screenX,
            screenY: this.screenY,
            screenWidth: this.screenWidth,
            screenHeight: this.screenHeight
        }
    }

    convert (json) {
        json = super.convert(json);

        json.x = Length.parse(json.x);
        json.y = Length.parse(json.y);
        json.width = Length.parse(json.width);
        json.height = Length.parse(json.height);

        return json; 
    }

    //////////////////////
    //
    // getters 
    //
    ///////////////////////

    setScreenX(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - absoluteX);
        this.changed();
    }

    setScreenX2(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - this.json.width.value - absoluteX + 1);
        this.changed();        
    }    

    setScreenY2(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }

        this.json.y.set(value - this.json.height.value - absoluteY + 1);
        this.changed();        
    }        


    setScreenXCenter(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - (this.json.width.value/2) - absoluteX + 1);
        this.changed();        
    }        



    setScreenYMiddle(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }

        this.json.y.set(value - (this.json.height.value/2) - absoluteY + 1);
        this.changed();        
    }            


    setScreenY(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }
        this.json.y.set(value - absoluteY);
        this.changed();        
    }    

    get screenX () { 

        if (this.isChild) {
            return Length.px(this.json.parent.screenX.value + this.json.x.value); 
        }

        return this.json.x || Length.z() 
    }
    get screenY () { 

        if (this.isChild) {
            return Length.px(this.json.parent.screenY.value + this.json.y.value); 
        }        
        return this.json.y || Length.z() 
    }
    get screenX2 () { 
        return Length.px(this.screenX.value + this.json.width.value) 
    }
    get screenY2 () { 
        return Length.px(this.screenY.value + this.json.height.value) 
    }    


    get screenWidth () { return this.json.width;  }

    get screenHeight () { return this.json.height;  }    

    /**
     * 화면상의 순수 위치 (left, top, width, height)
     * 
     * 상위 Layer 가 flex, grid 를 가지면 하위는 dom 기준으로 자동으로 연산 ..  
     * 
     */
    get screenRect () {
        return {
            left: this.screenX,
            top: this.screenY,
            width: this.screenWidth,
            height: this.screenHeight
        }
    }

    get centerX () { 
        var half = 0; 
        if (this.json.width.value != 0) {
            half = Math.floor(this.json.width.value / 2)
        }
        return Length.px(this.screenX.value + half) 
    }
    get centerY () { 
        var half = 0; 
        if (this.json.height.value != 0) {
            half = Math.floor(this.json.height.value / 2)
        }
        
        return Length.px(this.screenY.value + half) 
    }    


    checkInArea (area) {
        if (area.x2.value < this.screenX.value) { return false; }
        if (area.y2.value < this.screenY.value) { return false; }
        if (area.x.value > this.screenX2.value) { return false; }
        if (area.y.value > this.screenY2.value) { return false; }

        return true;
    }

    toBoundCSS() {
        var {
            x: left, 
            y: top, 
            width, 
            height, 
            transform,
            'transform-origin': transformOrigin
        } = this.json; 
        return {
            top,left,width, height, transform, 'transform-origin': transformOrigin
        }
    }

    get transformOrigin () {
        var [left, top] = (this.json['transform-origin'] || '50% 50%').split(' ').map(it => {
            return Length.parse(it || '50%');
        })

        left = left.toPx(this.screenWidth.value);
        top = top.toPx(this.screenHeight.value);

        return {left, top}
    }

    move (x, y) {
        this.reset({ x, y })
        return this;         
    }

    moveX (x) {
        this.reset ( { x })
        return this;         
    }

    moveY (y) {
        this.reset ( { y })

        return this; 
    }

    resize (width, height) {
        if (width.value >= 0 && height.value >= 0) {
            this.reset ({ width, height })
        }

        return this; 
    }

    resizeWidth (width) {
        if (width.value >= 0) {
            this.reset ({ width })
        }

        return this; 
    }

    resizeHeight ( height ) {
        if (height.value >= 0) {
            this.reset ({ height })
        }

        return this;
    }

    get screenTransform () {
        return Transform.addTransform(this.json.parent.screenTransform, this.json.transform);
    }

    getTransform (element) {
        var list = Transform.parseStyle(Dom.create(element).css('transform'));

        var m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        if (list.length) {
            m = list[0].value.map(it => +it);

        } else {
            return {
                rotate : {x: 0, y: 0, z: 0},
                translate: {x: 0, y: 0, z: 0}
            }
        }

        var m11 = m[0],  m21 = m[1],  m31 = m[2], m41 = m[3];
        var m12 = m[4],  m22 = m[5],  m32 = m[6], m42 = m[7];
        var m13 = m[8],  m23 = m[9],  m33 = m[10], m43 = m[11];
        var m14 = m[12], m24 = m[13], m34 = m[14], m44 = m[15];
        

        var rotateY = Math.asin(-m13);
        var rotateX;
        var rotateZ;
     
        if (Math.cos(rotateY) !== 0) {
            rotateX = Math.atan2(m23, m33);
            rotateZ = Math.atan2(m12, m11);
        } else {
            rotateX = Math.atan2(m31, m22);
            rotateZ = 0;
        }

        var translateX = m14;
        var translateY = m24;
        var translateZ = m34;


        return {
            rotate: { x: rotateX, y: rotateY, z: rotateZ },
            translate: { x: translateX, y: translateY, z: translateZ }
        };
    }    

    verties ($el, rootElement) {

        var {height: offsetHeight, width: offsetWidth} = $el.offsetRect()

        var w = offsetWidth / 2;
        var h = offsetHeight / 2;

        var v = {
            a: {x: -w, y: -h, z: 0},
            b: {x: w, y: -h, z: 0},
            c: {x: w, y: h, z: 0},
            d: {x: -w, y: h, z: 0}
        };

        var transform = this.getTransform($el.el);
        while ($el.el) {
            transform = this.getTransform($el.el);

            v.a = matrix.addVector(matrix.rotateVector(v.a, transform.rotate), transform.translate);
            v.b = matrix.addVector(matrix.rotateVector(v.b, transform.rotate), transform.translate);
            v.c = matrix.addVector(matrix.rotateVector(v.c, transform.rotate), transform.translate);
            v.d = matrix.addVector(matrix.rotateVector(v.d, transform.rotate), transform.translate);

            $el = $el.parent();
            if ($el.el === rootElement) {
                break; 
            }
        }        

        return v; 
    }


  checkInAreaForLayers(area) {
    var items = [] 
    this.layers.forEach(layer => {

      items.push(...layer.checkInAreaForLayers(area));

      if (layer.checkInArea(area)) {
        items.push(layer);
      }
    })

    return items; 
  }

  /** order by  */

  getIndex () {
    var parentLayers = this.json.parent.layers;    
    var startIndex = -1; 
    for(var i = 0, len = parentLayers.length; i < len; i++) {
      if (parentLayers[i] === this.ref) {
        startIndex = i; 
        break;
      }
    }

    return startIndex;
  }

  setOrder (targetIndex) {
    var parent = this.json.parent; 

    var startIndex = this.getIndex()

    if (startIndex > -1) {
      parent.layers[startIndex] = parent.layers[targetIndex]
      parent.layers[targetIndex] = this.ref; 
    }
  }

  // get next sibiling item 
  next () {
    if (this.isLast()) {
      return this.ref; 
    }

    const index = this.getIndex();

    return this.json.parent.layers[index+1];
  }

  // get prev sibiling item   
  prev () {
    if (this.isFirst()) {
      return this.ref; 
    }

    const index = this.getIndex();

    return this.json.parent.layers[index-1];    
  }

  /**
   * 레이어를 현재의 다음으로 보낸다. 
   * 즉, 화면상에 렌더링 영역에서 올라온다. 
   */
  orderNext() {   

    if (this.isLast()) {
      // 마지막 일 때는  
      // parent 의 next 의 첫번째 요소가 된다. 
      if (this.json.parent.is('artboard')) {    // 부모가 artboard 이면  더이상 갈 곳이 없다. 
        return; 
      }

      this.json.parent.next().add(this, 'prepend')
      return; 
    }

    var startIndex = this.getIndex();
    if (startIndex > -1) {
        this.setOrder(startIndex + 1);
    }
  }

  isFirst () {
    return this.getIndex() === 0;
  }

  isLast () {
    return this.getIndex() === this.json.parent.layers.length-1
  }

  /**
   * 레이어를 현재의 이전으로 보낸다. 
   * 즉, 화면상에 렌더링 영역에서 내려간다.
   */  
  orderPrev () {
    if (this.isFirst()) {
      // 처음 일 때는  
      // parent 의 prev 의 마지막 요소가 된다.

      if (this.json.parent.is('artboard')) {    // 부모가 artboard 이면  더이상 갈 곳이 없다. 
        return; 
      }

      this.json.parent.prev().add(this)
      return; 
    }

    var startIndex = this.getIndex();
    if (startIndex > 0) {
      this.setOrder(startIndex - 1);
    }
  }

  // 부모의 처음으로 보내기 
  orderFirst () {
    this.setOrder(0)
  }

  // 부모의 마지막으로 보내기 
  orderLast () {
    this.setOrder(this.json.parent.layers.length-1)
  }

  //TODO: 전체중에 처음으로 보내기 
  orderTop() {}
  //TODO: 전체중에 마지막으로 보내기 
  orderBottom () {}
}