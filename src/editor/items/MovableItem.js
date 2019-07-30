import { Item } from "./Item";
import { Length } from "../unit/Length";
import { round } from "../../util/functions/math";

const zero = Length.px(0)

export class MovableItem extends Item {


    get isAbsolute  (){
        return this.json.position === 'absolute'; 
    }

    get isRelative  (){
        return this.json.position === 'relative'; 
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
        if (this.json.parent && this.isAbsolute) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - absoluteX);
    }

    setScreenX2(value) {
        var absoluteX = 0;
        if (this.json.parent && this.isAbsolute) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - this.json.width.value - absoluteX);
    }    

    setScreenY2(value) {
        var absoluteY = 0;
        if (this.json.parent && this.isAbsolute) {
            absoluteY = this.json.parent.screenY.value; 
        }

        this.json.y.set(value - this.json.height.value - absoluteY);
    }        


    setScreenXCenter(value) {
        var absoluteX = 0;
        if (this.json.parent && this.isAbsolute) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - round(this.json.width.value/2, 1) - absoluteX);
    }        



    setScreenYMiddle(value) {
        var absoluteY = 0;
        if (this.json.parent && this.isAbsolute) {
            absoluteY = this.json.parent.screenY.value; 
        }

        this.json.y.set(value - round(this.json.height.value/2, 1) - absoluteY);
    }            


    setScreenY(value) {
        var absoluteY = 0;
        if (this.json.parent && this.isAbsolute) {
            absoluteY = this.json.parent.screenY.value; 
        }
        this.json.y.set(value - absoluteY);
    }    

    get screenX () { 

        if (this.json.parent && this.isAbsolute) {
            return Length.px(this.json.parent.screenX.value + this.json.x.value); 
        }

        return this.json.x || Length.px(0) 
    }
    get screenY () { 

        if (this.json.parent && this.isAbsolute) {
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

        if (area.width.value === 0) {return false; }
        if (area.height.value === 0) {return false; } 
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
}