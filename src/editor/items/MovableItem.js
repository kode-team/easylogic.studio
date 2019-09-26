import { Item } from "./Item";
import { Length } from "../unit/Length";
import { round } from "../../util/functions/math";
import { Transform } from "../css-property/Transform";
import matrix from "../../util/functions/matrix";
import Dom from "../../util/Dom";

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

    toCloneObject() {
        return {
            ...super.toCloneObject(),
            x: this.json.x + '',
            y: this.json.y + '',
            width: this.json.width + '',
            height: this.json.height + ''
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
    }

    setScreenX2(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - this.json.width.value - absoluteX);
    }    

    setScreenY2(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }

        this.json.y.set(value - this.json.height.value - absoluteY);
    }        


    setScreenXCenter(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - round(this.json.width.value/2, 1) - absoluteX);
    }        



    setScreenYMiddle(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }

        this.json.y.set(value - round(this.json.height.value/2, 1) - absoluteY);
    }            


    setScreenY(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }
        this.json.y.set(value - absoluteY);
    }    

    get screenX () { 

        if (this.isChild) {
            return Length.px(this.json.parent.screenX.value + this.json.x.value); 
        }

        return this.json.x || Length.px(0) 
    }
    get screenY () { 

        if (this.isChild) {
            return Length.px(this.json.parent.screenY.value + this.json.y.value); 
        }        
        return this.json.y || Length.px(0) 
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
        return {
            top: `${this.json.y}`,
            left: `${this.json.x}`,
            width: `${this.json.width}`,
            height: `${this.json.height}`
        }
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
}